# Cloudflare Pages 手动部署指南

## 1. 创建或确认 Pages 项目
- 打开 Cloudflare Dashboard → **Pages** → **Create project**。
- 选择 **Direct Upload**（手动部署模式），填写项目名称（需与 `wrangler.toml` 中 `name` 保持一致，例如 `web3-university-front`）。
- 创建完成后会得到一个空的部署历史，后续命令会向该项目发布构建产物。

## 2. 准备访问凭据
1. 若还没有 API Token：  
   Cloudflare Dashboard → 右上角头像 → **My Profile** → **API Tokens** → **Create Token**，使用自定义模板，至少勾选  
   `Account → Cloudflare Pages → Edit`，账户范围选你的 Cloudflare 账户。
2. 获取 `Account ID`：  
   Pages 页面右上角或 My Profile → API Tokens 页面底部均显示 Account ID。
3. 在终端导出凭据（每个终端会话都需要执行一次）：
   ```bash
   export CLOUDFLARE_API_TOKEN=<你的Token>
   export CLOUDFLARE_ACCOUNT_ID=<你的AccountID>
   ```
   > 建议不要把 Token 写入仓库；如需长期使用，可写入本地 shell profile，但务必注意安全。

## 3. 本地构建与部署
在仓库根目录执行：
```bash
pnpm install --frozen-lockfile       # 首次或依赖更新时运行
pnpm run cf:deploy -- --branch dev   # 构建 + 部署到指定 Pages 分支
```
- `cf:deploy` 会调用 `scripts/deploy-cloudflare.sh`，默认读取 `wrangler.toml` 中的项目名。
- 如果刚执行过 `pnpm run cf:build`，可追加 `--skip-build` 复用现有 `.vercel/output`。
- 部署到生产可将 `--branch dev` 改为 `--branch production`（或省略该参数，默认 production）。

## 4. 配置环境变量
- Cloudflare Pages → 目标项目 → **Settings → Environment variables**，补齐所有运行所需的变量（例如 `NEXT_PUBLIC_*`、服务端密钥等）。
- 生产与预览环境可分别维护不同的变量集合，避免误用。

## 5. 验证与常见提示
- 部署成功后，CLI 会输出访问链接，打开确认页面是否正常渲染。
- 若遇到权限错误，请检查 API Token 是否拥有 `Pages · Edit` 权限，以及 Account ID 是否正确。
- 构建失败时，可先在本地运行 `pnpm run cf:build` 或 `pnpm run type-check` 排查，修复后再重新部署。
