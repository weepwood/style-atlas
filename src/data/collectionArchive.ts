import JSZip from 'jszip'
import { curatedEntries, parseCollectionBackup } from './collectionEntries.ts'
import type { CollectionBackup } from './collectionEntries.ts'
import { MAX_IMAGE_STORED_BYTES } from './collectionImageStore.ts'

const MAX_ARCHIVE_BYTES = 80 * 1024 * 1024
const MAX_IMAGES = 500
const ALLOWED_TYPES = ['image/webp', 'image/png', 'image/jpeg'] as const

export interface ArchivedImage { id: string; blob: Blob }
export interface CompleteArchive {
  backup: CollectionBackup
  images: ArchivedImage[]
}
interface ArchiveManifest {
  format: 'weepwood-ui-atlas'
  version: 1
  images: Array<{ id: string; file: string; type: string }>
}

export async function generateCollectionArchive(backup: CollectionBackup, images: ArchivedImage[]): Promise<Blob> {
  parseCollectionBackup(backup)
  if (images.length > MAX_IMAGES) throw new Error('截图数量不能超过 500')
  const allowed = new Set([...curatedEntries.map((e) => e.id), ...backup.entries.map((e) => e.id)])
  const zip = new JSZip()
  zip.file('collection.json', JSON.stringify(backup, null, 2))
  const files: ArchiveManifest['images'] = []
  let total = 0
  for (const [index, image] of images.entries()) {
    if (!allowed.has(image.id) || !ALLOWED_TYPES.includes(image.blob.type as typeof ALLOWED_TYPES[number])) throw new Error('截图 ID 或图片类型无效')
    if (files.some((v) => v.id === image.id)) throw new Error('重复的截图 ID')
    if (image.blob.size === 0 || image.blob.size > MAX_IMAGE_STORED_BYTES) throw new Error('截图大小超出限制')
    total += image.blob.size
    if (total > MAX_ARCHIVE_BYTES) throw new Error('截图合计不能超过 80 MB')
    const ext = image.blob.type === 'image/png' ? 'png' : image.blob.type === 'image/jpeg' ? 'jpg' : 'webp'
    const file = 'images/' + index + '.' + ext
    zip.file(file, new Uint8Array(await image.blob.arrayBuffer()), { binary: true, compression: 'STORE' })
    files.push({ id: image.id, file, type: image.blob.type })
  }
  zip.file('manifest.json', JSON.stringify({ format: 'weepwood-ui-atlas', version: 1, images: files } satisfies ArchiveManifest, null, 2))
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 3 } })
}

export async function parseCollectionArchive(input: Blob): Promise<CompleteArchive> {
  if (input.size === 0 || input.size > MAX_ARCHIVE_BYTES + 2 * 1024 * 1024) throw new Error('ZIP 备份不能超过 82 MB')
  const zip = await JSZip.loadAsync(new Uint8Array(await input.arrayBuffer()), { checkCRC32: true })
  const collectionFile = zip.file('collection.json')
  const manifestFile = zip.file('manifest.json')
  if (!collectionFile || !manifestFile) throw new Error('ZIP 缺少 collection.json 或 manifest.json')
  if (zip.files && Object.keys(zip.files).length > MAX_IMAGES + 4) throw new Error('ZIP 文件数量过多')
  // JSZip stores the declared uncompressed sizes for loaded ZIP entries.
  // Reject suspicious archives *before* allocating the expanded payload.
  let declaredTotal = 0
  for (const [name, file] of Object.entries(zip.files)) {
    if (file.dir) continue
    const data = file as unknown as { _data?: { uncompressedSize?: number } }
    const size = data._data?.uncompressedSize
    if (typeof size !== 'number' || !Number.isSafeInteger(size) || size < 0) {
      throw new Error('ZIP 文件大小信息不完整')
    }
    const max = name === 'collection.json' ? 2 * 1024 * 1024 : name === 'manifest.json' ? 256 * 1024 : MAX_IMAGE_STORED_BYTES
    if (size > max) throw new Error('ZIP 内有过大的文件')
    declaredTotal += size
    if (declaredTotal > MAX_ARCHIVE_BYTES + 2 * 1024 * 1024) throw new Error('ZIP 解压后内容过大')
  }
  const backup = parseCollectionBackup(JSON.parse(await collectionFile.async('string')) as unknown)
  const manifest = JSON.parse(await manifestFile.async('string')) as unknown
  if (!manifest || typeof manifest !== 'object') throw new Error('ZIP 清单格式错误')
  const data = manifest as Record<string, unknown>
  if (data.format !== 'weepwood-ui-atlas' || data.version !== 1 || !Array.isArray(data.images) || data.images.length > MAX_IMAGES) throw new Error('不支持的截图备份版本')
  const allowed = new Set([...curatedEntries.map((e) => e.id), ...backup.entries.map((e) => e.id)])
  const ids = new Set<string>()
  const images: ArchivedImage[] = []
  let total = 0
  for (const value of data.images) {
    if (!value || typeof value !== 'object') throw new Error('ZIP 截图信息非法')
    const item = value as Record<string, unknown>
    if (typeof item.id !== 'string' || !allowed.has(item.id) || ids.has(item.id)) throw new Error('ZIP 截图 ID 非法或重复')
    if (typeof item.file !== 'string' || !/^images\/[0-9]+\.(webp|png|jpg)$/.test(item.file)) throw new Error('ZIP 内含非法图片路径')
    if (typeof item.type !== 'string' || !ALLOWED_TYPES.includes(item.type as typeof ALLOWED_TYPES[number])) throw new Error('ZIP 图片类型不受支持')
    if ((item.file.endsWith('.png') && item.type !== 'image/png') || (item.file.endsWith('.jpg') && item.type !== 'image/jpeg') || (item.file.endsWith('.webp') && item.type !== 'image/webp')) throw new Error('ZIP 图片后缀与类型不一致')
    const file = zip.file(item.file)
    if (!file) throw new Error('ZIP 缺失图片文件')
    const bytes = await file.async('uint8array')
    if (!bytes.length || bytes.length > MAX_IMAGE_STORED_BYTES) throw new Error('ZIP 中的图片超过 4 MB')
    total += bytes.length
    if (total > MAX_ARCHIVE_BYTES) throw new Error('ZIP 解压后截图超出 80 MB')
    const header = bytes.subarray(0, 16)
    const png = item.type === 'image/png' && header[0] === 137 && header[1] === 80 && header[2] === 78 && header[3] === 71
    const jpg = item.type === 'image/jpeg' && header[0] === 255 && header[1] === 216 && header[2] === 255
    const webp = item.type === 'image/webp' && String.fromCharCode(...header.slice(0, 4)) === 'RIFF' && String.fromCharCode(...header.slice(8, 12)) === 'WEBP'
    if (!png && !jpg && !webp) throw new Error('ZIP 图片内容与声明格式不符')
    ids.add(item.id)
    images.push({ id: item.id, blob: new Blob([new Uint8Array(bytes)], { type: item.type }) })
  }
  return { backup, images }
}
