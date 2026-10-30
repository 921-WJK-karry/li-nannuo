---
name: commit-to-github
description: 将本项目提交 commit 并 push 到 GitHub 仓库 li-nannuo（SSH 方式）。当用户要求提交到 github、push 到 li-nannuo、同步代码到 GitHub 时使用。不要用于推送 Gitee 远程。
---

# 提交到 GitHub（li-nannuo）

将本仓库的变更提交并推送到 GitHub 远程 `github`，仓库地址 `git@github.com:921-WJK-karry/li-nannuo.git`，SSH 公钥为 `ssh-ed25519 ...3290985376@qq.com`（私钥已在本机 `~/.ssh` 配置好，git 身份 `linannuo / 3290985376@qq.com` 已配置，勿改 git config）。

## 步骤

1. **先记录提示词**：按项目规则，把用户本次的提示词以追加方式写入 `LNN_prompt.md`（时间、模型、内容），该文件一并提交。
2. **查看状态**：并行执行 `git status`、`git diff`（暂存与未暂存）、`git log --oneline -5`，确认要提交的文件与提交信息风格（历史为简短中文一行）。
3. **暂存**：用 `git add <具体文件>` 按文件名添加，不要用 `git add -A`。不要提交 `.env`、密钥等敏感文件。
4. **提交**：用 HEREDOC 传入简短中文提交信息，聚焦"为什么"；创建新提交，不要 amend。
5. **远程**：`git remote -v` 检查是否已有名为 `github` 的远程；没有则 `git remote add github git@github.com:921-WJK-karry/li-nannuo.git`。已有 `origin`、`li-nan-g` 指向 Gitee，勿动。
6. **连通性**：首次推送前执行 `ssh -T git@github.com -o StrictHostKeyChecking=accept-new`，确认认证通过（返回 `Hi 921-WJK-karry!` 即成功；无需交互式确认）。
7. **推送**：`git push -u github master`（分支为 `master`）。禁止 `--force`；如被拒先 `git pull --no-rebase github master` 处理分叉，仍失败则报告用户，不要强推。
8. **验证**：推送后 `git status` 确认工作区干净、与 `github/master` 同步。

## 注意

- 全程不要修改 git config、不要跳过钩子、不要 gpg-sign=false。
- 推送仅在用户明确要求时执行；本技能被触发即视为用户已要求推送。
