import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('个人收藏：输入、添加、笔记、刷新、导出、删除与恢复', async ({ page }) => {
  await page.goto('/style-atlas/')
  const collection = page.locator('#collection')
  await expect(collection.getByRole('heading', { name: '喜欢的设计，集中收藏。' })).toBeVisible()

  await collection.getByRole('button', { name: '＋ 收藏设计' }).click()
  const form = collection.locator('form.collection-editor')
  await form.getByLabel('名称').fill('Liquid Dock Test')
  await form.getByLabel('来源链接').focus()
  await form.getByLabel('来源链接').pressSequentially('https://example.com/liquid-dock')
  await expect(form.getByLabel('来源链接')).toHaveValue('https://example.com/liquid-dock')
  await form.getByLabel('标签（逗号分隔）').fill('Glass, Navigation')
  await form.getByLabel('简述').fill('玻璃导航的动效参考')
  await form.getByRole('button', { name: '加入收藏馆' }).click()

  let card = collection.locator('.collection-card').filter({ hasText: 'Liquid Dock Test' })
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: '查看详情 ↗' }).click()
  const modal = page.getByRole('dialog', { name: 'Liquid Dock Test' })
  await expect(modal).toBeVisible()
  await modal.getByRole('textbox', { name: '我的设计笔记' }).fill('喜欢干净的蓝色高光')
  await modal.getByRole('button', { name: '保存笔记' }).click()
  await expect(modal.getByRole('button', { name: /已保存/ })).toBeVisible()
  await modal.getByRole('button', { name: '关闭设计详情' }).click()

  await page.reload()
  card = page.locator('#collection .collection-card').filter({ hasText: 'Liquid Dock Test' })
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: '查看详情 ↗' }).click()
  await expect(page.getByRole('dialog').getByRole('textbox', { name: '我的设计笔记' })).toHaveValue('喜欢干净的蓝色高光')
  await page.getByRole('button', { name: '关闭设计详情' }).click()

  const downloadEvent = page.waitForEvent('download')
  await page.locator('#collection').getByRole('button', { name: '导出 JSON' }).click()
  const download = await downloadEvent
  const payload = JSON.parse(await readFile(await download.path(), 'utf8')) as {
    entries: Array<{ title: string }>, notes: Record<string, string>
  }
  const saved = payload.entries.find((entry) => entry.title === 'Liquid Dock Test')
  expect(saved).toBeTruthy()
  expect(Object.values(payload.notes)).toContain('喜欢干净的蓝色高光')

  page.once('dialog', async (dialog) => { await dialog.accept() })
  await card.getByRole('button', { name: '删除' }).click()
  await expect(card).toHaveCount(0)

  await page.locator('#collection input[aria-label="选择收藏备份 JSON 或 ZIP 文件"]').setInputFiles({
    name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)),
  })
  card = page.locator('#collection .collection-card').filter({ hasText: 'Liquid Dock Test' })
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: '查看详情 ↗' }).click()
  await expect(page.getByRole('dialog').getByRole('textbox', { name: '我的设计笔记' })).toHaveValue('喜欢干净的蓝色高光')
})

test('元素实验室：切换示例、代码和深色背景', async ({ page }) => {
  await page.goto('/style-atlas/')
  const lab = page.locator('#component-lab')
  await expect(lab.getByRole('heading', { name: '从喜欢的设计，到可运行的元素。' })).toBeVisible()
  await lab.getByRole('button', { name: '输入与选择', exact: true }).click()
  await expect(lab.getByRole('heading', { name: '弹性胶囊开关' })).toBeVisible()

  const iframe = lab.locator('iframe')
  await expect(iframe).toHaveAttribute('sandbox', '')
  await expect(iframe.contentFrame().getByRole('checkbox')).toBeChecked()
  await iframe.contentFrame().getByText('Enable effects').click()
  await expect(iframe.contentFrame().getByRole('checkbox')).not.toBeChecked()

  await lab.getByRole('button', { name: 'HTML' }).click()
  await expect(lab.locator('pre code')).toContainText('type="checkbox"')
  await lab.getByRole('button', { name: 'CSS' }).click()
  await expect(lab.locator('pre code')).toContainText('.switch-label')
  await lab.getByRole('button', { name: '☾ 深色背景' }).click()
  await expect(lab.getByRole('button', { name: '☀ 浅色背景' })).toBeVisible()
})

test('窄屏下导航与收藏馆可达', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/style-atlas/')
  const topbar = page.locator('.topbar')
  const bounds = await topbar.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(377)
  await page.getByRole('link', { name: 'UI 收藏馆' }).click()
  await expect(page.locator('#collection')).toBeInViewport()
  await page.getByRole('link', { name: '元素实验室' }).click()
  await expect(page.locator('#component-lab')).toBeInViewport()
})


test('本地截图：上传、持久化、完整 ZIP 导出、删除和恢复', async ({ page }) => {
  await page.goto('/style-atlas/')
  const collection = page.locator('#collection')
  const item = collection.locator('.collection-card').filter({ hasText: 'Style Atlas' }).first()
  await item.getByRole('button', { name: '查看详情 ↗' }).click()
  const detail = page.getByRole('dialog', { name: 'Style Atlas' })
  await detail.getByRole('button', { name: '上传本地截图' }).click()

  const pngData = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 80
    const context = canvas.getContext('2d')!
    context.fillStyle = '#5b6ced'
    context.fillRect(0, 0, 120, 80)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await collection.locator('input[aria-label="选择设计截图"]').setInputFiles({
    name: 'mock-screenshot.png', mimeType: 'image/png', buffer: Buffer.from(pngData, 'base64'),
  })
  await expect(detail.getByRole('button', { name: '替换本地截图' })).toBeVisible()
  await detail.getByRole('button', { name: '关闭设计详情' }).click()
  await expect(item.locator('.collection-art img')).toHaveAttribute('src', /^blob:/)

  await page.reload()
  await expect(collection.locator('.collection-card').filter({ hasText: 'Style Atlas' }).first().locator('.collection-art img')).toHaveAttribute('src', /^blob:/)

  const zipEvent = page.waitForEvent('download')
  await collection.getByRole('button', { name: '导出完整 ZIP' }).click()
  const zipDownload = await zipEvent
  const zipBytes = await readFile(await zipDownload.path())
  expect(zipBytes.subarray(0, 2).toString('utf8')).toBe('PK')

  await collection.locator('.collection-card').filter({ hasText: 'Style Atlas' }).first().getByRole('button', { name: '查看详情 ↗' }).click()
  await page.getByRole('dialog').getByRole('button', { name: '移除截图' }).click()
  await expect(page.getByRole('dialog').getByRole('button', { name: '上传本地截图' })).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: '关闭设计详情' }).click()

  await collection.locator('input[aria-label="选择收藏备份 JSON 或 ZIP 文件"]').setInputFiles({
    name: 'collection.zip', mimeType: 'application/zip', buffer: zipBytes,
  })
  await expect(collection.locator('.collection-card').filter({ hasText: 'Style Atlas' }).first().locator('.collection-art img')).toHaveAttribute('src', /^blob:/)
})
