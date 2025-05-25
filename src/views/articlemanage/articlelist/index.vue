<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllArticles, deleteArticleByArticleId } from '@/services/article'
import { getAllTopics } from '@/services/topic'
import { getTopicsByArticleId } from '@/services/article_topic'

const router = useRouter()
const loading = ref(false)
const articles = ref<any[]>([])
const allArticles = ref<any[]>([])
const topics = ref<any[]>([])
const selectedTopics = ref<string[]>([])
const filterMode = ref<'all' | 'any'>('any')

// 获取所有标签
const fetchTopics = async () => {
  try {
    const res = await getAllTopics()
    if (res.success && res.data) {
      topics.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取标签列表失败')
  }
}

// 获取文章列表
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await getAllArticles()
    if (res.success && res.data) {
      allArticles.value = res.data
      // 获取每篇文章的标签
      const articlesWithTopics = await Promise.all(
        res.data.map(async (article) => {
          const topicsRes = await getTopicsByArticleId(article.id)
          return {
            ...article,
            topics: topicsRes.success ? topicsRes.data?.map(t => t.topic_id) || [] : []
          }
        })
      )
      articles.value = articlesWithTopics
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 根据选中的标签过滤文章
const filteredArticles = computed(() => {
  if (selectedTopics.value.length === 0) {
    return articles.value
  }

  return articles.value.filter(article => {
    if (filterMode.value === 'all') {
      return selectedTopics.value.every(topicId => 
        article.topics.includes(topicId)
      )
    } else {
      return selectedTopics.value.some(topicId => 
        article.topics.includes(topicId)
      )
    }
  })
})

// 编辑文章
const handleEdit = (row: any) => {
  router.push(`/articleedit/${row.id}`)
}

// 删除文章
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    const res = await deleteArticleByArticleId(row.id)
    if (res.success) {
      ElMessage.success('删除成功')
      fetchArticles()
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchArticles()
  fetchTopics()
})
</script>

<template>
  <div class="article-list">
    <div class="header">
      <h2>文章列表</h2>
      <el-button type="primary" @click="router.push('/articlecreate')">新建文章</el-button>
    </div>

    <div class="filter-section">
      <div class="filter-left">
        <el-select
          v-model="selectedTopics"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="选择标签"
          style="width: 300px"
        >
          <el-option
            v-for="topic in topics"
            :key="topic.id"
            :label="topic.name"
            :value="topic.id"
          />
        </el-select>
      </div>
      <div class="filter-right">
        <el-radio-group v-model="filterMode">
          <el-radio-button value="any">任一满足</el-radio-button>
          <el-radio-button value="all">全部满足</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="filteredArticles"
      style="width: 100%"
      border
    >
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="excerpt" label="摘要" min-width="300" show-overflow-tooltip />
      <el-table-column label="标签" min-width="200">
        <template #default="{ row }">
          <el-tag
            v-for="topicId in row.topics"
            :key="topicId"
            class="topic-tag"
            size="small"
            effect="plain"
          >
            {{ topics.find(t => t.id === topicId)?.name }}
          </el-tag>
          <span v-if="!row.topics?.length" class="no-topic">无标签</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="updated_at" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.updated_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.article-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-left {
  display: flex;
  gap: 10px;
}

.filter-right {
  display: flex;
  gap: 10px;
}

.topic-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.no-topic {
  color: #909399;
  font-size: 12px;
}
</style>