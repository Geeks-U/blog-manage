<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createTopic, updateTopicById, deleteTopicById, getAllTopics } from '@/services/topic.ts'

interface Topic {
  id: string
  name: string
}

const topics = ref<Topic[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentTopic = ref<Topic>({ id: '', name: '' })
const isEdit = ref(false)

// 获取所有标签
const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await getAllTopics()
    if (res.success) {
      topics.value = res.data || []
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('获取标签列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 打开创建标签对话框
const handleCreate = () => {
  isEdit.value = false
  currentTopic.value = { id: '', name: '' }
  dialogTitle.value = '创建标签'
  dialogVisible.value = true
}

// 打开编辑标签对话框
const handleEdit = (topic: Topic) => {
  isEdit.value = true
  currentTopic.value = { ...topic }
  dialogTitle.value = '编辑标签'
  dialogVisible.value = true
}

// 保存标签
const handleSave = async () => {
  if (!currentTopic.value.name.trim()) {
    ElMessage.warning('标签名称不能为空')
    return
  }

  try {
    if (isEdit.value) {
      const res = await updateTopicById(currentTopic.value)
      if (res.success) {
        ElMessage.success('更新标签成功')
        dialogVisible.value = false
        fetchTopics()
      } else {
        ElMessage.error(res.message)
      }
    } else {
      const res = await createTopic({ name: currentTopic.value.name })
      if (res.success) {
        ElMessage.success('创建标签成功')
        dialogVisible.value = false
        fetchTopics()
      } else {
        ElMessage.error(res.message)
      }
    }
  } catch (err) {
    ElMessage.error(isEdit.value ? '更新标签失败' : '创建标签失败')
    console.error(err)
  }
}

// 删除标签
const handleDelete = async (topic: Topic) => {
  try {
    await ElMessageBox.confirm('确定要删除该标签吗？', '提示', {
      type: 'warning'
    })
    
    const res = await deleteTopicById(topic.id)
    if (res.success) {
      ElMessage.success('删除标签成功')
      fetchTopics()
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除标签失败')
      console.error(err)
    }
  }
}

onMounted(() => {
  fetchTopics()
})
</script>

<template>
  <div class="topic-manage">
    <div class="header">
      <h2>标签管理</h2>
      <el-button type="primary" @click="handleCreate">创建标签</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="topics"
      style="width: 100%"
      border
    >
      <el-table-column prop="name" label="标签名称" min-width="200" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="currentTopic" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="currentTopic.name" placeholder="请输入标签名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.topic-manage {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
