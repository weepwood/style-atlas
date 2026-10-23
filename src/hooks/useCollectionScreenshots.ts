import { useCallback, useEffect, useRef, useState } from 'react'
import { listScreenshots, optimizeScreenshot, removeScreenshot, writeScreenshot, writeScreenshotsBatch } from '../data/collectionImageStore'
import type { ArchivedImage } from '../data/collectionArchive'

export function useCollectionScreenshots() {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const ref = useRef<Record<string, string>>({})
  const mounted = useRef(false)

  const refresh = useCallback(async () => {
    const images = await listScreenshots()
    if (!mounted.current) return
    const urls: Record<string, string> = {}
    for (const image of images) urls[image.id] = URL.createObjectURL(image.blob)
    const old = ref.current
    ref.current = urls
    setPreviewUrls(urls)
    Object.values(old).forEach((url) => URL.revokeObjectURL(url))
    setError('')
  }, [])

  useEffect(() => {
    mounted.current = true
    void refresh().catch((issue: unknown) => setError(issue instanceof Error ? issue.message : '读取本地截图失败'))
    return () => {
      mounted.current = false
      Object.values(ref.current).forEach((url) => URL.revokeObjectURL(url))
      ref.current = {}
    }
  }, [refresh])

  const save = useCallback(async (id: string, file: Blob) => {
    const optimized = await optimizeScreenshot(file)
    await writeScreenshot(id, optimized)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await removeScreenshot(id)
    await refresh()
  }, [refresh])

  const restore = useCallback(async (images: ArchivedImage[]) => {
    // Decode every image before opening the write transaction, preventing
    // partial imports caused by corrupt image files.
    const decoded: ArchivedImage[] = []
    for (const image of images) {
      decoded.push({ id: image.id, blob: await optimizeScreenshot(image.blob) })
    }
    await writeScreenshotsBatch(decoded)
    await refresh()
  }, [refresh])

  return { previewUrls, error, save, remove, restore, list: listScreenshots }
}
