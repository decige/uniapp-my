<template>
  <view class="page">
    <!-- 未登录 -->
    <view v-if="!loggedIn" class="login-box">
      <text class="title">简历管理</text>
      <text class="subtitle">上传 PDF 并解析（需启动后端）</text>

      <view v-if="staticStatus.hasResume" class="cache-info">
        <text>本地已有简历：{{ staticStatus.name || staticStatus.fileName }}</text>
        <text>更新时间：{{ formatTime(staticStatus.updatedAt) }}</text>
      </view>

      <input
        v-model="password"
        class="input"
        type="password"
        placeholder="请输入管理密码"
        @confirm="handleLogin"
      />
      <button class="login-btn" @click="handleLogin">登录</button>
    </view>

    <!-- 已登录 -->
    <view v-else class="admin-panel">
      <view class="status-card">
        <text class="status-title">当前简历</text>
        <view v-if="status.hasResume" class="status-info">
          <text>文件名：{{ status.fileName }}</text>
          <text>更新时间：{{ formatTime(status.updatedAt) }}</text>
        </view>
        <text v-else class="no-resume">尚未上传简历</text>
      </view>

      <ResumeUploader @success="onUploadSuccess" />

      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { adminLogin, getAdminStatus, getStaticResumeStatus } from '../../api/resume.js'
import { getToken, setToken, clearToken } from '../../utils/request.js'

const ResumeUploader = defineAsyncComponent(() =>
  import('../../components/ResumeUploader.vue')
)

const loggedIn = ref(false)
const password = ref('')
const status = ref({ hasResume: false })
const staticStatus = ref({ hasResume: false })

onMounted(() => {
  loadStaticStatus()
  if (getToken()) {
    loggedIn.value = true
    loadStatus()
  }
})

async function loadStaticStatus() {
  staticStatus.value = await getStaticResumeStatus()
}

async function handleLogin() {
  if (!password.value) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  try {
    const data = await adminLogin(password.value)
    setToken(data.token)
    loggedIn.value = true
    password.value = ''
    loadStatus()
  } catch (e) {
    // toast 已在 request 中处理
  }
}

async function loadStatus() {
  try {
    status.value = await getAdminStatus()
  } catch (e) {
    loggedIn.value = false
  }
}

function onUploadSuccess() {
  loadStatus()
  loadStaticStatus()
}

function handleLogout() {
  clearToken()
  loggedIn.value = false
  status.value = { hasResume: false }
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40rpx 32rpx;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding-top: 120rpx;
}

.title {
  display: block;
  text-align: center;
  font-size: 44rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12rpx;
}

.subtitle {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.cache-info {
  width: 100%;
  background: #f0f4ff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 26rpx;
  color: #667eea;
}

.input {
  width: 100%;
  height: 88rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 30rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
}

.admin-panel {
  padding-top: 20rpx;
}

.status-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.status-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #667eea;
  display: block;
  margin-bottom: 16rpx;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.no-resume {
  font-size: 28rpx;
  color: #999;
}

.logout-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  color: #999;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: 1rpx solid #eee;
  margin-top: 40rpx;
}
</style>
