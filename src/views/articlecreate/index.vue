<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createArticle } from '@/services/article.ts'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)

// 新文章数据
const newArticle = ref({
  title: '',
  content: '',
  excerpt: '',
  published: false
})

// 创建文章
const createNewArticle = async () => {
  try {
    loading.value = true
    const res = await createArticle(newArticle.value)
    
    if (res.success && res.data) {
      ElMessage.success('创建成功')
      router.push('/articlemanage/articlelist')
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (err: any) {
    ElMessage.error(err.message || '创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="article-create">
    <div class="header">
      <h1>新建文章</h1>
      <el-button type="primary" @click="createNewArticle" :loading="loading">创建</el-button>
    </div>

    <el-form :model="newArticle" label-width="80px" class="create-form">
      <el-form-item label="标题">
        <el-input v-model="newArticle.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="摘要">
        <el-input
          v-model="newArticle.excerpt"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要"
        />
      </el-form-item>

      <el-form-item label="内容">
        <el-input
          v-model="newArticle.content"
          type="textarea"
          :rows="15"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <el-form-item label="发布">
        <el-switch v-model="newArticle.published" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.article-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.create-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style> 