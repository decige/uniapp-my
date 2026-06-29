const fs = require('fs')
const pdfParse = require('pdf-parse')
const { formatResume } = require('./resumeFormatter')

async function parsePdf(filePath, fileName) {
  const buffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(buffer)

  if (!pdfData.text || !pdfData.text.trim()) {
    throw new Error('PDF 中未提取到文字，请使用文字版 PDF（非纯图片扫描件）')
  }

  return formatResume(pdfData.text, fileName)
}

module.exports = { parsePdf }
