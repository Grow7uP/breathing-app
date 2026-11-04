# 478 呼吸小程序 · GitHub 维护指南

> 面向零基础。**全程点鼠标，不需要敲任何命令。**
> 装一次工具，之后每天只做「改代码 → 提交 → 推送」三步。

---

## 0. 先搞懂三个词（30 秒）

| 名词 | 是什么 | 打比方 |
|---|---|---|
| **Git** | 你电脑本地的「存档系统」，藏在项目文件夹的 `.git` 里 | 游戏存档 |
| **GitHub** | 网上的代码托管平台 | 云端备份 + 展示柜 |
| **仓库 Repository** | 一个被 Git 管理的项目文件夹 | 一个存档槽 |

工作流只有一句话：

```
改代码  →  Commit（存档，存在本地）  →  Push（上传，同步到 GitHub）
```

> ⚠️ 只 Commit 不 Push，GitHub 上是看不到的。这是新手最常见的误会。

---

## 1. 装工具（只做一次，约 5 分钟）

### 1.1 下载 GitHub Desktop

打开 <https://desktop.github.com/> → 点 **Download for macOS**。

### 1.2 安装

把下载到的 `GitHub Desktop` 图标拖进「应用程序」文件夹，然后打开它。
首次打开如果提示"来自互联网下载的应用"，点「打开」。

> 💡 **为什么用它**：它自带 Git 引擎，你就不需要再单独装 Git 或 Xcode 开发者工具了。界面全中文/英文按钮，不用背命令。

### 1.3 登录

打开后点 **Sign in to GitHub.com** → 浏览器会自动弹出授权页面 → 点绿色按钮 **Authorize desktop** → 回到 App 就是已登录状态。

还没有 GitHub 账号的话，在登录页点 **Create your free account**，用邮箱注册即可（免费）。

### 1.4 （重要）确认署名

点左上角 **GitHub Desktop → Settings（设置）→ Git**，确认这两栏有内容：

- **Name**：你的名字或昵称
- **Email**：建议用 GitHub 给你的 `xxxxx@users.noreply.github.com` 邮箱

> 这两项决定了以后每个提交上显示的"作者"是谁。App 登录后一般会自动填好，检查一眼就行。

---

## 2. 把项目挂到 GitHub（只做一次，约 3 分钟）

项目文件夹：`breathing-app`（就是你在微信开发者工具里打开的那个目录）
（旧的、作者为 unknown 的初始化提交已清除，现在是一个干净的空仓库状态。）

### 2.1 添加本地项目

GitHub Desktop 菜单栏 → **File → Add Local Repository…**

在弹出的选择框里，选中 `breathing-app` 文件夹 → **Add Repository**。

### 2.2 确认分支是 main

左上角 **Current Branch** 应显示 `main`。若显示其他名字，点它 → 选 `main`。

### 2.3 第一次提交

左侧会列出 13 个待提交文件（`.gitignore`、`README.md`、`GitHub维护指南.md`、`app.js`、`pages/`、`utils/` 等）。

> ✅ **请确认列表里没有 `project.private.config.json`** —— 它是微信开发者工具生成的"本机专属"配置，已经被 `.gitignore` 排除，不该上云。

在左下角 **Summary** 框里填：

```
初始化：478 呼吸训练小程序
```

点蓝色按钮 **Commit to main**。

### 2.4 发布到 GitHub（私有）

顶栏出现 **Publish repository** 按钮 → 点击。

| 选项 | 设置 |
|---|---|
| Name | `breathing-app` |
| Description | 478 呼吸训练小程序：4-7-8 / 盒式呼吸 / 生理性叹息 |
| **Keep this code private** | ✅ **勾上**（私有，别人看不到） |

→ 点 **Publish repository**。

完成！浏览器打开 `https://github.com/你的用户名/breathing-app` 就能看到代码了。

> 以后想开源：在该页面 **Settings → 最下方 Danger Zone → Change visibility → Make public**。

---

## 3. 日常维护：每天的三步（就这三步）

### 第 1 步：改代码

在**微信开发者工具**里正常改代码、调试、预览。改完保存。

### 第 2 步：提交（Commit）

打开 GitHub Desktop。左侧 **Changes** 标签会自动列出你改动过的文件：

- 绿色 `+` = 新增行，红色 `-` = 删除行
- 只想提交部分文件？**取消勾选**不想提交的即可
- 左下角 **Summary** 写一句人话，例如：`fix: 修复屏息阶段动画卡顿`
- 点 **Commit to main**

### 第 3 步：推送（Push）

右上角出现 **Push origin** → 点它。等进度条走完，GitHub 网页刷新一下就是最新的。

### 提交说明怎么写（越简单越好，但要能看懂）

| 前缀 | 用途 | 例子 |
|---|---|---|
| `feat:` | 新功能 | `feat: 新增自定义节奏 0.5 秒步进` |
| `fix:` | 修 bug | `fix: 修复切后台后计时器不停止` |
| `style:` | 只改样式 | `style: 呼吸圆阴影调淡` |
| `docs:` | 只改文档 | `docs: 补充 README 运行说明` |
| `refactor:` | 重构，不改行为 | `refactor: 抽出相位计算函数` |

**千万别写**：`update`、`修改`、`。`、`111`。三个月后你自己也看不懂。

---

## 4. 版本是怎么存的（新手最大的误区）

### 误区：每次更新，往仓库里放一个新文件夹

很多人的想象是：

```
breathing-app/
|-- v1.0/   <-- 旧代码
|-- v1.1/   <-- 旧代码
`-- v2.0/   <-- 新代码
```

**Git 完全不是这样工作的。** 仓库里**永远只有一个 `breathing-app` 文件夹，里面永远是当前最新那份代码**。你改东西就是直接在 `pages/index/index.js` 上改，不存在"再复制一份新的进去"。

### 真相：Git 自己就是一台时光机

打个比方：**代码是一个人的档案，每次 Commit 就是给他拍一张全身照。**

- 人（文件夹）只有一个，永远是现在的样子
- 照片（提交）有很多张，全部锁在 `.git` 这个黑盒子里
- 想看三个月前的样子？翻开照片就行，**完全不占文件夹位置**

所以「把新版本放进仓库」这句话，对应的实际动作是：

> 在原文件上改 -> 点 Commit -> 点 Push

**不需要复制文件夹，不需要建 v1/v2 目录，也不需要手动备份到桌面。**

### 反过来的坑：删掉文件 ≠ 删掉历史

如果你曾经把敏感内容（密码、密钥、本机绝对路径）提交上去过，**之后再删掉、再提交一次是没用的** —— 它仍然躺在旧快照里，任何人翻 History 都能看到。

这种情况只有两条路：

1. **改写历史**：用 `git commit` 重做那条提交（`--amend`），或删掉仓库重建，让旧快照彻底消失
2. 如果泄露的是密钥，**立刻去对应平台重置**，改写历史只能止损，不能挽回

> 铁律：**提交之前先想清楚，这段内容能不能被所有人看到。**
> 拿不准的时候，先把仓库建成 Private，确认干净了再公开。

### 两种"版本"要分清

| | 提交 Commit | 标签 Tag / Release |
|---|---|---|
| 是什么 | 一次代码快照 | 给某张快照贴的版本号 |
| 相当于 | 相册里的一张照片 | 照片背面写的"2026 年生日" |
| 多久一次 | 每改完一个小功能就存一次 | 每次正式发布才打一个 |
| 在哪做 | GitHub Desktop 左下角 Commit | History 里右键 -> Create tag |
| 例子 | `fix: 修复屏息计时不准` | `v1.1.0` |

> 一句话：**Commit 管"过程"，Tag 管"里程碑"**。日常只用 Commit，Tag 等你要发版时再打。

### 三个典型场景

**场景 A：修了个小 bug（90% 的情况）**

```
改代码 -> Changes 写 "fix: 修复..." -> Commit to main -> Push origin
```

**场景 B：攒够新功能，要给小程序发新版本**

```
1. 把这次发版的改动全部 commit 完 -> Push
2. History 里右键最新提交 -> Create tag -> 填 v1.1.0
3. 微信开发者工具「上传」-> 公众平台提交审核 -> 发布
4. （可选）GitHub 网页 Releases 里写清这版更新了什么
```

**场景 C：改崩了，想回到昨天能跑的版本**

```
History 里找到那次提交 -> 右键 -> Revert commit（安全，会生成一条反向提交）
```

### 千万别这么做

| 错误做法 | 为什么错 |
|---|---|
| 建 `v1.0/` `v1.1/` 文件夹 | 每次提交已经存了完整快照，重复存等于自己给自己添乱 |
| 手动复制「备份-1104」到桌面 | GitHub 本身就是异地备份，还自带时间线 |
| 改完不提交就关机 | 改动不会丢（还躺在 Changes 里），但**没有任何存档**，也没同步到 GitHub |
| 一个提交混进十个不相关的改动 | 以后出问题没法单独回退某一处 |

---

## 5. 微信小程序专属的 4 个坑

### 坑 1：`project.private.config.json` 总在变

微信开发者工具每次打开项目都会重写这个文件。它已在 `.gitignore` 里，所以你**不会**在 Changes 列表看到它 —— 这是正常的，别去找。

> 万一哪天它出现在列表里：说明 `.gitignore` 被改了，右键该文件 → **Ignore file**。

### 坑 2：AppSecret 绝对不能进仓库

`project.config.json` 里的 `appid`（`wxdae1202db4d5c0f3`）只是小程序 ID，公开也无所谓。
但 **AppSecret** 是密码级别的东西，一旦提交到 GitHub（哪怕是私有库）就视为已泄露，必须在微信公众平台**重置**。本项目代码里目前没有 AppSecret，保持这样。

### 坑 3：GitHub ≠ 小程序发布渠道

把代码推到 GitHub **不会**让小程序更新。发布流程是另一条线：

```
GitHub Desktop Push（备份代码）
        ↕ 互不相干
微信开发者工具「上传」→ 微信公众平台 → 提交审核 → 发布
```

### 坑 4：别提交体积大的东西

- `node_modules/`、`miniprogram_npm/`：已被忽略，别手动加回来
- 单个文件超过 **100MB** GitHub 会直接拒绝
- 录屏、设计稿原图（PSD/AI）建议放网盘，仓库里只放压缩后的小图

---

## 6. 出错了怎么救

| 场景 | 操作 |
|---|---|
| 改乱了，想全部丢弃 | Changes 里右键文件 → **Discard changes**（⚠️ 不可恢复） |
| Commit 了但还没 Push，想撤 | **History** 标签 → 右键那条提交 → **Undo commit** |
| 已经 Push 了想撤 | History 右键该提交 → **Revert commit**（生成一条反向提交，最安全） |
| 想知道某行代码谁改的 | 在 GitHub 网页上点该行 → **Blame** |
| 误删了文件想找回 | History 里点删除它的那次提交 → 右侧文件列表 → 右键 → **Restore in Finder** |
| 彻底乱了、只想回到某个版本 | 先复制一份整个文件夹备份，再动手 |

---

## 7. 常见报错

| 报错 | 原因 / 解决 |
|---|---|
| `Authentication failed` | 登录过期。File → Options → Accounts → Sign out 后重新 Sign in |
| 左侧 Changes 一片空白 | ① 文件没保存 ② 改的是被忽略的文件 ③ 已经 Commit 过没新改动 |
| `remote: Support for password authentication was removed` | 用了密码登录。改用 GitHub Desktop 的浏览器授权，别手打密码 |
| `file is 123.45 MB; this exceeds GitHub's file size limit` | 删掉大文件，别提交；或改用 Git LFS |
| 提交作者显示成灰色 unknown | Settings → Git 里的 Name/Email 没填，填好后**新**提交就正常了 |
| 提示 `you must configure your identity` | 同上，去 Settings → Git 填名字和邮箱 |

---

## 8. 等人熟了再玩的进阶功能

- **分支 Branch**：做实验性大改动前，左上角 Current Branch → New Branch，改坏了直接切回 main，不影响稳定版
- **Issue**：在 GitHub 网页给自己记 TODO 和 bug，像个私人待办清单
- **Release / Tag**：功能稳定时打个 `v1.0.0` 标签，方便回溯「当时发布的是哪版」
- **README 加截图**：把截图放 `docs/` 目录，README 里写 `![预览](docs/preview.png)`
- **LICENSE**：将来要开源时加一个（个人项目常用 MIT）

---

## 9. 一页速查

```
装工具：desktop.github.com → 拖进应用程序 → 登录 → 设置里填 Name/Email
首次：File → Add Local Repository → 选文件夹 → create a repository → Commit → Publish（勾 Private）
日常：改代码 → Changes 里写 Summary → Commit to main → Push origin
救命：改乱=Discard｜提交错=Undo｜已推送=Revert
版本：不建 v1/v2 文件夹｜Commit 存过程｜Tag 标里程碑（v1.1.0）
红线：AppSecret 不上传｜大文件不提交｜private.config 不进库
```

---

*本指南随项目一起维护。遇到没写到的情况，先记住一条：**任何操作前，先把整个文件夹复制一份备份**，就不会有真正的损失。*
