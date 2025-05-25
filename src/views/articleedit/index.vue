<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleByArticleId, updateArticleByArticleId } from '@/services/article.ts'
import { getTopicsByArticleId, createArticleTopic, deleteAllTopicsByArticleId } from '@/services/article_topic.ts'
import { getAllTopics } from '@/services/topic.ts'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

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
const topics = ref<{ id: string, name: string }[]>([])
const selectedTopics = ref<string[]>([])

// 获取所有标签
const fetchTopics = async () => {
  try {
    const res = await getAllTopics()
    if (res.success && res.data) {
      topics.value = res.data
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取标签列表失败')
  }
}

// 获取文章的标签
const fetchArticleTopics = async () => {
  try {
    const res = await getTopicsByArticleId(articleId)
    if (res.success && res.data) {
      selectedTopics.value = res.data.map(t => t.topic_id)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取文章标签失败')
  }
}

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
      // 更新文章标签关联
      await deleteAllTopicsByArticleId(articleId)
      if (selectedTopics.value.length > 0) {
        const topicPromises = selectedTopics.value.map(topicId => 
          createArticleTopic({
            article_id: articleId,
            topic_id: topicId
          })
        )
        await Promise.all(topicPromises)
      }
      
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
  fetchTopics()
  fetchArticleTopics()
})
</script>

<template>
  <div class="article-edit">
    <div class="header">
      <div class="header-left">
        <el-button @click="router.back()" :icon="ArrowLeft">返回</el-button>
        <h1>编辑文章</h1>
      </div>
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

      <el-form-item label="标签">
        <el-select
          v-model="selectedTopics"
          multiple
          filterable
          placeholder="请选择文章标签"
          style="width: 100%"
        >
          <el-option
            v-for="topic in topics"
            :key="topic.id"
            :label="topic.name"
            :value="topic.id"
          />
        </el-select>
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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