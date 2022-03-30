<template>
  <footer
    class="flex flex-col sm:flex-row gap-y-5 gap-x-16 items-center justify-center py-5 bg-green-300 dark:bg-green-500"
  >
    <p class="font-mono">&copy; All rights reserved {{ currentYear }}</p>
    <!-- Social media wrapper -->
    <div class="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-x-8 gap-y-4">
    <a target="_blank" href="https://www.facebook.com">
      <img class="social-media-logo" src="../assets/fb.svg" alt="facebook" />
    </a>

    <a target="_blank" href="https://www.twitter.com">
      <img class="social-media-logo" src="../assets/twit.svg" alt="twitter" />
    </a>

    <a target="_blank" href="https://www.instagram.com"
      ><img class="social-media-logo" src="../assets/ig.svg" alt="instagram" />
    </a>

    <a target="_blank" href="https://www.linkedin.com"
      ><img class="social-media-logo" src="../assets/link.svg" alt="linkedin" />
    </a>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style></style>
