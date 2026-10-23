/**
 * A local, privacy-preserving screenshot store. Image bytes are not placed in
 * localStorage and never leave the browser unless the user exports a ZIP.
 */
export const MAX_IMAGE_INPUT_BYTES = 12 * 1024 * 1024
export const MAX_IMAGE_STORED_BYTES = 4 * 1024 * 1024
const DB_NAME = 'weepwood-ui-collection-images'
const STORE = 'screenshots'

export interface StoredScreenshot { id: string; blob: Blob; updatedAt: number }

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('此浏览器不支持 IndexedDB，无法保存本地截图'))
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('打开截图数据库失败'))
    request.onblocked = () => reject(new Error('截图数据库被其它标签页占用，请关闭其它页面后重试'))
  })
}

async function storeRequest<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  return new Promise<T>((resolve, reject) => {
    let result: T
    const transaction = db.transaction(STORE, mode)
    const request = operation(transaction.objectStore(STORE))
    request.onsuccess = () => { result = request.result }
    request.onerror = () => reject(request.error || new Error('截图读写失败'))
    transaction.oncomplete = () => { db.close(); resolve(result) }
    transaction.onerror = () => { db.close(); reject(transaction.error || new Error('截图事务失败')) }
    transaction.onabort = () => { db.close(); reject(transaction.error || new Error('截图事务被中断')) }
  })
}

export async function listScreenshots(): Promise<StoredScreenshot[]> {
  return storeRequest('readonly', (store) => store.getAll()) as Promise<StoredScreenshot[]>
}

export async function removeScreenshot(id: string): Promise<void> {
  await storeRequest('readwrite', (store) => store.delete(id))
}

export async function writeScreenshot(id: string, blob: Blob): Promise<void> {
  if (!id || id.length > 100 || blob.size > MAX_IMAGE_STORED_BYTES || blob.size === 0 || !['image/webp','image/jpeg','image/png'].includes(blob.type)) {
    throw new Error('截图格式或大小无效')
  }
  await storeRequest('readwrite', (store) => store.put({ id, blob, updatedAt: Date.now() }))
}

export async function optimizeScreenshot(file: Blob): Promise<Blob> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('仅允许 PNG、JPEG 和 WebP；不接收 SVG 或动画格式')
  }
  if (file.size > MAX_IMAGE_INPUT_BYTES || file.size === 0) {
    throw new Error('原始截图不能超过 12 MB')
  }
  if (typeof createImageBitmap !== 'function') throw new Error('当前浏览器不支持截图解码')
  let bitmap: ImageBitmap
  try { bitmap = await createImageBitmap(file) }
  catch { throw new Error('无法读取该图片，请选择有效的 PNG、JPEG 或 WebP') }
  try {
    if (bitmap.width > 12000 || bitmap.height > 12000 || bitmap.width * bitmap.height > 48_000_000) {
      throw new Error('截图分辨率过高')
    }
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法创建图片画布')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const output = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('图片压缩失败')), 'image/webp', .82)
    })
    if (output.size > MAX_IMAGE_STORED_BYTES) throw new Error('压缩后图片仍超过 4 MB')
    if (!['image/webp','image/png','image/jpeg'].includes(output.type)) throw new Error('浏览器生成了不支持的图片格式')
    return output
  } finally { bitmap.close() }
}
