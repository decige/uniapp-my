import { BASE_URL } from './platform.js'

const TOKEN_KEY = 'admin_token'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

function request(options) {
  return new Promise((resolve, reject) => {
    const header = { ...(options.header || {}) }
    if (options.auth) {
      const token = getToken()
      if (token) header.Authorization = `Bearer ${token}`
    }

    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        if (res.statusCode === 401) {
          clearToken()
          uni.showToast({ title: '登录已过期', icon: 'none' })
          reject(new Error('未授权'))
          return
        }
        const body = res.data
        if (body.code === 0) {
          resolve(body.data)
        } else {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' })
          reject(new Error(body.message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

export function uploadFile(url, filePath, name = 'file') {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}${url}`,
      filePath,
      name,
      header: { Authorization: `Bearer ${getToken()}` },
      success: (res) => {
        const body = JSON.parse(res.data)
        if (body.code === 0) {
          resolve(body.data)
        } else {
          uni.showToast({ title: body.message || '上传失败', icon: 'none' })
          reject(new Error(body.message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default {
  get: (url, auth = false) => request({ url, method: 'GET', auth }),
  post: (url, data, auth = false) => request({ url, method: 'POST', data, auth })
}
