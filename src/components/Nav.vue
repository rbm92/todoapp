<template>
  <header class="bg-green-300">
    <nav class="p-10 flex flex-col gap-5 items-center sm:flex-row">
      <a href="/" class="flex items-center gap-5 hover:font-bold">
        <img
          class="w-20 bg-green-300"
          src="../assets/todo-app.png"
          alt="logo"
        />
        <h1 class="text-lg">Todo App</h1>
      </a>
      <ul class="flex flex-1 justify-end gap-10">
        <router-link
          v-if="!user"
          class="cursor-pointer hover:font-bold"
          to="/auth"
          >Sign In</router-link
        >

        <li v-else @click="signOut" class="hover:font-bold cursor-pointer">
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
const user = computed(() => useUserStore().$state.user);

// Setup ref to router
const redirect = useRouter();

// Logout function
async function signOut() {
  await useUserStore().signOut();
  redirect.push({ path: "/auth" });
}
</script>

<style></style>
