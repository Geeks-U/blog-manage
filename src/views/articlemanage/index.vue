<script setup lang="ts">

</script>

<template>
  <div>
    <div>
      <router-link to="/articlemanage/home">首页</router-link>
      <router-link to="/articlemanage/articlelist">文章列表</router-link>
      <router-link to="/articlemanage/topics">标签管理</router-link>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
