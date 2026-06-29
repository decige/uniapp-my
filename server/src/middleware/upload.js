const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, _file, cb) => cb(null, 'resume.pdf')
})

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('仅支持 PDF 文件'))
    }
  }
})

module.exports = upload
