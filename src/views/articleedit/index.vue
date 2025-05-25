<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleByArticleId, updateArticleByArticleId } from '@/services/article.ts'
import { ElMessage } from 'element-plus'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const articleId = route.params.id as string

// 文章接口
interface GetArticle {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
}

const article = ref<GetArticle | null>(null)
const loading = ref(false)

// 获取文章详情
const fetchArticle = async () => {
  try {
    loading.value = true
    const res = await getArticleByArticleId(articleId)
    if (res.success && res.data) {
      article.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取文章失败')
  } finally {
    loading.value = false
  }
}

// 保存文章
const saveArticle = async () => {
  if (!article.value) return
  
  try {
    loading.value = true
    const res = await updateArticleByArticleId({
      id: article.value.id,
      title: article.value.title,
      content: article.value.content,
      excerpt: article.value.excerpt,
      published: article.value.published
    })
    
    if (res.success) {
      ElMessage.success('保存成功')
      router.push('/articlemanage/articlelist')
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="article-edit">
    <div class="header">
      <h1>编辑文章</h1>
      <el-button type="primary" @click="saveArticle" :loading="loading">保存</el-button>
    </div>

    <el-form v-if="article" :model="article" label-width="80px" class="edit-form">
      <el-form-item label="标题">
        <el-input v-model="article.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="摘要">
        <el-input
          v-model="article.excerpt"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要"
        />
      </el-form-item>

      <el-form-item label="内容">
        <el-input
          v-model="article.content"
          type="textarea"
          :rows="15"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <el-form-item label="发布">
        <el-switch v-model="article.published" />
      </el-form-item>
    </el-form>

    <el-skeleton :rows="10" animated v-else />
  </div>
</template>

<style scoped>
.article-edit {
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

.edit-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>