<template>
  <router-link class="text-green-400 hover:font-bold" :to="route">{{ redirectBtn }}</router-link>
</template>

<script setup>
defineProps({
  route: String,
  redirectBtn: String,
});
</script>

<style></style>
