const crypto = require('crypto')

const tokens = new Set()

function generateToken() {
  const token = crypto.randomBytes(32).toString('hex')
  tokens.add(token)
  return token
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token || !tokens.has(token)) {
    return res.status(401).json({ code: 401, message: '未授权，请先登录', data: null })
  }

  next()
}

function verifyPassword(password) {
  return password === process.env.ADMIN_PASSWORD
}

function login(password) {
  if (!verifyPassword(password)) return null
  return generateToken()
}

module.exports = { authMiddleware, login }
