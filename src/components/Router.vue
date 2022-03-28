<template>
  <router-link class="py-3 px-5 rounded font-bold text-green-500 hover:bg-green-400 hover:text-white" :to="route">{{ redirectBtn }}</router-link>
</template>

<script setup>
defineProps({
  route: String,
  redirectBtn: String,
});
</script>

<style></style>
