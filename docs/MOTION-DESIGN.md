# Style Atlas · 动效设计规范

> 2026-10-11 · v1.0 · 适用范围：网页风格图鉴、组件交互样例和客户端 UI 教学演示。这里的数字是**项目设计约定**，不是某个设计系统的官方标准。

## 1. 原则

动效先服务于**信息连续性、操作确认和层级关系**，再服务于品牌表现。所有任务必须能在没有动画的情况下完成。优先过渡 `transform` 和 `opacity`，避免频繁修改几何布局属性；需要颜色、边框、阴影时保证可见但保持短促。不要为每个元素安排入口动画。

## 2. 四级时间尺度

| 等级 | 适用场景 | 建议时长 | 缓动与表达 |
|---|---|---:|---|
| Fast / 及时反馈 | 点击、收藏、按钮按压 | 120–160ms | 快速 ease-out、少量 scale，状态有文字 |
| Standard / 选择 | 标签、筛选、选中态 | 180–240ms | 标准 ease / 高亮切换，不整页平移 |
| Emphasized / 容器 | 抽屉、弹层、面板 | 240–320ms | 进入放缓、退出较快，方向合乎结构 |
| Status / 状态信息 | 通知、保存反馈 | 160–220ms | 淡入淡出，必要时短小位移 |

实现 Token：

```css
:root {
  --atlas-motion-fast: 140ms;
  --atlas-motion-standard: 220ms;
  --atlas-motion-page: 320ms;
  --atlas-motion-enter: cubic-bezier(.22,1,.36,1);
  --atlas-motion-exit: cubic-bezier(.4,0,1,1);
  --atlas-motion-standard-ease: cubic-bezier(.2,.75,.25,1);
}
```

需要注意：页面级主题变化以颜色、边框与明暗层级过渡为主，渐变背景无法稳定插值，**不要为了强行连续而在全页面叠加昂贵滤镜**。

## 3. 按风格区分运动气质

- **安静 / 精准**：Editorial、Swiss、Luxury、Zen、Academia、Notion Workspace、Ink Wash、OLED；采用短淡入和选择高亮，阅读区避免移动。
- **柔和 / 触感**：Glass、Clay、Neumorphism、Liquid、Fluent、Material、Paper Cut；使用局部浮起、材质和阴影变化，不堆叠长时间连续动画。
- **鲜明 / 克制**：Brutalism、Cyber、Y2K、Vaporwave、Pixel、Memphis、Bauhaus、Halftone；在明确触发后做短促跳切、形态变化，不能出现大幅度频闪。
- **高效 / 确定**：Bento、Terminal、Command Center、Isometric；优先即刻响应，避免高频操作中的漫长缓动。
- **平衡 / 自然**：剩余主题使用标准反馈方案，不以炫技作为设计目标。

不同风格的运动指导与风险在 `src/data/motionProfiles.ts`，详情页会调用统一规范。

## 4. 可访问性约束

- 尊重 `prefers-reduced-motion: reduce`，默认遵从操作系统设置，并允许站内“减少动画”开关覆盖。
- 减少动画时，移除无意义的平移、缩放、悬浮与持续旋转；保留色彩、文本和静态选中态。
- 不做连续闪屏、快速高对比色交替，尤其是赛博、Y2K、印刷半调主题。
- 使用 `:focus-visible` 明确键盘焦点；`aria-pressed`、`aria-selected`、`role=status`、`aria-expanded` 传达状态；降低动画不应取消必要反馈。
- 样例动效要可取消、可以重复点击，不能用动画延迟真实操作。

## 5. 对话框与交互路径

| 行为 | 预期 |
|---|---|
| 悬停主题卡 | 仅当前卡片微浮、高亮，**不能切全站主题** |
| 点击主题卡 | 立刻应用主题，更新选中状态与持久化记录 |
| 收藏或打开详情 | 仅修改当前操作范围 |
| 弹窗 | 快速淡入与很小的位移；关闭支持 Esc |
| 导航标签 | 局部高亮，选项内容的淡入不妨碍再次选择 |
| 抽屉 | 从触发按钮附近或其内容逻辑位置出现；关闭运动反向 |
| 保存 | 显示文字、图标与颜色共同传达结果 |

## 6. 验收清单

- [ ] 主题列表中的 30 个缩略样例与详细弹窗均可渲染
- [ ] 悬停、键盘 Tab 聚焦不会更换全站主题
- [ ] 只有明确点击主题卡片或随机探索按钮才更换全站主题
- [ ] 主题的收藏、复制颜色与 CSS Token 导出不影响选中主题
- [ ] 明暗主题、恢复默认与历史主题记忆继续工作
- [ ] “减少动画”启用时全部关键操作保留反馈
- [ ] 320px 宽度到桌面布局没有不可达按钮或不必要的水平溢出
- [ ] Chrome / Chromium 桌面检查四种动效演示，重复点击不需要等待
- [ ] 在中低性能设备上检查滤镜、玻璃材料和阴影的滚动性能
- [ ] `npm run build` 通过 TypeScript 与 Vite 编译

## 7. 来源与区分

这些数字、风格分组及选择属于项目的设计决策，并非官方标准；参考了下列指导的原则：

- Material Design — Duration & easing: https://m1.material.io/motion/duration-easing.html
- Apple Human Interface Guidelines — Motion: https://developer.apple.com/design/human-interface-guidelines/motion/
- Apple — Reduced Motion evaluation criteria: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
- MDN — prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion

动态取舍应优先依赖实际可用性测试和产品场景，而不是机械照搬时长数值。
