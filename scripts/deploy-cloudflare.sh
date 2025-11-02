#!/usr/bin/env bash

# Cloudflare Pages 手动部署辅助脚本。
# 目的是统一团队的本地构建与部署流程，让每个成员都能用同一套命令把代码部署到自己的 Pages 项目。
#
# 前置条件：
#   - 本地 PATH 中可以访问 pnpm。
#   - wrangler CLI 可用（脚本会通过 pnpm dlx 临时安装）。
#   - 仓库根目录存在有效的 wrangler.toml。
#   - 当前 shell 已导出 Cloudflare 凭据：
#       CLOUDFLARE_API_TOKEN
#       CLOUDFLARE_ACCOUNT_ID
#     （项目名称可以通过 CLOUDFLARE_PROJECT_NAME 环境变量或 --project-name 传入，
#      若两者都未提供会自动读取 wrangler.toml 中的 name）
#
# 用法示例：
#   scripts/deploy-cloudflare.sh
#   scripts/deploy-cloudflare.sh --branch dev --project-name my-playground
#   scripts/deploy-cloudflare.sh --skip-install --skip-build

set -euo pipefail

show_help() {
	cat <<'EOF'
用法：deploy-cloudflare.sh [选项]

可选参数：
  --branch <name>        部署到指定的 Cloudflare Pages 分支，默认 production。
  --project-name <name>  覆盖 CLOUDFLARE_PROJECT_NAME 环境变量。
  --skip-install         跳过 "pnpm install --frozen-lockfile"。
  --skip-build           跳过 Next.js 构建（需要已有的构建结果）。
  -h, --help             显示本帮助信息。

脚本会顺序执行依赖安装（可跳过）、使用 @cloudflare/next-on-pages 构建，
最后调用 wrangler pages deploy 推送到 Cloudflare Pages。
EOF
}

BRANCH="production"
PROJECT_NAME="${CLOUDFLARE_PROJECT_NAME:-}"
SKIP_INSTALL=false
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
	case "$1" in
		--branch)
			if [[ $# -lt 2 ]]; then
				echo "error: --branch expects a value" >&2
				exit 1
			fi
			BRANCH="$2"
			shift 2
			;;
		--project-name)
			if [[ $# -lt 2 ]]; then
				echo "error: --project-name expects a value" >&2
				exit 1
			fi
			PROJECT_NAME="$2"
			shift 2
			;;
		--skip-install)
			SKIP_INSTALL=true
			shift
			;;
		--skip-build)
			SKIP_BUILD=true
			shift
			;;
		-h|--help)
			show_help
			exit 0
			;;
		*)
			echo "error: unknown option '$1'" >&2
			show_help
			exit 1
			;;
	esac
done

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

echo "👉 Repository root: ${REPO_ROOT}"
echo "👉 Target branch: ${BRANCH}"

if [[ -z "${PROJECT_NAME}" ]]; then
	if [[ -f "wrangler.toml" ]]; then
		PROJECT_NAME="$(awk -F '=' '/^name[[:space:]]*=/ {gsub(/[[:space:]]*/,"",$2); gsub(/"/,"",$2); print $2; exit}' wrangler.toml)"
	fi
fi

if [[ -z "${PROJECT_NAME}" ]]; then
	echo "error: 未检测到 Cloudflare 项目名称。" >&2
	echo "请在 wrangler.toml 中设置 name 字段、导出 CLOUDFLARE_PROJECT_NAME，或使用 --project-name <name>。" >&2
	exit 1
fi

echo "👉 Cloudflare project: ${PROJECT_NAME}"

if [[ ! -f "wrangler.toml" ]]; then
	echo "error: 未找到 wrangler.toml，请先在仓库根目录创建该文件再部署。" >&2
	exit 1
fi

if [[ "${SKIP_INSTALL}" == "false" ]]; then
	echo "📦 正在安装依赖（pnpm install --frozen-lockfile）..."
	pnpm install --frozen-lockfile
else
	echo "⏭️  已跳过依赖安装。"
fi

if [[ "${SKIP_BUILD}" == "false" ]]; then
	echo "🏗️  正在为 Cloudflare Pages 构建 Next.js 输出..."
	pnpm exec next-on-pages
else
	echo "⏭️  已跳过构建步骤（将复用现有 .vercel/output）。"
fi

STATIC_DIR=".vercel/output/static"
if [[ ! -d "${STATIC_DIR}" ]]; then
	echo "error: 预期在 ${STATIC_DIR} 中找到构建产物，但目录不存在。" >&2
	echo "请先执行构建步骤并确保成功后再部署。" >&2
	exit 1
fi

echo "☁️  正在通过 wrangler 部署到 Cloudflare Pages..."
pnpm dlx wrangler pages deploy "${STATIC_DIR}" \
	--project-name "${PROJECT_NAME}" \
	--branch "${BRANCH}"

echo "✅ 部署命令执行完毕，预览和生产地址请查看上方 CLI 输出。"
