# 工作室网站（P1-6）· 本地静态版

- 状态：内部预览版，**未建仓库、未推送、未发布**。文案与图片均待创始人定稿；所有黄底【待定】/[TBD] 是未定项，上线前须逐项替换或删除。
- 制作：上帝右手变现，2026-11-11（UTC+8）。依据：P1-3 文案（唯一文案来源）、P1-2 结构、P1-4 视觉方向、创始人 t92u / t182u（首页只用一张右手主视觉）。
- 技术：纯静态 HTML/CSS + 两个小的原生 JS：`nav.js`（手机菜单开合）和 `plx.js`（首页视差，仅首页加载）。无追踪/分析脚本，无外部字体或 CDN，无付费服务。字体自托管在 `assets/fonts/`（woff2，SIL OFL 1.1），保留系统字体回退。所有链接与资源都是相对路径，计划仓库为 `yuanzikongjian-create/yuanzi-studio`，上线后网址为 `https://yuanzikongjian-create.github.io/yuanzi-studio/`（**尚未建库、未推送、未发布**；发布须 Horace 另行批准，并由账号与对外联络助理执行）。

## 文件清单

```
site/
├── index.html                 中文首页（主视觉：右手终图，桌面 16:9 横版 / 手机 9:16 竖版）
├── studio/index.html          中文 · 工作室
├── originals/index.html       中文 · 原创 IP
├── collaborate/index.html     中文 · 合作（含 FAQ）
├── work/index.html            中文 · 作品集（【待定】空态）
├── contact/index.html         中文 · 联系
├── en/                        英文版，结构同上（en/index.html、en/studio/…）
├── assets/style.css           全站样式（含 @font-face）
├── assets/fonts/              自托管字体（woff2）与 OFL 许可文件，见下「字体」
├── assets/nav.js              手机菜单开合（无 JS 时菜单直接展开）
├── assets/plx.js              首页视差（原生 JS，passive 滚动 + 鼠标跟随 + requestAnimationFrame），只在中英文首页引用
├── assets/img/hero-right-hand.webp          右手终图 1920×1080，WebP（桌面，约 42 KB）
├── assets/img/hero-right-hand.jpg           同一终图 JPEG 兜底（不支持 WebP 的浏览器，约 91 KB）
├── assets/img/hero-right-hand-portrait.webp 竖版终图 941×1672，WebP（窄屏 ≤768px 或竖屏，约 43 KB）
├── assets/img/hero-right-hand-portrait.jpg  竖版终图 JPEG 兜底（约 88 KB）
├── assets/img/plx-desktop-bg.webp           视差背景层（桌面）1920×1080，16 KB
├── assets/img/plx-desktop-hand.webp         视差手层（桌面）1920×1080，透明，59 KB
├── assets/img/plx-mobile-bg.webp            视差背景层（窄屏/竖屏）941×1672，14 KB
├── assets/img/plx-mobile-hand.webp          视差手层（窄屏/竖屏）941×1672，透明，68 KB
├── assets/img/hero-right-hand-placeholder.svg      旧占位图（标「右手」），已不被页面引用，保留备用
├── assets/img/hero-right-hand-placeholder-en.svg   旧占位图（标 "Right Hand"），已不被页面引用，保留备用
└── README.md                  本文件
```

外部链接只有一个：首页主按钮「免费读第一部 / Read Book One Free」（以及原创 IP 页「读第一部 / Read Book One」）指向作者博客 https://yuanzikongjian.blogspot.com/ （新标签页打开，不加载任何外部资源）。

## 首页视差（2026-11-11）

**图层来源**：`/home/box/shared/studio/website/P1-6_images/parallax/{desktop,mobile}/01_bg.png`、`03_hand.png`（视觉岗拆层，原 PNG 未改）。转换：背景层去掉 alpha 存 WebP q80；手层保留 alpha 存 WebP q82、alpha_quality 90。四个文件合计 158 KB。

**结构**：首页 `.hero-media` 里先是原来的合成图 `<picture>`（`.hero-img`），上面叠一个 `.plx`：背景层 `<div class="plx-layer plx-bg"><picture class="plx-bg-m">…</picture></div>`、手层 `<div class="plx-layer plx-hand"><picture class="plx-hand-m">…</picture></div>`。外层 div 只负责滚动位移，内层 picture 只负责鼠标位移，两者叠加、互不覆盖（v3 起由 `plx.js` 直接写 `style.transform`，不再用 CSS 变量）。两层都用同一断点 `(max-width: 768px), (orientation: portrait)` 切换桌面/手机图，`object-fit: cover; object-position: center`，与合成图逐像素对齐。

**启用条件（渐进增强）**
- 无 JS：`.plx` 是 `display:none`，页面和改动前完全一致（已逐像素比对）。注意图层现在是 `loading="eager"`，无 JS 时浏览器仍会下载两张图层（桌面约 78 KB，手机约 84 KB），只是不显示。
- `prefers-reduced-motion: reduce`：`plx.js` 直接退出，CSS 也强制隐藏 `.plx`、取消文字淡入；显示静态合成图，文字直接可见。
- 正常情况：`plx.js` 给 `<html>` 加 `.js-plx`（文字淡入）；两层图都加载成功（`img.complete && naturalWidth > 0`，或触发 `load`）后再加 `.plx-live`，图层才可见并开始移动。任一层加载失败就保持静态合成图。

**file:// 兼容（11-11 23:00 返工）**：图层改为 `loading="eager"`（避免懒加载图片放在 `visibility:hidden` 容器里迟迟不加载）；脚本只用 `img.complete`/`naturalWidth`/`load` 事件判断加载，不用 `fetch`、`decode()`、ES 模块、`currentSrc` 等依赖 http 或时机的东西；所有路径都是相对路径。

**滚动检测（v3，11-11 23:50 返工）**：Horace 在 Windows Chrome 上用鼠标滚轮滚动时，v2 的手和背景不动。v3 改为：
- 滚动进度不读 `window.scrollY`，而是用「首屏在文档中的位置（`offsetTop` 链）− 首屏当前 `getBoundingClientRect().top`」÷ 首屏高度。不管实际滚动的是 window、body 还是别的容器，结果都对。
- 首屏在视口内时持续跑一个轻量的 `requestAnimationFrame` 循环：每帧读一次 rect，数值变了才写 transform。所以平滑滚动、合成器线程滚动、滚轮、触控板、键盘、拖动滚动条都能跟上，不依赖 scroll 事件。首屏离开视口后循环停下，由 `scroll`（window 和 document capture 两处）、`wheel`、`touchmove`、`keydown`、`resize`、`pointermove` 中任一事件重新唤醒，全部是 passive 监听。
- 鼠标只记录指针的屏幕坐标和它是否落在首屏元素上（落在吸顶导航上不算）。每帧按首屏当前位置换算，所以滚轮带来的 pointermove 不会把滚动项清零。

**滚动幅度**（随首屏滚动进度 p 线性变化，p = 滚动距离 ÷ 首屏高度，0→1；单位是屏幕 px，`plx.js` 顶部的 `SCROLL`）

| 断点 | 背景层 | 手层 | 方向约束 |
|---|---|---|---|
| 桌面 | 0 → +70px（向下，比页面滚动慢） | 0 → −50px（向上，比页面滚动快） | 手层 Y 只允许 ≤ 0（向上），代码里强制 clamp |
| 窄屏/竖屏 | 0 → +36px | 0 → +24px（向下） | 手层 Y 只允许 ≥ 0（向下），代码里强制 clamp |

**鼠标跟随**（只在桌面且 `(hover: hover) and (pointer: fine)` 时启用，`plx.js` 顶部 `MOUSE`；指针在首屏内的位置换算成 −1…1，每帧按 `EASE = 0.08` 缓动逼近）
- 背景层：X 方向 −8…+8px（与指针反向）；Y 方向只在指针位于上半屏时向上移，最多 −6px（不向下，避免露出上沿）。
- 手层：X 方向只在指针位于右半屏时向右移，最多 +12px（不朝左侧文字移）；Y 方向只在指针位于上半屏时向上移，最多 −12px。叠加滚动后手层 Y 仍强制 ≤ 0。
- 指针离开首屏时缓动回 0；触屏、手机和 reduced-motion 下不启用。

**文字淡入**：tagline → 书名 → 按钮依次淡入并上移（桌面 18px、手机 10px），每段 2.8s，缓动 `cubic-bezier(.22,.61,.36,1)`；延迟分别为 0.2s、0.9s、1.6s（按钮比书名晚 0.7s）。之后静止，不随滚动或鼠标移动。reduced-motion 和无 JS 时没有淡入，文字直接可见。

**前臂断口的规避：方案 (a) 只往远离断口的方向移，不放大。**
- 桌面前臂从画面顶边伸出：手层 Y 只向上，断口始终在画框外（`.plx` `overflow:hidden`）。手层左右两侧都不贴画框边（手层不透明区域约在横向 35%–85%），X 方向移动不会露边。
- 手机前臂从画面底边伸出：手层只向下移（最多 +24px），手腕和前臂断口仍在画框底边之外；手离按钮只会更远。手机上「手比背景快」靠背景层下移得更多来实现（背景 +36px、手 +24px）。
- 手层不淡出、不缩放（背景层上能看出手的轮廓，见视觉岗自检 C5）。
- 背景层下移时上沿露出的是下面的合成图：桌面上这条边在吸顶导航后面（只在滚动 <25px 时露出不到 2px，那时手层位移也不到 2px，与合成图重合）；手机上那里是画面顶部暗区。背景层左右平移、向上移时露出的左右/下边，合成图在那里与背景层是同一画面（没有手）。不会出现黑缝。

**调整方法**：只改 `assets/plx.js` 顶部的 `SCROLL`、`MOUSE`、`EASE`。不要再把滚动和鼠标合进同一个元素的同一个 transform 里，也不要改回读 `window.scrollY`。若再加大幅度，注意：① 手相对背景的位移越大，露出的补底区域越多；② 桌面手层向上或向右会改变手与 tagline 的距离，需复测 ≥ 24px；③ 不要把桌面手层 Y 改成正数、手机改成负数；④ 不要让背景层鼠标位移向下。

**换图**：按同名覆盖 `assets/img/plx-*.webp`（尺寸与合成图一致、逐像素对齐）；同时更新合成图 `hero-right-hand*.{webp,jpg}`，保证无 JS / reduced-motion 时画面一致。

## 字体（t93u）

全部为 SIL Open Font License 1.1（免费、可商用、可嵌入网页），文件自托管，`font-display: swap`，并保留系统字体回退。许可全文在 `assets/fonts/OFL-*.txt`。

| 文件 | 字体 / 字重 | 用途 | 体积 | 来源 |
|---|---|---|---|---|
| `NotoSerifSC-Regular-subset.woff2` | Noto Serif SC（思源宋体）Regular 400 | 中文正文、标题、tagline；英文页里的中文字符 | 224 KB | box 上的 Noto Serif CJK 2.003（`/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc`，取 SC 字面），与 Google Fonts 的 Noto Serif SC 同一设计；上游 github.com/notofonts/noto-cjk |
| `NotoSerifSC-Bold-subset.woff2` | Noto Serif SC Bold 700 | 中文 `<b>` 加粗词 | 53 KB | 同上（Bold.ttc） |
| `CormorantGaramond-Medium-latin.woff2` | Cormorant Garamond Medium 500 | 英文 tagline、标题 | 22 KB | google/fonts（ofl/cormorantgaramond），可变字体取 wght=500 |
| `CormorantGaramond-MediumItalic-latin.woff2` | Cormorant Garamond Medium Italic | 英文书名（斜体，按 P1-3 写法 *The Right-Handed God*） | 18 KB | 同上 |
| `EBGaramond-Regular-latin.woff2` | EB Garamond Regular 400 | 英文正文、导航、按钮 | 28 KB | google/fonts（ofl/ebgaramond），wght=400 |
| `EBGaramond-SemiBold-latin.woff2` | EB Garamond SemiBold 600 | 英文 `<b>` | 31 KB | 同上，wght=600 |
| `EBGaramond-Italic-latin.woff2` | EB Garamond Italic | 英文正文中的斜体书名 | 29 KB | 同上 |

合计 408 KB，其中中文 277 KB（目标 ≤ 600 KB）。中文页实际只下载用到的中文字体（首页 224 KB）；英文页因含「中文」切换链接和《慧军创世纪》等中文字符，也会加载中文 Regular。

**中文子集是按站内文字截出来的。** 改了任何中文文案（新增了没用过的字）后，必须重新截字，否则新字会回落到系统字体：

```bash
# 扫描 site/ 全部 HTML 用到的字（含 alt），截出 Regular；<b> 里的字截出 Bold
python3 /workspace/p1-6/fonts.py
```

脚本做的事：收集全部 HTML 文本 → `pyftsubset --text-file=... --flavor=woff2`（Regular 全部字，Bold 只取 `<b>` 内的字）；拉丁字体用 `fontTools.varLib.instancer` 定字重后按 Latin 区段截取。依赖 `fonttools` 与 `brotli`。

## 本地预览

```bash
cd /home/box/shared/studio/website/site
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/ （中文），http://localhost:8000/en/ （英文）
```

模拟 GitHub Pages 子路径（推荐验收时用）：

```bash
mkdir -p /tmp/pages && ln -sfn /home/box/shared/studio/website/site /tmp/pages/repo
cd /tmp/pages && python3 -m http.server 8000
# 打开 http://localhost:8000/repo/
```

也可以直接双击 `index.html` 用 file:// 打开，所有链接都指向具体的 `index.html`，可以正常跳转。

## 首页主视觉：右手终图（已接入）

- 来源（均已验收）：
  - 横版 `/home/box/shared/studio/website/P1-6_images/final/hero_right_hand_16x9_1920x1080.png`（1920×1080）→ `hero-right-hand.webp` / `.jpg`
  - 竖版 `/home/box/shared/studio/website/P1-6_images/final/hero_right_hand_mobile_9x16_t187u.png`（941×1672，t186u/t187u）→ `hero-right-hand-portrait.webp` / `.jpg`
  - 早先的预览原图 t183u 与「横图中间裁切」的 `hero-right-hand-mobile.webp` 都已从站点删除。
- `<picture>` 切换规则（中英首页相同）：媒体条件 `(max-width: 768px), (orientation: portrait)` 成立时用竖版（WebP，JPEG 兜底）；否则用横版 WebP，`<img>` 的 `src` 是横版 JPEG 兜底。两种都设 `object-fit: cover; object-position: center;`。
- 首屏排版（t93u）：
  - 桌面（横版图）：tagline 大字压在左上角（中文 3.9vw、字距 .14em，分四行；英文 Cormorant 4.25vw，分四行）；原 tagline 位置（左下）放书名（中文《上帝右手》，英文斜体 *The Right-Handed God*，字号约为 tagline 的 40–50%，书名上方一条 2.6rem 暗金细线），按钮紧接书名下方。图左侧加一层由暗到透明的渐变（到 46% 宽处完全透明），只为衬字，不遮手。
  - 手机（≤768px 或竖屏，竖版图）：tagline、细线、书名、按钮依次排在图前的文字块里（底色 `#060e0f` 与竖图顶部同色），竖图用 `margin-top:-32vw` 上移，按钮落在竖图顶部暗区内、手指尖之上；中文 tagline 每句一行，英文分四行；两个按钮并排。
  - 相关 CSS：`assets/style.css` 中「首页首屏（海报式）」一节及文件末尾的 `@media (max-width:768px), (orientation:portrait)` 块。若以后 tagline 变长，桌面端要复测文字右缘与手的距离（≥24px），手机端要复测按钮与指尖距离；放不下时减小 `margin-top` 的负值（即把图往下移），或把按钮挪到图下方。
- AI 标注：图片 `alt` 以「AI 辅助制作的配图」/ "AI-assisted image" 开头；主视觉下方说明条写「图像由 AI 辅助制作」/ "AI-assisted image"（取自 P1-3「角色与场景图像由 AI 辅助制作」），并附【待定｜配图政策待创始人批准】。
- 以后若再换图，按同名覆盖即可：
  ```bash
  cd /home/box/shared/studio/website/site/assets/img
  python3 - <<'EOF'
  from PIL import Image
  h = Image.open("<新横版终图>.png").convert("RGB")   # 16:9
  h.save("hero-right-hand.webp", "WEBP", quality=80, method=6)
  h.save("hero-right-hand.jpg", "JPEG", quality=82, optimize=True, progressive=True)
  v = Image.open("<新竖版终图>.png").convert("RGB")   # 9:16，上部留暗区放标题和按钮
  v.save("hero-right-hand-portrait.webp", "WEBP", quality=80, method=6)
  v.save("hero-right-hand-portrait.jpg", "JPEG", quality=82, optimize=True, progressive=True)
  EOF
  ```
  若横版尺寸不是 1920×1080，改两页首页 `<img>` 的 `width`/`height` 与 `alt`。若新竖图的暗区比现在小（手指尖高于图高约 1/3），把 CSS 里的 `margin-top:-32vw` 改小（例如 `-10vw` 或 `0`，等于把图往下移），或把按钮挪到图下方。

## 上线前清单（未执行）

- 替换或删除所有黄底【待定】/[TBD]（清单见 `../P1-6_自检.md`）。
- 删除每页顶部的「内部预览版 · 未发布」草案条（`<div class="draftbar">`），以及 `<meta name="robots" content="noindex">`（若决定允许搜索引擎收录）。
- 公开配图前，按创始人批准的配图政策加 AI 标注。

## GitHub Pages 发布步骤（给账号与对外联络助理参考；**只写不执行**）

**当前状态：未建仓库、未推送、未发布。** 发布须 Horace 另行批准后，由账号与对外联络助理执行；本岗与本文件不得自行建库或推送。

已定（2026-11-20，Horace 经主管转达）：
- GitHub 账号：`yuanzikongjian-create`
- 仓库名：`yuanzi-studio`
- 计划网址：`https://yuanzikongjian-create.github.io/yuanzi-studio/`

1. 以 `yuanzikongjian-create` 登录 GitHub，New repository → 名称 `yuanzi-studio`，Public（免费账号的 Pages 需要公开仓库），不勾选添加 README。
2. 上传 `site/` 目录里的**内容**（不是 `site` 文件夹本身），让 `index.html` 位于仓库根目录。可用网页 “Add file → Upload files” 拖入，或命令行：
   ```bash
   cd /home/box/shared/studio/website/site
   git init && git add . && git commit -m "Studio site v1"
   git branch -M main
   git remote add origin https://github.com/yuanzikongjian-create/yuanzi-studio.git
   git push -u origin main
   ```
3. 仓库 Settings → Pages → Build and deployment → Source 选 “Deploy from a branch”，Branch 选 `main`，文件夹 `/ (root)`，Save。
4. （建议）在仓库根目录加一个空文件 `.nojekyll`，跳过 Jekyll 处理。
5. 等 1–3 分钟，Pages 页面会显示网址 `https://yuanzikongjian-create.github.io/yuanzi-studio/`。逐页打开检查中英文切换、按钮、手机显示。
6. 若以后改用 `yuanzikongjian-create.github.io` 根域名（仓库名须为 `yuanzikongjian-create.github.io`），因全站是相对路径，不需改代码。
7. 不买域名、不开付费功能、不接分析脚本。
