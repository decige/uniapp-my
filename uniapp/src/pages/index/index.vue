<template>
  <view class="page">
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <view v-else-if="error" class="empty">
      <text class="empty-icon">📋</text>
      <text class="empty-text">{{ error }}</text>
    </view>

    <template v-else>
      <ResumeViewer :resume="resume" />

      <view class="footer">
        <button class="preview-btn" @click="goPreview">📄 查看原版 PDF</button>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getResume } from '../../api/resume.js'
import ResumeViewer from '../../components/ResumeViewer.vue'

const loading = ref(true)
const error = ref('')
const resume = ref({})

onMounted(async () => {
  try {
    const data = await getResume()
    resume.value = data
    if (data.name) {
      uni.setNavigationBarTitle({ title: `${data.name} - 简历` })
    }
  } catch (e) {
    error.value = '暂无简历内容'
  } finally {
    loading.value = false
  }
})

function goPreview() {
  uni.navigateTo({ url: '/pages/preview/preview' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.loading, .empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #999;
  font-size: 28rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.preview-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
}
</style>
