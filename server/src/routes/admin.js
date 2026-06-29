const express = require('express')
const path = require('path')
const fs = require('fs')
const upload = require('../middleware/upload')
const { authMiddleware, login } = require('../middleware/auth')
const { parsePdf } = require('../services/pdfParser')
const { exportToStatic } = require('../services/staticExport')
const { success, fail } = require('../utils/response')

const router = express.Router()

const dataFile = path.resolve(process.env.DATA_FILE || './data/resume.json')
const pdfFile = path.resolve(process.env.UPLOAD_DIR || './uploads', 'resume.pdf')

function readResumeData() {
  if (!fs.existsSync(dataFile)) return null
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
}

function saveResumeData(data) {
  const dir = path.dirname(dataFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8')
}

router.post('/login', (req, res) => {
  const { password } = req.body
  if (!password) return fail(res, '请输入密码')

  const token = login(password)
  if (!token) return fail(res, '密码错误', 401, 401)

  success(res, { token })
})

router.get('/status', authMiddleware, (_req, res) => {
  const data = readResumeData()
  if (!data || !data.updatedAt) {
    return success(res, { hasResume: false })
  }
  success(res, {
    hasResume: true,
    fileName: data.fileName,
    updatedAt: data.updatedAt,
    name: data.name
  })
})

router.post('/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return fail(res, err.message || '上传失败')
    }
    if (!req.file) {
      return fail(res, '请选择 PDF 文件')
    }

    try {
      const parsed = await parsePdf(req.file.path, req.file.originalname)
      saveResumeData(parsed)
      exportToStatic(parsed, pdfFile)
      success(res, parsed, '简历更新成功，已同步到静态文件')
    } catch (e) {
      if (fs.existsSync(pdfFile)) fs.unlinkSync(pdfFile)
      fail(res, e.message || 'PDF 解析失败')
    }
  })
})

module.exports = router
