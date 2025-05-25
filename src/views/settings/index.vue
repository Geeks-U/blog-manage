<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const supabaseUrl = ref('')
const supabaseKey = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const validateUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const saveConfig = async () => {
  errorMessage.value = ''
  
  if (!supabaseUrl.value || !supabaseKey.value) {
    errorMessage.value = '请输入完整配置信息'
    return
  }

  if (!validateUrl(supabaseUrl.value)) {
    errorMessage.value = '请输入有效的 Supabase URL'
    return
  }

  try {
    isLoading.value = true
    sessionStorage.setItem('SUPABASE_URL', supabaseUrl.value)
    sessionStorage.setItem('SUPABASE_ANON_KEY', supabaseKey.value)
    await router.push('/')
  } catch (error) {
    errorMessage.value = '保存配置失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="config-page">
    <div class="config-container">
      <h2>Supabase 配置</h2>
      <p class="description">请输入您的 Supabase 项目配置信息以继续</p>
      
      <div class="form-group">
        <label>SUPABASE_URL</label>
        <input 
          v-model="supabaseUrl" 
          type="text" 
          placeholder="https://your-project.supabase.co"
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label>SUPABASE_ANON_KEY</label>
        <input 
          v-model="supabaseKey" 
          type="password" 
          placeholder="输入您的 anon key"
          :disabled="isLoading"
        />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button 
        @click="saveConfig" 
        :disabled="isLoading"
        class="save-button"
      >
        <span v-if="isLoading">保存中...</span>
        <span v-else>保存并继续</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.config-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.config-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.5rem;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.save-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #357abd;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
