<template>
  <section>
    <div
      class="flex flex-col sm:flex-row items-center justify-center m-10 gap-x-28 gap-y-5 my-20"
    >
      <h1 class="text-4xl font-bold">Profile</h1>
      <span class="font-mono text-3xl font-bold text-green-500"
        >@{{ userName }}</span
      >
    </div>

    <router-link to="/">
      <button
        class="font-mono block w-full sm:w-60 mx-auto btn-template bg-green-500 hover:bg-green-600"
      >
        Back to Dashboard
      </button>
    </router-link>

    <form
      @submit.prevent="updateProfile"
      class="max-w-screen-sm mx-auto w-3/4 p-10 flex flex-col gap-y-5 bg-gray-200 rounded-md shadow-lg my-20"
    >
      <div class="flex flex-col mb-2">
        <label for="username" class="mb-1 text-lg text-green-500"
          >Username</label
        >
        <!-- Input wrapper -->
        <div class="flex items-center">
          <input
            type="text"
            required
            :disabled="disabledUsername"
            placeholder="add a username"
            class="w-4/5 p-2 pl-12 text-gray-500 rounded bg-icon bg-avatar focus:outline-none disabled:bg-slate-100"
            id="username"
            v-model="profiles.username"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-white"
            @click.prevent="toggleUsername"
          ></button>
        </div>
      </div>
      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-lg text-green-500">Email</label>
        <input
          type="text"
          placeholder="random@names.com"
          disabled
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-email focus:outline-none disabled:bg-slate-100"
          id="email"
          v-model="email"
        />
      </div>
      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-lg text-green-500">Website</label>
        <!-- Input wrapper -->
        <div class="flex items-center">
          <input
            type="text"
            :disabled="disabledWebsite"
            required
            placeholder="add your website"
            class="w-4/5 p-2 pl-12 text-gray-500 rounded bg-icon bg-website focus:outline-none disabled:bg-slate-100"
            id="website"
            v-model="profiles.website"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-white"
            @click.prevent="toggleWebsite"
          ></button>
        </div>
      </div>
      <div class="flex flex-col mb-2">
        <label for="newPassword" class="mb-1 text-lg text-green-500"
          >New Password</label
        >
        <input
          type="password"
          placeholder="change your password here"
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-newpwd focus:outline-none"
          id="newPassword"
          v-model="newPassword"
        />
      </div>
      <div class="flex flex-col mb-2">
        <label for="confirmNewPassword" class="mb-1 text-lg text-green-500"
          >Confirm New Password</label
        >
        <input
          type="password"
          placeholder="confirm your new password"
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-check focus:outline-none"
          id="confirmNewPassword"
          v-model="confirmNewPassword"
        />
      </div>
      <button
        @submit="updateProfile"
        class="block w-full sm:inline sm:w-48 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-400 border-solid border-2 border-transparent hover:border-green-400 hover:bg-white hover:text-green-400"
      >
        Update Profile
      </button>
      <!-- Error Handling -->
      <p
        v-if="errorMsg"
        class="mt-2 p-5 rounded-md text-center bg-gray-100 font-bold font-mono text-red-600 italic"
      >
        {{ errorMsg }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { useProfileStore } from "../store/profile";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";

// Initializing array of profile
// let profiles = ref([
//   {
//     username: "username9999",
//     website: "website",
//   },
// ]);
const profiles = ref([]);

// Getting tasks from supabase
async function getProfile() {
  const res = await useProfileStore().fetchProfile();
  profiles.value = res[0];
}

getProfile();

// Getting data from user
const email = ref(null);
email.value = useUserStore().user.email;
const userName = email.value.split("@")[0];

// Disabled Inputs
const disabledUsername = ref(true);
const disabledWebsite = ref(true);

const newPassword = ref(null);
const confirmNewPassword = ref(null);
const errorMsg = ref(null);

const redirect = useRouter();

function toggleUsername() {
  disabledUsername.value = !disabledUsername.value;
}

function toggleWebsite() {
  disabledWebsite.value = !disabledWebsite.value;
}

async function updateProfile() {
  await useProfileStore().updateProfile(profiles.value.username, profiles.value.website);

  // redirect.push({ path: "/" });

  if (
    newPassword &&
    confirmNewPassword &&
    newPassword.value === confirmNewPassword.value
  ) {
    try {
      newPassword.value = useUserStore().user.password;
    } catch (error) {
      errorMsg.value = error.message;
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    }
    return;
  }
  errorMsg.value = "Passwords do not match";
  setTimeout(() => {
    errorMsg.value = null;
  }, 5000);
}
</script>

<style></style>
