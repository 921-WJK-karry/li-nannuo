# 提示词记录

## 2026-10-23 | 模型：GLM-5.3-Flash

设置规则：从现在开始，所有CSS类名，id名、js变量都以LNN_开始，所有的提示词都在执行之前写入文件LNN_prompt.md，以附加的方式写入，不覆盖之前的内容，写入的内容包括时间、使用的模型、提示词内容。

## 2026-10-23 | 模型：GLM-5.3-Flash

设置规则：所有新建的html文件加入超链接入口到首页index.html

## 2026-10-23 | 模型：GLM-5.3-Flash

使用当前目录下skills文件夹中的frontend-designskill做两个html网页iconfont-1.html,inconfont-2.html，使得页面具有艺术品牌的样式。分别显示font awesome图标和lucide图标，前者使用字体图标的方式，后者使用svg的方式，相关的cdn文件下载到本目录下的cdn目录。

## 2026-10-23 | 模型：GLM-5.3-Flash

根据font目录中的iconfont图标完成移动端的固定的自适应宽度的下导航，导航项目包括4个，完成html网页的设计，网页名称iconfont-3.html和iconfont-4.html分别使用字体图标和svg，包括右上角的数字徽章和红点。

## 2026-10-30 | 模型：GLM-5.3-Flash

创建技能skill：提交到github，将本项目提交commit并push到`https://github.com/921-WJK-karry/li-nannuo`，使用已设置公钥ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIANyz/kydUiXTDfeyP8YHUZbtnJDVR6A08mqS0tyxpd9 3290985376@qq.com。

## 2026-10-30 | 模型：GLM-5.3-Flash

好的，执行吧（按 AGENTS.md 约定：将新建页面 iconfont-3.html、iconfont-4.html 链接进根目录 index.html，课程页加 .lesson 卡片并递增计数器，或加 .other-links 药丸链接）

## 2026-11-04 | 模型：GLM-5.3-Flash

修改规则文件AGENT.md，在新建html文件时加入注释，注释包括：李南诺，建立时间，使用大模型，功能名称。在js部分函数加上函数主要实现功能的注释。

## 2026-11-04 | 模型：GLM-5.3-Flash

好的，执行吧（为存量页面 iconfont-1~4.html 补加 HTML 头注释：李南诺、建立时间、使用大模型、功能名称；并为其中 JS 函数补加功能注释）

## 2026-11-04 | 模型：GLM-5.3-Flash

请给我新建一个html文件，显示tab选项卡，选择卡分别为：国内新闻，省内新闻，国际新闻，最热新闻，国内新闻设定为默认选项。JS文件单独放在js文件夹中，外部引用。要求js中的tab选项卡可以复用，实现代码中的包含监听事件，、先清除所有选项卡的选中状态，然后再设置当前元素的选中状态。

## 2026-10-30 | 模型：opencode/big-pickle

Create or update `AGENTS.md` for this repository.

The goal is a compact instruction file that helps future OpenCode sessions avoid mistakes and ramp up quickly. Every line should answer: "Would an agent likely miss this without help?" If not, leave it out.

User-provided focus or constraints (honor these):


## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local OpenCode config such as `opencode.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- repo-specific style or workflow conventions that differ from defaults
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

Good `AGENTS.md` content is usually hard-earned context that took reading multiple files to infer.

## Questions

Only ask the user questions if the repo cannot answer something important. Use the `question` tool for one short batch at most.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.

If `AGENTS.md` already exists at `D:\程序设计比赛题库\Web前端技术课程`, improve it in place rather than rewriting blindly. Preserve verified useful guidance, delete fluff or stale claims, and reconcile it with the current codebase.

## 2026-11-04 | 模型：GLM-5.3-Flash

把文件夹sina-tab上传到GitHub里面

## 2026-11-04 | 模型：GLM-5.3-Flash

好的，推送剩余改动

## 2026-11-04 | 模型：GLM-5.3-Flash

请给我新建一个html文件，要求效果与图片内容一模一样，显示tab选项卡，选择卡分别为：新闻，证券，理财，博客，把这个HTML放在一个新的sina-tab文件夹，新的文件夹有index.html首页进入口和图片中的新浪排行榜的HTML，要求新的HTML要与图片里面的一比一还原。

## 2026-11-04 | 模型：GLM-5.3-Flash

把文件夹sina-tab上传到github

## 2026-11-04 | 模型：GLM-5.3-Flash

帮我把刚刚发布的sina-rank.html链接地址给我

## 2026-11-04 | 模型：GLM-5.3-Flash

发布到GitHub（开启 GitHub Pages，使 sina-tab 等页面可通过浏览器直接访问）

## 2026-11-06 | 模型：GLM-5.3-Flash

根据图片要求帮我补充swiper-task.html里面的任务四要求有图片上面的效果，可以在文件夹demo里面的220-effect-fade.html到257-effect-creative.html里面找代码要素

## 2026-11-06 | 模型：GLM-5.3-Flash

帮我把图片中在index.html里面没有的HTML添加到index.html按照时间（比对结果：仅 swiper-task.html 缺失，按时间排在末尾，编号 16）

## 2026-11-06 | 模型：GLM-5.3-Flash

上传到githup

## 2026-11-06 | 模型：GLM-5.3-Flash

请打开官方示例 swiper/demo/257-effect-creative.html，配合 AI 读懂 creativeEffect 的 transform 写法，为演示四新增第 7 个按钮「creative 电影墙」。效果要求：上一张缩小左移并带角度、下一张放大右移进场（参数自定，但要"像电影选片墙"）

## 2026-11-06 | 模型：GLM-5.3-Flash

是把刚刚的效果放在`D:/程序设计比赛题库/Web前端技术课程/swiper-task.html`第四个任务下面，作为第五个任务

## 2026-11-06 | 模型：GLM-5.3-Flash

好的，推送到 GitHub

## 2026-11-06 | 模型：GLM-5.3-Flash

修改刚刚的html，看着就很杂乱要有立体感，打开官方示例 swiper/demo/257-effect-creative.html，配合 AI 读懂 creativeEffect 的 transform 写法，为演示四新增第 7 个按钮「creative 电影墙」。效果要求：上一张缩小左移并带角度、下一张放大右移进场（参数自定，但要"像电影选片墙"）

## 2026-11-06 | 模型：GLM-5.3-Flash

① 为光影展添加第六件展品爱达·魔都号（首艘国产大型邮轮，2024 年 1 月首航）图片如上所示，slide 结构完整；② 挑一个课堂上没讲过的 Swiper 能力加上去：zoom 双击缩放。

## 2026-11-09 | 模型：Kimi-K3

根据图片中的任务一，二，三，帮我在swiper-task.html中进行代码编写，任务一进行迭代两轮提示词，任务二creative 电影墙（这部分已经做好了在任务五，帮我进行检查准确性)，再丰富任务三内容，要求图片里的要求要全部进行作答，并且格式按照swiper-task.html里面写好的格式进行代码编写

## 2026-11-09 | 模型：Kimi-K3

提示词那块完善一下，并且任务二，任务三也要有核心代码展示在作答区进行展示

## 2026-11-09 | 模型：Kimi-K3

任务一的提示词第一轮第二轮都要进行修改，完善一下，加上验证效果图

## 2026-11-09 | 模型：Kimi-K3

好的，推送到 GitHub

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

帮我在swiper-task.html中进行代码修改将
5  creative 电影墙，改到4  六种效果随心换中的第七个按钮，其余不进行修改

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

好的，推送到 GitHub

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

"页面上有个 id 叫 wySw4 的轮播容器，Swiper 库已经通过 CDN 引入好了。帮我写一段初始化代码：让它能无缝循环播放，每隔 3.2 秒自动翻一页就行。"

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

"你是资深前端工程师。背景：Swiper 11 已通过 CDN 引入，页面有轮播容器 #wySw4、分页器容器 #wyPag4。请生成 new Swiper('#wySw4', {...}) 的完整配置，以下 4 条需求缺一不可：① loop: true 无缝循环；② autoplay 每 3200ms 自动翻页，且用户手动拖动后自动播放不停止（必须显式写 disableOnInteraction: false）；③ pagination.el 指向 '#wyPag4' 且 clickable: true 可点击跳转；④ 初始切换效果 effect 为 'cube'，并附 cubeEffect 阴影参数（shadow、slideShadows、shadowOffset、shadowScale）。输出约束：只输出配置代码，不要解释。"

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

`d:/程序设计比赛题库/Web前端技术课程/LNN_prompt.md`帮我把这个人口加在swiper-task.html中

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

var wySw4 = new Swiper('#wySw4', {
  loop: true,
  autoplay: {
    delay: 3200
  }
});根据这个第一轮提示词，做出这个的效果展示页面滑动效果在swiper-task.html中

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

var wySw4 = new Swiper('#wySw4', {
  loop: true,
  effect: 'cube',
  autoplay: {
    delay: 3200,
    disableOnInteraction: false
  },
  pagination: {
    el: '#wyPag4',
    clickable: true
  },
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94
  }
});根据这个第二轮提示词，做出这个的效果展示页面滑动效果在swiper-task.html中

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

var wySw4 = new Swiper('#wySw4', {
loop: true,
autoplay: {
delay: 3200
}
});根据这个第一轮提示词，做出这个的效果展示页面滑动效果在swiper-task.html中，在任务一作答 · 提示词工程师补全所有效果展示，代码根据我给出进行设计

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

把两轮提示词的截图部分删掉，并且将两轮提示词演示的轮播效果一致

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

第 2 轮配置实况演示，第二轮结果改成平推

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

`net::ERR_ABORTED http://127.0.0.1:8333/swiper-task.html`修改错误（将 Swiper 库由 CDN 改为本地 cdn/swiper 引用）

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

好的，按这个方案修改（选择：在 swiper-task.html 加 CSP meta 并用 nonce 白名单，拦截 IDE 注入的 /@vite/client 脚本）

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

任务三：挑一个课堂上没讲过的 zoom 双击缩放，把第六件展品第六件展品爱达·魔都号（首艘国产大型邮轮，2024 年 1 月首航），按照这个效果进行代码编写，把之前的任务三进行修改，文字加代码

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

根据swiper文件夹里面的demo帮我把任务二里面的原点分页器修改成一个没有用过的效果的圆点分页器

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

请帮我排查分页器效果不显示的原因

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

帮我把每个答辩抽问，连问这个隐藏起来，点击才可以展开

## 2026-11-11 | 模型：DeepSeek-V4.1-Flash

提交到GitHub
