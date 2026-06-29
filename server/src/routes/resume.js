const express = require('express')
const path = require('path')
const fs = require('fs')
const { success, fail } = require('../utils/response')

const router = express.Router()

const dataFile = path.resolve(process.env.DATA_FILE || './data/resume.json')
const pdfFile = path.resolve(process.env.UPLOAD_DIR || './uploads', 'resume.pdf')

function readResumeData() {
  if (!fs.existsSync(dataFile)) return null
  const raw = fs.readFileSync(dataFile, 'utf-8')
  return JSON.parse(raw)
}

router.get('/', (_req, res) => {
  const data = readResumeData()
  if (!data || !data.updatedAt) {
    return fail(res, '暂无简历，请先在管理页上传', 404, 404)
  }
  success(res, data)
})

router.get('/file', (_req, res) => {
  if (!fs.existsSync(pdfFile)) {
    return fail(res, 'PDF 文件不存在', 404, 404)
  }
  const data = readResumeData()
  const fileName = data?.fileName || 'resume.pdf'
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`)
  fs.createReadStream(pdfFile).pipe(res)
})

module.exports = router
