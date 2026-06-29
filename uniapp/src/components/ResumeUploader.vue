<template>
  <view class="uploader">
    <view class="upload-area" @click="chooseFile">
      <text class="icon">📄</text>
      <text class="label">{{ fileName || '点击选择 PDF 简历' }}</text>
      <text class="hint">支持 .pdf，最大 10MB</text>
    </view>

    <button
      class="upload-btn"
      :disabled="!hasFile || uploading"
      :loading="uploading"
      @click="handleUpload"
    >
      {{ uploading ? '上传解析中...' : '上传并更新简历' }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { uploadResume } from '../api/resume.js'
import { getToken } from '../utils/request.js'

const emit = defineEmits(['success'])

const fileName = ref('')
const hasFile = ref(false)
const uploading = ref(false)

// #ifdef H5
let selectedFile = null
// #endif

// #ifndef H5
let filePath = ''
// #endif

function chooseFile() {
  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.pdf,application/pdf'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      uni.showToast({ title: '文件不能超过 10MB', icon: 'none' })
      return
    }
    selectedFile = file
    fileName.value = file.name
    hasFile.value = true
  }
  input.click()
  // #endif

  // #ifndef H5
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['pdf'],
    success: (res) => {
      const file = res.tempFiles[0]
      filePath = file.path
      fileName.value = file.name
      hasFile.value = true
    }
  })
  // #endif
}

async function handleUpload() {
  if (!hasFile.value) return
  uploading.value = true
  try {
    // #ifdef H5
    const formData = new FormData()
    formData.append('file', selectedFile)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    })
    const body = await res.json()
    if (body.code === 0) {
      uni.showToast({ title: '更新成功', icon: 'success' })
      emit('success')
    } else {
      uni.showToast({ title: body.message || '上传失败', icon: 'none' })
    }
    // #endif

    // #ifndef H5
    await uploadResume(filePath)
    uni.showToast({ title: '更新成功', icon: 'success' })
    emit('success')
    // #endif
  } catch (e) {
    console.error(e)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.uploader {
  padding: 32rpx 0;
}

.upload-area {
  background: #f8f9ff;
  border: 2rpx dashed #667eea;
  border-radius: 16rpx;
  padding: 60rpx 32rpx;
  text-align: center;
  margin-bottom: 32rpx;
}

.icon {
  display: block;
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.label {
  display: block;
  font-size: 30rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.hint {
  font-size: 24rpx;
  color: #999;
}

.upload-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
}

.upload-btn[disabled] {
  opacity: 0.5;
}
</style>
