<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllArticles } from '@/services/article'
import { getAllTopics } from '@/services/topic'
import { getTopicsByArticleId } from '@/services/article_topic'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const stats = ref({
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  totalTopics: 0
})

// 扩展文章接口，添加topics字段
interface ArticleWithTopics {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
  topics: string[]
}

const recentArticles = ref<ArticleWithTopics[]>([])
const topicDistribution = ref<{ name: string, value: number }[]>([])

// 获取统计数据
const fetchStats = async () => {
  try {
    loading.value = true
    const [articlesRes, topicsRes] = await Promise.all([
      getAllArticles(),
      getAllTopics()
    ])

    if (articlesRes.success && articlesRes.data) {
      const articles = articlesRes.data
      stats.value.totalArticles = articles.length
      stats.value.publishedArticles = articles.filter(a => a.published).length
      stats.value.draftArticles = articles.filter(a => !a.published).length
      
      // 获取最近的文章及其标签
      const recentArticlesWithTopics = await Promise.all(
        articles
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(async (article) => {
            const topicsRes = await getTopicsByArticleId(article.id)
            return {
              ...article,
              topics: topicsRes.success ? topicsRes.data?.map(t => t.topic_id) || [] : []
            }
          })
      )
      recentArticles.value = recentArticlesWithTopics
    }

    if (topicsRes.success && topicsRes.data) {
      stats.value.totalTopics = topicsRes.data.length
      
      // 统计每个标签下的文章数量
      const topicCounts = new Map<string, number>()
      if (articlesRes.success && articlesRes.data) {
        for (const article of articlesRes.data) {
          const topicsRes = await getTopicsByArticleId(article.id)
          if (topicsRes.success && topicsRes.data) {
            topicsRes.data.forEach(topic => {
              topicCounts.set(topic.topic_id, (topicCounts.get(topic.topic_id) || 0) + 1)
            })
          }
        }
      }
      
      topicDistribution.value = topicsRes.data.map(topic => ({
        name: topic.name,
        value: topicCounts.get(topic.id) || 0
      }))
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

// 跳转到文章编辑页
const goToEdit = (id: string) => {
  router.push(`/articleedit/${id}`)
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎使用博客管理系统</h1>
      <p>在这里管理您的博客文章和标签</p>
    </div>

    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="card-header">
                <span>文章总数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.totalArticles }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="card-header">
                <span>已发布文章</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.publishedArticles }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="card-header">
                <span>草稿文章</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.draftArticles }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="card-header">
                <span>标签总数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.totalTopics }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="recent-articles">
            <template #header>
              <div class="card-header">
                <span>最近文章</span>
                <el-button type="primary" link @click="router.push('/articlemanage/articlelist')">
                  查看全部
                </el-button>
              </div>
            </template>
            <el-table :data="recentArticles" style="width: 100%" v-loading="loading">
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="published" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.published ? 'success' : 'info'">
                    {{ row.published ? '已发布' : '草稿' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="创建时间" width="180">
                <template #default="{ row }">
                  {{ formatDate(row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="goToEdit(row.id)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="topic-distribution">
            <template #header>
              <div class="card-header">
                <span>标签分布</span>
                <el-button type="primary" link @click="router.push('/articlemanage/topics')">
                  管理标签
                </el-button>
              </div>
            </template>
            <div class="topic-list">
              <div v-for="topic in topicDistribution" :key="topic.name" class="topic-item">
                <span class="topic-name">{{ topic.name }}</span>
                <el-progress 
                  :percentage="(topic.value / stats.totalArticles * 100) || 0" 
                  :format="() => topic.value"
                  :stroke-width="15"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 16px;
  color: #606266;
}

.stats-section {
  margin-bottom: 40px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
  margin: 10px 0;
}

.content-section {
  margin-top: 20px;
}

.recent-articles {
  margin-bottom: 20px;
}

.topic-distribution {
  height: 100%;
}

.topic-list {
  padding: 10px 0;
}

.topic-item {
  margin-bottom: 20px;
}

.topic-name {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

:deep(.el-progress-bar__inner) {
  transition: all 0.3s ease;
}

:deep(.el-progress-bar__outer) {
  background-color: #f5f7fa;
}
</style>
