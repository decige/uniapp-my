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

H5 打包后是纯静态网站，**面试官访问不需要 Node.js 后端**。只有你自己更新简历时才需要临时启动后端。

## 配置

- 管理密码：修改 `server/.env` 中的 `ADMIN_PASSWORD`
- 生产域名：修改 `uniapp/utils/platform.js` 中非 H5 端的 `BASE_URL`
