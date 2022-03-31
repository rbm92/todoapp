<template>
  <section class="w-full sm:w-2/3 mx-auto">
    <!-- Form wrapper -->
    <form
      @submit.prevent="signIn"
      class="mx-auto my-10 p-10 flex flex-col bg-gray-200 rounded-md shadow-lg gap-y-5 dark:bg-gray-500"
    >
      <h1 class="text-3xl mb-5 dark">Sign In</h1>

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

      <button
        type="submit"
        class="block w-full sm:inline sm:w-36 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-500 border-solid border-2 border-transparent hover:border-green-500 hover:bg-white hover:text-green-500"
      >
        Sign In
      </button>

      <p
        v-if="okMsg"
        class="p-5 rounded-md text-center bg-gray-100 dark:bg-gray-300 font-bold font-mono text-green-400"
      >
        {{ okMsg }}
      </p>

      <!-- Error Handling -->
      <div v-if="errorMsg">
        <p
          class="p-5 rounded-md text-center bg-gray-100 dark:bg-gray-300 font-bold font-mono text-red-600 italic"
        >
          {{ errorMsg }}
        </p>
        <div class="pt-5 flex gap-5 items-center justify-center">
          <p class="text-center font-mono">Forgot your password?</p>
          <button
            @click="resetPassword"
            class="p-3 font-mono font-bold text-green-500 rounded hover:bg-green-400 hover:text-white"
          >
            Reset it
          </button>
        </div>
      </div>

      <p class="font-mono text-center">
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
const okMsg = ref(null);

async function signIn() {
  try {
    await useUserStore().signIn(email.value, password.value);
    // if (error) throw error;
    redirect.push({ path: "/" });
  } catch (error) {
    errorMsg.value = "Invalid login credentials";
    setTimeout(() => {
      errorMsg.value = null;
    }, 5000);
  }
}

async function resetPassword() {
  await useUserStore().resetPassword(email.value);
  errorMsg.value = null;
  okMsg.value = "A confirmation message has been sent to your email";
  setTimeout(() => {
    okMsg.value = null;
  }, 3000);
}
</script>

<style></style>
