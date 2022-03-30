<template>
  <section class="w-full sm:w-2/3 mx-auto">
    <!-- Form wrapper -->
    <form
      @submit.prevent="signUp"
      class="p-10 flex flex-col bg-gray-200 rounded-md shadow-lg gap-y-5 dark:bg-gray-500"
    >
      <h1 class="text-3xl mb-5">Sign Up</h1>

      <!-- Email -->
      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-lg">Email</label>
        <input
          type="text"
          placeholder="random@names.com"
          required
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-email focus:outline-none dark:bg-gray-200"
          id="email"
          v-model="email"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-lg">Password</label>
        <input
          type="password"
          required
          placeholder="avoid1234please"
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-pwd focus:outline-none dark:bg-gray-200"
          id="password"
          v-model="password"
        />
      </div>

      <!-- Confirm password -->
      <div class="flex flex-col mb-2">
        <label for="confirmedPassword" class="mb-1 text-lg"
          >Confirm Password</label
        >
        <input
          type="password"
          required
          placeholder="proveyouarehuman"
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-check focus:outline-none dark:bg-gray-200"
          id="confirmPassword"
          v-model="confirmPassword"
        />
      </div>
      <button
        type="submit"
        class="block w-full sm:inline sm:w-36 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-500 border-solid border-2 border-transparent hover:border-green-400 hover:bg-white hover:text-green-500"
      >
        Sign Up
      </button>
      <!-- Confirmation Message -->
      <p
        v-if="okMsg"
        class="p-5 mt-5 rounded-md text-center bg-white font-bold font-mono text-green-500 italic"
      >
        {{ okMsg }}
      </p>
      <!-- Error Handling -->
      <p
        v-if="errorMsg"
        class="p-5 mt-10 rounded-md text-center bg-gray-100 font-bold font-mono text-red-600 italic"
      >
        {{ errorMsg }}
      </p>
      <p class="font-mono mt-10 text-center">
        Already have an account?
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

const route = "/auth";
const redirectBtn = "Sign In";

// const registered = ref(false);

// Auth variables
const redirect = useRouter();
const email = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
const error = ref(null);
const errorMsg = ref(null);
const okMsg = ref(null);

async function signUp() {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match";
    setTimeout(() => {
      errorMsg.value = null;
    }, 3000);
    return;
  }

  try {
    await useUserStore().signUp(email.value, password.value);
    // if (error) throw error;
    okMsg.value = "A confirmation message has been sent to your email";
    setTimeout(() => {
      okMsg.value = null;
    }, 3000);
    redirect.push({ path: "/auth" });
  } catch (error) {
    // errorMsg.value = error.message;
    errorMsg.value = "Invalid credentials";
    setTimeout(() => {
      errorMsg.value = null;
    }, 3000);
  }
}
</script>

<style></style>
