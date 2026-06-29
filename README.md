# ccyuniapp — 个人在线简历

面试时直接分享链接，不用带纸质简历。

## 使用说明

**查看简历不需要启动后端**，数据缓存在 `uniapp/src/static/` 里。

**只有上传/更新简历时才需要启动后端。**

### 只看简历（后端不用开）

```bash
cd D:\vue\ccyuniapp\uniapp
npm run dev:h5
```

访问 http://localhost:5173/ 即可。

### 上传/更新简历（需要后端）

```bash
# 终端 1
cd D:\vue\ccyuniapp\server
npm run dev

# 终端 2
cd D:\vue\ccyuniapp\uniapp
npm run dev:h5
```

上传成功后，简历会自动同步到 `src/static/resume.json` 和 `resume.pdf`，之后又可以关掉后端只看简历。

### 上线部署

**Vercel 部署（推荐，免费 HTTPS 域名）**

1. GitHub 仓库导入 Vercel：https://vercel.com/new
2. 关键设置：

| 配置项 | 值 |
|--------|-----|
| Root Directory | `uniapp` |
| Framework Preset | Other |
| Build Command | `npm run build:h5` |
| Output Directory | `dist/build/h5` |

3. Deploy 即可，会得到 `https://xxx.vercel.app` 域名

> 查看简历走静态文件，**不需要 Node 后端**。管理页上传仍需本地启动后端。

**自建服务器**

1. HX 发行 → 网站-H5 → 生成 `dist/build/h5/`
2. 上传到 Nginx 静态目录
3. 配置 history 路由 fallback 到 `index.html`

## 配置

- 管理密码：修改 `server/.env` 中的 `ADMIN_PASSWORD`
- 生产域名：修改 `uniapp/utils/platform.js` 中非 H5 端的 `BASE_URL`
