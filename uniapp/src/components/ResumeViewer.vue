<template>
  <view class="viewer">
    <view class="header">
      <text class="name">{{ resume.name || '在线简历' }}</text>
      <view v-if="contactLine" class="contact">
        <text>{{ contactLine }}</text>
      </view>
    </view>

    <view v-for="(section, idx) in resume.sections" :key="idx" class="section">
      <view class="section-title">{{ section.title }}</view>
      <view v-if="section.content" class="section-content">{{ section.content }}</view>
      <view v-if="section.items && section.items.length" class="section-items">
        <view v-for="(item, i) in section.items" :key="i" class="item">
          <text>{{ item }}</text>
        </view>
      </view>
    </view>

    <view v-if="!resume.sections?.length && resume.rawText" class="raw-text">
      <text>{{ resume.rawText }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resume: {
    type: Object,
    default: () => ({})
  }
})

const contactLine = computed(() => {
  const c = props.resume.contact
  if (!c) return ''
  return [c.phone, c.email].filter(Boolean).join('  ·  ')
})
</script>

<style scoped>
.viewer {
  padding: 0 0 40rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx 48rpx;
  border-radius: 0 0 32rpx 32rpx;
  margin-bottom: 32rpx;
}

.name {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16rpx;
}

.contact {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.section {
  background: #fff;
  margin: 0 24rpx 24rpx;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 20rpx;
  padding-left: 16rpx;
  border-left: 6rpx solid #667eea;
}

.section-content {
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
}

.section-items .item {
  font-size: 28rpx;
  line-height: 1.8;
  color: #444;
  padding: 8rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-items .item:last-child {
  border-bottom: none;
}

.raw-text {
  margin: 0 24rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 1.8;
  white-space: pre-wrap;
  color: #333;
}
</style>
