<template>
  <header
    class="static md:sticky md:top-0 w-full flex justify-around bg-green-300"
  >
    <nav class="p-5 flex flex-col gap-x-48 gap-y-10 items-center sm:flex-row">
      <a href="/" class="flex flex-col sm:flex-row items-center gap-x-10 gap-y-5">
        <img class="w-16" src="../assets/logo.svg" alt="logo" />
        <h1 class="text-2xl font-mono">2DoVu</h1>
      </a>
      <ul class="flex flex-col sm:flex-row justify-end gap-x-10 gap-y-5">
        <router-link
          v-if="!user"
          class="font-mono text-lg cursor-pointer hover:font-bold hover:underline hover:underline-offset-8"
          to="/auth"
          >Sign In</router-link
        >
        <router-link
          v-if="user"
          class="font-mono text-lg cursor-pointer hover:font-bold hover:underline hover:underline-offset-8"
          to="/profile"
          >Profile
        </router-link>

        <li
          v-if="user"
          @click="signOut"
          class="text-lg font-mono hover:font-bold hover:underline hover:underline-offset-8 cursor-pointer"
        >
          Sign Out
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { computed } from "vue";

// Get user from store
const user = computed(() => useUserStore().user);

// Setup ref to router
const redirect = useRouter();

// Logout function
async function signOut() {
  await useUserStore().signOut();
  redirect.push({ path: "/auth" });
}
</script>

<style></style>
