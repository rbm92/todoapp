<template>
  <section>
    <div
      class="w-3/4 mx-auto my-10 flex flex-col sm:flex-row items-center justify-around gap-y-5"
    >
      <!-- Profile wrapper -->
      <img
        :src="profiles.avatar_url"
        class="w-48 h-48 rounded-full border-2 border-green-400 shadow-lg object-cover"
        alt="avatar"
      />

      <p class="font-mono text-3xl font-bold text-green-500">
        {{ profiles.username }}
      </p>
    </div>

    <div
      class="mx-auto w-3/4 items-center flex flex-col sm:flex-row justify-around gap-y-5"
    >
      <input
        type="file"
        class="mx-auto w-full sm:w-80"
        @change="handleFileChange"
        id="upload-avatar"
        name="avatar"
        accept="image/png, image/jpeg"
      />
      <button
        @click="uploadFile"
        class="font-mono block w-full sm:w-60 mx-auto my-10 btn-template bg-sky-400 hover:bg-sky-500"
      >
        Upload
      </button>
    </div>

    <router-link to="/">
      <button
        class="font-mono block w-full sm:w-60 mx-auto my-10 btn-template bg-green-400 hover:bg-green-500"
      >
        Back to Dashboard
      </button>
    </router-link>

    <!-- Confirmation message -->
    <p
      v-if="okMsg"
      class="mx-auto w-3/4 mt-2 p-5 rounded-md text-center bg-gray-100 font-bold font-mono text-green-500 italic"
    >
      {{ okMsg }}
    </p>

    <form
      @submit.prevent="updateProfile"
      class="max-w-screen-sm mx-auto w-3/4 p-10 flex flex-col gap-y-5 bg-gray-200 rounded-md shadow-lg my-10"
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
            class="w-full p-2 pl-12 text-gray-500 rounded bg-icon bg-website focus:outline-none disabled:bg-slate-100"
            id="website"
            v-model="profiles.website"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-white"
            @click.prevent="toggleWebsite"
          ></button>
        </div>
      </div>
      <!-- <div class="flex flex-col mb-2">
        <label for="avatar" class="mb-1 text-lg text-green-500">Avatar</label>
        Input wrapper
        <div class="flex items-center">
          <input
            type="text"
            :disabled="disabledAvatar"
            required
            placeholder="add your website"
            class="w-4/5 p-2 pl-12 text-gray-500 rounded bg-icon bg-ghost focus:outline-none disabled:bg-slate-100"
            id="avatar"
            v-model="profiles.avatar_url"
          />
          <button
            class="w-1/5 bg-btn bg-edit btn-template bg-white"
            @click.prevent="toggleAvatar"
          ></button>
        </div>
      </div> -->

      <button
        @submit="updateProfile"
        class="block w-full sm:inline sm:w-48 font-mono mt-5 py-2 px-6 rounded self-start text-white font-bold bg-green-400 border-solid border-2 border-transparent hover:border-green-400 hover:bg-white hover:text-green-400"
      >
        Save Changes
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

const profiles = ref([]);

// Getting tasks from supabase
async function getProfile() {
  const arrayProfile = await useProfileStore().fetchProfile();
  profiles.value = arrayProfile[0];
}

getProfile();

const user = useUserStore().user;
// console.log(user);

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
  console.log(selectedFile.value.name);
}

async function uploadFile() {
  const uuid = self.crypto.randomUUID().split("-")[0];
  path.value = uuid;
  await useProfileStore().uploadFile(uuid, selectedFile.value);

  getProfileImg();
}

async function getProfileImg() {
  const imgUrl = await useProfileStore().getFile(path.value);
  profiles.value.avatar_url = imgUrl;
}

// async function updateFile() {
//   // getProfileImg();
//   const fullPath = profiles.value.avatar_url;
//   console.log(fullPath);
//   const currentFile = fullPath.split('avatars/')[1];
//   console.log(currentFile);
//   await useProfileStore().updateFile(currentFile, selectedFile.value);
// }

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
