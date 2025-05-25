import { supabase } from "@/utils/request.ts"

const tableName = 'article_topic'

interface CreateArticleTopic {
  article_id: string
  topic_id: string
}

type CreateArticleTopicResult = {
  success: boolean
  message: string
  data: { article_id: string, topic_id: string } | null
}

export const createArticleTopic = (articleTopic: CreateArticleTopic): Promise<CreateArticleTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          article_id: articleTopic.article_id,
          topic_id: articleTopic.topic_id
        }])
        .select('article_id, topic_id')

      if (error) {
        reject({
          success: false,
          message: '创建文章标签关联失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '创建文章标签关联成功',
        data: data ? data[0] : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '创建文章标签关联失败: ' + err,
        data: null
      })
    }
  })
}

// 获取文章的所有标签
export const getTopicsByArticleId = (article_id: string): Promise<{
  success: boolean
  message: string
  data: { topic_id: string }[] | null
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('topic_id')
        .eq('article_id', article_id)

      if (error) {
        reject({
          success: false,
          message: '获取文章标签列表失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '获取文章标签列表成功',
        data: data
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取文章标签列表失败: ' + err,
        data: null
      })
    }
  })
}

// 获取标签的所有文章
export const getArticlesByTopicId = (topic_id: string): Promise<{
  success: boolean
  message: string
  data: { article_id: string }[] | null
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('article_id')
        .eq('topic_id', topic_id)

      if (error) {
        reject({
          success: false,
          message: '获取标签文章列表失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '获取标签文章列表成功',
        data: data
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取标签文章列表失败: ' + err,
        data: null
      })
    }
  })
}

type DeleteArticleTopicResult = {
  success: boolean
  message: string
  data: null
}

export const deleteArticleTopic = (article_id: string, topic_id: string): Promise<DeleteArticleTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('article_id', article_id)
        .eq('topic_id', topic_id)

      if (error) {
        reject({
          success: false,
          message: '删除文章标签关联失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '删除文章标签关联成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '删除文章标签关联失败: ' + err,
        data: null
      })
    }
  })
}

// 删除文章的所有标签关联
export const deleteAllTopicsByArticleId = (article_id: string): Promise<DeleteArticleTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('article_id', article_id)

      if (error) {
        reject({
          success: false,
          message: '删除文章所有标签关联失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '删除文章所有标签关联成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '删除文章所有标签关联失败: ' + err,
        data: null
      })
    }
  })
}

// 删除标签的所有文章关联
export const deleteAllArticlesByTopicId = (topic_id: string): Promise<DeleteArticleTopicResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('topic_id', topic_id)

      if (error) {
        reject({
          success: false,
          message: '删除标签所有文章关联失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '删除标签所有文章关联成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '删除标签所有文章关联失败: ' + err,
        data: null
      })
    }
  })
}

// // 创建文章-标签关联
// createArticleTopic({
//     article_id: 'dbfa6929-81b2-4647-840f-e621f113815f',
//     topic_id: '589922de-549f-45d9-8062-b378c0571c68'
//   })
//   .then(res => {
//     console.log('创建文章标签关联成功', res)
//   })
//   .catch(err => {
//     console.error('创建文章标签关联失败', err)
//   })
  
// // 获取文章的所有标签
// getTopicsByArticleId('dbfa6929-81b2-4647-840f-e621f113815f')
//   .then(res => {
//     console.log('获取文章标签列表成功', res)
//   })
//   .catch(err => {
//     console.error('获取文章标签列表失败', err)
//   })

// // 获取标签的所有文章
// getArticlesByTopicId('589922de-549f-45d9-8062-b378c0571c68')
//   .then(res => {
//     console.log('获取标签文章列表成功', res)
//   })
//   .catch(err => {
//     console.error('获取标签文章列表失败', err)
//   })

// // 删除特定的文章-标签关联
// deleteArticleTopic('dbfa6929-81b2-4647-840f-e621f113815f', 'd2b23258-7264-487c-965d-61e6078f0f06')

// // 删除文章的所有标签关联
// deleteAllTopicsByArticleId('36dd907a-2e60-4639-993b-7a18adae88ab')

// // 删除标签的所有文章关联
// deleteAllArticlesByTopicId('589922de-549f-45d9-8062-b378c0571c68')