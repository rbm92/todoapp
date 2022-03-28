<template>
  <section class="max-w-screen-sm mx-auto">
    <!-- Sign In -->
    <form
      @submit.prevent="signIn"
      class="mx-auto my-10 p-10 flex flex-col bg-gray-200 rounded-md shadow-lg"
    >
      <h1 class="text-3xl mb-5">Sign In</h1>
      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-lg text-green-500">Email</label>
        <input
          type="text"
          placeholder="random@names.com"
          required
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-email focus:outline-none"
          id="email"
          v-model="email"
        />
      </div>
      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-lg text-green-500"
          >Password</label
        >
        <input
          type="password"
          required
          placeholder="avoid1234please"
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-pwd focus:outline-none"
          id="password"
          v-model="password"
        />
      </div>

      <button
        type="submit"
        class="block w-full sm:inline sm:w-36 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-400 border-solid border-2 border-transparent hover:border-green-400 hover:bg-white hover:text-green-400"
      >
        Sign In
      </button>

      <!-- Error Handling -->
    <p v-if="errorMsg" class="mt-10 rounded-md text-center bg-gray-100 font-bold font-mono text-red-600 italic">{{ errorMsg }}</p>

      <p class="font-mono mt-10 text-center">
        Don't have an account?
        <Router :route="route" :redirectBtn="redirectBtn" />
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";
import router from "../router";
import Router from "./Router.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";

const route = "/auth/sign-up";
const redirectBtn = "Sign Up";

// const registered = ref(false);

// Auth variables
const redirect = useRouter();
const email = ref(null);
const password = ref(null);
const errorMsg = ref(null);

async function signIn() {
  try {
    await useUserStore().signIn(email.value, password.value);
    // if (error) throw error;
    redirect.push({ path: "/" });
  } catch (error) {
    errorMsg.value = 'Invalid login credentials';
    setTimeout(() => {
      errorMsg.value = null;
    }, 5000);
  }
}
</script>

<style>
</style>
