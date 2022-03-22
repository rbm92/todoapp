<template>
  <section class="min-h-full box-border">
    <Nav />
    <router-view class="app-main" />
    <!-- your routes will load inside of these tags -->
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "./store/user.js";
import Nav from "./components/Nav.vue";
import { ref } from "vue";
import { supabase } from "./supabase";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Check if user is logged in
// const checkUser = useUserStore.fetchUser();

// If user does not exist, need to make app ready
// if (!checkUser) appReady.value = true;

onMounted(async () => {
  const appReady = ref(null);
  try {
    await userStore.fetchUser(); // here we call fetch user
    if (!user.value) {
      // redirect them to logout if the user is not there
      appReady.value = true;
      router.push({ path: "/auth" });
    } else {
      // continue to dashboard
      router.push({ path: "/" });
    }
  } catch (e) {
    console.log(e);
  }
});

// // If user is logged in, this will fire
// supabase.auth.onAuthStateChange((_, session) => {
//   userStore.setUser(session);
//   appReady.value = true;
// });
</script>
