<template>
  <view class="preview-wrap">
    <!-- #ifdef H5 -->
    <iframe v-if="pdfUrl" :src="pdfUrl" class="pdf-frame" frameborder="0" />
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="fallback">
      <text class="tip">当前平台请使用下方按钮打开 PDF</text>
    </view>
    <!-- #endif -->

    <view class="actions">
      <button class="btn primary" @click="openPdf">打开 / 下载 PDF</button>
    </view>
  </view>
</template>

<script setup>
import { getResumeFileUrl } from '../api/resume.js'

const pdfUrl = getResumeFileUrl()

function openPdf() {
  const url = getResumeFileUrl()

  // #ifdef H5
  window.open(url, '_blank')
  // #endif

  // #ifndef H5
  uni.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          showMenu: true
        })
      }
    },
    fail: () => {
      uni.showToast({ title: '打开失败', icon: 'none' })
    }
  })
  // #endif
}
</script>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.pdf-frame {
  flex: 1;
  width: 100%;
  border: none;
}

.fallback {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.tip {
  font-size: 28rpx;
  color: #999;
}

.actions {
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}
</style>
