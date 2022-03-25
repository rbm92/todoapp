<template>
  <footer
    class="flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-5 py-5 bg-green-300"
  >
    <p class="font-mono">&copy; All rights reserved {{ currentYear }}</p>
    <a class="social-media-a" href="https://www.facebook.com">
      <img class="social-media-logo" src="../assets/fb.svg" alt="facebook" />
    </a>

    <a class="social-media-a" href="https://www.twitter.com">
      <img class="social-media-logo" src="../assets/twit.svg" alt="twitter" />
    </a>

    <a class="social-media-a" href="https://www.instagram.com"
      ><img class="social-media-logo" src="../assets/ig.svg" alt="instagram" />
    </a>

    <a class="social-media-a" href="https://www.linkedin.com"
      ><img class="social-media-logo" src="../assets/link.svg" alt="linkedin" />
    </a>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style></style>
