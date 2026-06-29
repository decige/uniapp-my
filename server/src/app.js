require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3000

const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads')
const dataDir = path.dirname(path.resolve(process.env.DATA_FILE || './data/resume.json'))

;[uploadDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ code: 500, message: err.message || '服务器错误', data: null })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
