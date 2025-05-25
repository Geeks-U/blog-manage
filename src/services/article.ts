import { supabase } from "@/utils/request.ts"

const tableName = 'articles'

interface CreateArticle {
  title: string
  content: string
  excerpt: string
  published: boolean
}

type CreateArticleResult = {
  success: boolean
  message: string
  data: { id: string } | null
}

export const createArticle = (article: CreateArticle): Promise<CreateArticleResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from(tableName)
        .insert([
          {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            published: article.published,
            created_at: now,
            updated_at: now,
          }
        ])
        .select('id')

      if (error) {
        reject({
          success: false,
          message: '创建文章失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '创建文章成功',
        data: data ? { id: data[0].id } : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '创建文章失败: ' + err,
        data: null
      })
    }
  })
}

// const article = {
//   title: '测试标题3',
//   content: '测试内容=======================',
//   excerpt: '测试摘要',
//   published: true,
// }
// createArticle(article)
//   .then((res) => {
//     console.log('创建文章结果:', res)
//     })
//   .catch((err) => {
//     console.error('创建文章错误:', err)
//   })

interface GetArticle {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
}

type getArticleResult = {
  success: boolean
  message: string
  data: GetArticle | null
}

export const getArticleByArticleId = (article_id: string): Promise<getArticleResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', article_id)

      if (error) {
        reject({
        success: false,
        message: '获取文章失败: ' + error.message,
        data: data
      })
        return
      }

      resolve({
        success: true,
        message: '获取文章成功',
        data: data ? data[0] : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取文章失败: ' + err,
        data: null
      })
    }
  })
}

// getArticleByArticleId('bc7798a3-6878-4934-8290-eafae49bf90e')
//   .then((res) => {
//     console.log('获取文章结果:', res)
//   })
//   .catch((err) => {
//     console.error('获取文章错误:', err)
//   })

type getArticleListResult = {
  success: boolean
  message: string
  data: GetArticle[] | null
}

export const getAllArticles = (): Promise<getArticleListResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')

      if (error) {
        reject({
        success: false,
        message: '获取文章列表失败: ' + error.message,
        data: data
      })
        return
      }

      resolve({
        success: true,
        message: '获取文章列表成功',
        data: data ? data : null
      })
    } catch (err) {
      reject({
        success: false,
        message: '获取文章列表失败: ' + err,
        data: null
      })
    }
  })
}

interface UpdateArticle {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
}

type updateArticleResult = {
  success: boolean
  message: string
  data: null
}

export const updateArticleByArticleId = (article: UpdateArticle): Promise<updateArticleResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from(tableName)
        .update({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          published: article.published,
          updated_at: now
        })
        .eq('id', article.id)

      if (error) {
        reject({
          success: false,
          message: '更新文章失败: ' + error.message,
          data: data
        })
        return
      }

      resolve({
        success: true,
        message: '更新文章成功',
        data: data
      })
    } catch (err) {
      reject({
        success: false,
        message: '更新文章异常: ' + err,
        data: null
      })
    }
  })
}

// updateArticleByArticleId({
//   id: 'bc7798a3-6878-4934-8290-eafae49bf90e',
//   title: '测试标题',
//   content: '测试内容',
//   excerpt: '测试摘要',
//   published: false
// })
//   .then((res) => {
//     console.log('更新文章结果:', res)
//   })
//   .catch((err) => {
//     console.error('更新文章错误:', err)
//   })

type deleteArticleResult = {
  success: boolean
  message: string
  data: null
}

export const deleteArticleByArticleId = (article_id: string): Promise<deleteArticleResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', article_id)

      if (error) {
        reject({
          success: false,
          message: '删除文章失败: ' + error.message,
          data: null
        })
        return
      }

      resolve({
        success: true,
        message: '删除文章成功',
        data: null
      })
    } catch (err) {
      reject({
        success: false,
        message: '删除文章失败: ' + err,
        data: null
      })
    }
  })
}

// deleteArticleByArticleId('bc7798a3-6878-4934-8290-eafae49bf90e')
//   .then((res) => {
//     console.log('删除文章结果:', res)
//   })
//   .catch((err) => {
//     console.error('删除文章错误:', err)
//   })