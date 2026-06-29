import request, { uploadFile } from '../utils/request.js'

const STATIC_JSON = '/static/resume.json'
const STATIC_PDF = '/static/resume.pdf'

/** 从本地静态文件读取简历（无需后端） */
export function getResume() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: STATIC_JSON,
      success: (res) => {
        const data = res.data
        if (data && data.updatedAt) {
          resolve(data)
        } else {
          reject(new Error('暂无简历，请先在管理页上传'))
        }
      },
      fail: () => reject(new Error('读取简历失败'))
    })
  })
}

/** 获取本地缓存 PDF 地址（无需后端） */
export function getResumeFileUrl() {
  return STATIC_PDF
}

/** 读取本地静态简历状态（无需后端） */
export function getStaticResumeStatus() {
  return getResume()
    .then((data) => ({
      hasResume: true,
      fileName: data.fileName,
      updatedAt: data.updatedAt,
      name: data.name
    }))
    .catch(() => ({ hasResume: false }))
}

export function adminLogin(password) {
  return request.post('/api/login', { password })
}

export function getAdminStatus() {
  return request.get('/api/status', true)
}

export function uploadResume(filePath) {
  return uploadFile('/api/upload', filePath)
}
