<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const supabaseUrl = ref('')
const supabaseKey = ref('')

const saveConfig = () => {
  if (!supabaseUrl.value || !supabaseKey.value) {
    alert('请输入完整配置信息')
    return
  }

  sessionStorage.setItem('SUPABASE_URL', supabaseUrl.value)
  sessionStorage.setItem('SUPABASE_ANON_KEY', supabaseKey.value)
  router.push('/home')
}
</script>

<template>
  <div class="config-page">
    <h2>请输入 Supabase 配置信息</h2>
    <div>
      <label>SUPABASE_URL:</label>
      <input v-model="supabaseUrl" type="text" />
    </div>
    <div>
      <label>SUPABASE_ANON_KEY:</label>
      <input v-model="supabaseKey" type="text" />
    </div>
    <button @click="saveConfig">保存并跳转</button>
  </div>
</template>

<style scoped>
.config-page {
  padding: 20px;
}
input {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  max-width: 500px;
}
button {
  padding: 8px 16px;
}
</style>
