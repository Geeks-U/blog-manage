<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Document, Collection } from '@element-plus/icons-vue'

const route = useRoute()
const activeIndex = ref(route.path)
</script>

<template>
  <div class="article-manage">
    <el-menu
      :default-active="activeIndex"
      class="nav-menu"
      mode="horizontal"
      router
    >
      <el-menu-item index="/articlemanage/home">
        <el-icon><HomeFilled /></el-icon>
        首页
      </el-menu-item>
      <el-menu-item index="/articlemanage/articlelist">
        <el-icon><Document /></el-icon>
        文章列表
      </el-menu-item>
      <el-menu-item index="/articlemanage/topics">
        <el-icon><Collection /></el-icon>
        标签管理
      </el-menu-item>
    </el-menu>
    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.article-manage {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.nav-menu {
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-container {
  padding: 20px;
  margin: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
