<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllArticles, deleteArticleByArticleId } from '@/services/article'

const router = useRouter()
const loading = ref(false)
const articles = ref<any[]>([])

// 获取文章列表
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await getAllArticles()
    if (res.success && res.data) {
      articles.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取文章列表失败')
  } finally {
    loading.value = false
  }
}

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
})
</script>

<template>
  <div class="article-list">
    <div class="header">
      <h2>文章列表</h2>
      <el-button type="primary" @click="router.push('/articlecreate')">新建文章</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="articles"
      style="width: 100%"
      border
    >
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="excerpt" label="摘要" min-width="300" show-overflow-tooltip />
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
</style>