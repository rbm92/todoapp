<template>
  <section class="pt-10 pb-20">
    <div
      class="w-3/4 mx-auto my-10 flex flex-col sm:flex-row items-center justify-center gap-y-5"
    >
      <!-- Profile wrapper -->
      <p class="font-mono text-3xl font-bold text-green-500">
        {{ profiles.username }}
      </p>

      <div
        class="w-full sm:w-1/2 items-center flex flex-col justify-around gap-y-5"
      >
        <label
          for="avatar"
          class="italic block border-black rounded text-center p-2 mx-auto w-3/4 cursor-pointer sm:w-60 dark:border-white dark:text-white"
        >
          <img
            :src="profiles.avatar_url"
            class="w-48 h-48 mx-auto mb-3 rounded-full border-2 border-green-400 shadow-lg object-cover"
            alt="avatar"
          />
          <input
            type="file"
            class="hidden mx-auto"
            @change="handleFileChange"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
          />Update your profile pic</label
        >
        <button
          @click="uploadAvatar"
          class="font-mono block w-full sm:w-60 mx-auto btn-template bg-sky-500 hover:bg-sky-600"
        >
          Upload
        </button>
        <p class="text-red-500 font-mono font-bold">{{ errorFile }}</p>
      </div>
    </div>

    <!-- Upload a file Wrapper -->

    <!-- // Back to Dashboard button -->
    <router-link to="/">
      <button
        class="font-mono block w-5/6 sm:w-60 mx-auto my-20 p-3 rounded text-white font-bold bg-green-500 hover:bg-green-600"
      >
        Back to Dashboard
      </button>
    </router-link>

    <!-- Confirmation message -->
    <p
      v-if="okMsg"
      class="mx-auto w-3/4 mt-2 mb-10 p-5 rounded-md text-center bg-gray-100 dark:bg-gray-300 font-bold font-mono text-green-600 italic"
    >
      {{ okMsg }}
    </p>

    <!-- Info to Update Wrapper -->
    <form
      @submit.prevent="updateProfile"
      class="mx-auto w-11/12 sm:w-3/4 p-10 flex flex-col gap-y-5 bg-gray-200 rounded-md shadow-lg dark:bg-gray-500"
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
            class="w-4/5 p-2 pl-12 text-gray-500 rounded bg-icon bg-avatar focus:outline-none disabled:bg-slate-300"
            id="username"
            v-model="profiles.username"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-slate-300 hover:bg-slate-400"
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
          class="p-2 pl-12 text-gray-500 rounded bg-icon bg-email focus:outline-none disabled:bg-slate-300"
          id="email"
          v-model="email"
        />
      </div>
      <div class="flex flex-col mb-2">
        <a target="_blank" class="mb-1 w-4/5" :href="'//' + profiles.website">
          <label for="website" class="text-lg text-green-500 cursor-pointer"
            >Website</label
          >
        </a>
        <!-- Input wrapper -->
        <div class="flex items-center">
          <input
            type="text"
            :disabled="disabledWebsite"
            required
            placeholder="add your website"
            class="w-4/5 p-2 pl-12 text-gray-500 rounded bg-icon bg-website focus:outline-none disabled:bg-slate-300"
            id="website"
            v-model="profiles.website"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-slate-300 hover:bg-slate-400"
            @click.prevent="toggleWebsite"
          ></button>
        </div>
      </div>

      <!-- Save Changes Button -->
      <button
        @submit="updateProfile"
        class="block w-full sm:inline sm:w-48 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-500 border-solid border-2 border-transparent hover:border-green-500 hover:bg-white hover:text-green-500"
      >
        Save Changes
      </button>

      <!-- Error Handling -->
      <p
        v-if="errorMsg"
        class="mt-2 p-5 rounded-md text-center bg-gray-100 dark:bg-gray-400 font-bold font-mono text-red-600 italic"
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

const profiles = ref([]);

// Getting tasks from supabase
async function getProfile() {
  const arrayProfile = await useProfileStore().fetchProfile();
  profiles.value = arrayProfile[0];
}

getProfile();

const user = useUserStore().user;

const selectedFile = ref(null);

// Getting data from user
const email = ref(null);
email.value = user.email;

// Disabled Inputs
const disabledUsername = ref(true);
const disabledWebsite = ref(true);
const disabledAvatar = ref(true);

const newPassword = ref(null);
const confirmNewPassword = ref(null);

// Messages
const okMsg = ref(null);
const errorMsg = ref(null);
const errorFile = ref(null);

// Avatar variables
let avatarImg = ref(null);
let path = ref(null);

const redirect = useRouter();

function toggleUsername() {
  disabledUsername.value = !disabledUsername.value;
}

function toggleWebsite() {
  disabledWebsite.value = !disabledWebsite.value;
}

function toggleAvatar() {
  disabledAvatar.value = !disabledAvatar.value;
}

function handleFileChange(event) {
  selectedFile.value = event.target.files[0];
  // console.log(selectedFile.value.name);
}

async function uploadAvatar() {
  if (!selectedFile.value) {
    errorFile.value = "File was not selected";
    setTimeout(() => {
      errorFile.value = null;
    }, 3000);
    return;
  }

  const uuid = self.crypto.randomUUID().split("-")[0];
  path.value = uuid;
  console.log(path.value);
  await useProfileStore().uploadFile(uuid, selectedFile.value);
  getProfileImg();
}

async function getProfileImg() {
  const imgUrl = await useProfileStore().getFile(path.value);
  profiles.value.avatar_url = imgUrl;
}

async function updateProfile() {
  await useProfileStore().updateProfile(
    profiles.value.username,
    profiles.value.website,
    profiles.value.avatar_url
  );

  okMsg.value = "Profile updated succesfully";
  setTimeout(() => {
    okMsg.value = null;
  }, 5000);

  if (
    newPassword !== null &&
    confirmNewPassword !== null &&
    newPassword.value === confirmNewPassword.value
  ) {
    try {
      newPassword.value = useUserStore().user.password;
      // console.log(newPassword.value);
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
