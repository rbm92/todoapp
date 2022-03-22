<template>
  <section>
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-5 rounded-md bg-gray-200 shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>
    <!-- Sign In -->
    <form
      @submit.prevent="signIn"
      class="p-10 flex flex-col bg-gray-100 rounded-md shadow-lg"
    >
      <h1 class="text-3xl mb-5">Sign In</h1>
      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-green-500">Email</label>
        <input
          type="text"
          required
          class="p-2 text-gray-500 focus:outline-none"
          id="email"
          v-model="email"
        />
      </div>
      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-sm text-green-500"
          >Password</label
        >
        <input
          type="password"
          required
          class="p-2 text-gray-500 focus:outline-none"
          id="password"
          v-model="password"
        />
      </div>

      <button
        type="submit"
        class="mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-400 border-solid border-2 border-transparent hover:border-green-400 hover:bg-white hover:text-green-400"
      >
        Sign In
      </button>
      <p class="mt-10 text-center">
        Don't have an account?
        <!-- <button @click="showSignUp" class="text-green-400">Sign Up</button> -->
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

// SignIn function
// async function signIn() {
//   try {
//     const { error } = await supabase.auth.signIn({
//       email: email.value,
//       password: password.value,
//     });
//     if (error) throw error;
//     redirect.push({ path: "/" });
//   } catch (error) {
//     errorMsg.value = `Error: ${error.message}`;
//     setTimeout(() => {
//       errorMsg.value = null;
//     }, 5000);
//   }
// }

async function signIn() {
  try {
    await useUserStore().signIn(email.value, password.value);
    // if (error) throw error;
    redirect.push({ path: "/" });
  } catch (error) {
    errorMsg.value = `Error: ${error.message}`;
    setTimeout(() => {
      errorMsg.value = null;
    }, 5000);
  }
}
</script>

<style></style>
