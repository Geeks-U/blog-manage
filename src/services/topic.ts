import { supabase } from "@/utils/request.ts"

const topicTableName = 'topics'

interface CreateTopic {
  name: string
}

type CreateTopicResult = {
  success: boolean
  message: string
  data: { id: string } | null
}

export const createTopic = (topic: CreateTopic): Promise<CreateTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(topicTableName)
        .insert([{ name: topic.name }])
        .select('id')

      if (error) {
        reject({
          success: false,
          message: '创建标签失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '创建标签成功',
        data: data ? { id: data[0].id } : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '创建标签失败: ' + err,
        data: null
      })
    }
  })
}

// createTopic({ name: '人工智能' })
//   .then((res) => {
//     console.log('创建标签结果:', res)
//   })
//   .catch((err) => {
//     console.error('创建标签错误:', err)
//   })


interface GetTopic {
  id: string
  name: string
}

type GetTopicResult = {
  success: boolean
  message: string
  data: GetTopic | null
}

export const getTopicById = (topicId: string): Promise<GetTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(topicTableName)
        .select('*')
        .eq('id', topicId)

      if (error) {
        reject({
          success: false,
          message: '获取标签失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '获取标签成功',
        data: data ? data[0] : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取标签失败: ' + err,
        data: null
      })
    }
  })
}

// getTopicById('eaec9257-eb4c-470a-8de9-152429d190de')
//   .then((res) => {
//     console.log('获取标签结果:', res)
//   })
//   .catch((err) => {
//     console.error('获取标签错误:', err)
//   })

type GetAllTopicResult = {
  success: boolean
  message: string
  data: GetTopic[] | null
}

export const getAllTopics = (): Promise<GetAllTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(topicTableName)
        .select('*')
      if (error) {
        reject({
          success: false,
          message: '获取标签失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '获取标签成功',
        data: data ? data : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取标签失败: ' + err,
        data: null
      })
    }
  })
}

interface UpdateTopic {
  id: string
  name: string
}

type UpdateTopicResult = {
  success: boolean
  message: string
  data: null
}

export const updateTopicById = (topic: UpdateTopic): Promise<UpdateTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(topicTableName)
        .update({ name: topic.name })
        .eq('id', topic.id)

      if (error) {
        reject({
          success: false,
          message: '更新标签失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '更新标签成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '更新标签异常: ' + err,
        data: null
      })
    }
  })
}

// updateTopicById({
//   id: 'eaec9257-eb4c-470a-8de9-152429d190de',
//   name: '机器学习'
// })
//   .then((res) => {
//     console.log('更新标签结果:', res)
//   })
//   .catch((err) => {
//     console.error('更新标签错误:', err)
//   })


type DeleteTopicResult = {
  success: boolean
  message: string
  data: null
}

export const deleteTopicById = (topicId: string): Promise<DeleteTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(topicTableName)
        .delete()
        .eq('id', topicId)

      if (error) {
        reject({
          success: false,
          message: '删除标签失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '删除标签成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '删除标签失败: ' + err,
        data: null
      })
    }
  })
}

// deleteTopicById('eaec9257-eb4c-470a-8de9-152429d190de')
//   .then((res) => {
//     console.log('删除标签结果:', res)
//   })
//   .catch((err) => {
//     console.error('删除标签错误:', err)
//   })
