<template>
  <router-link class="p-3 px-5 mb-1 rounded font-bold text-green-500 hover:bg-green-500 hover:text-white" :to="route">{{ redirectBtn }}</router-link>
</template>

<script setup>
defineProps({
  route: String,
  redirectBtn: String,
});
</script>

<style></style>
