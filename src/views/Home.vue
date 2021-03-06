<template>
  <!-- Dashboard -->
  <div class="pb-20">
    <div
      class="w-3/4 mx-auto flex flex-col sm:flex-row items-center justify-around my-20 gap-y-5"
    >
      <h1 class="text-4xl font-bold dark:text-slate-300">Welcome back!</h1>
      <p class="font-mono text-3xl font-bold text-green-500">
        {{ profiles.username }}
      </p>
    </div>

    <router-link to="/profile">
      <button
        class="font-mono block w-5/6 sm:w-60 mx-auto my-20 p-3 rounded text-white font-bold bg-green-500 hover:bg-green-600"
      >
        Update Profile
      </button>
    </router-link>
    <!-- Adding a new task -->
    <NewTask @childAddTodo="addTodo" />

    <!-- Buttons controlling all tasks -->
    <div
      class="w-11/12 sm:w-3/4 flex flex-col items-center sm:items-start sm:flex-row gap-10 rounded-md bg-gray-100 shadow-lg p-10 mx-auto justify-center dark:bg-gray-400 mb-20"
    >
      <!-- Select All -->
      <div class="flex flex-col gap-1 w-full">
        <button
          class="w-full sm:w-36 pl-10 bg-btn bg-all btn-template bg-slate-500 hover:bg-slate-600 mx-auto"
          @click="toggleDropdownSelect"
        >
          SELECT
        </button>
        <button
          v-if="dropdownSelect"
          class="w-full sm:w-36 pl-10 bg-btn bg-all btn-template bg-green-600 hover:bg-green-700 mx-auto"
          @click="markAllDone"
        >
          Done
        </button>
        <button
          v-if="dropdownSelect"
          class="w-full sm:w-36 pl-10 bg-btn bg-all btn-template bg-indigo-400 hover:bg-indigo-500 mx-auto"
          @click="markAllUndone"
        >
          Undone
        </button>
        <button
          v-if="dropdownSelect"
          class="w-full sm:w-36 pl-10 bg-btn bg-all btn-template bg-red-600 hover:bg-red-700 mx-auto"
          @click="confirmRemoveAll"
        >
          Remove
        </button>
      </div>
      <!-- Filters -->
      <div class="w-full flex flex-col gap-1 w-full">
        <button
          class="w-full sm:w-36 pl-10 bg-btn bg-filter btn-template bg-gray-500 hover:bg-gray-600 mx-auto"
          @click="toggleDropdownFilter"
        >
          SELECT
        </button>
        <button
          v-if="dropdownFilter"
          class="w-full sm:w-36 pl-10 bg-btn bg-filter btn-template bg-lime-600 hover:bg-lime-700 mx-auto"
          @click="showDone"
        >
          Done
        </button>
        <button
          v-if="dropdownFilter"
          class="w-full sm:w-36 pl-10 bg-btn bg-filter btn-template bg-sky-600 hover:bg-sky-700 mx-auto"
          @click="showUndone"
        >
          Undone
        </button>
        <button
          v-if="dropdownFilter"
          class="w-full sm:w-36 pl-10 bg-btn bg-filter btn-template bg-pink-600 hover:bg-pink-700 mx-auto"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
      <!-- Sorts -->
      <div class="w-full flex flex-col gap-1 w-full">
        <button
          class="w-full sm:w-36 pl-10 bg-btn bg-sort btn-template bg-zinc-500 hover:bg-zinc-600 mx-auto"
          @click="toggleDropdownSort"
        >
          SELECT
        </button>
        <button
          v-if="dropdownSort"
          class="w-full sm:w-36 pl-10 bg-btn bg-sort btn-template bg-emerald-600 hover:bg-emerald-700 mx-auto"
          @click="sortTitle"
        >
          Title
        </button>
        <button
          v-if="dropdownSort"
          class="w-full sm:w-36 pl-10 bg-btn bg-sort btn-template bg-cyan-600 hover:bg-cyan-700 mx-auto"
          @click="sortDate"
        >
          Date
        </button>
        <button
          v-if="dropdownSort"
          class="w-full sm:w-36 pl-10 bg-btn bg-sort btn-template bg-rose-600 hover:bg-rose-700 mx-auto"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
      <form
        action=""
        v-if="removeAllDialog"
        class="flex flex-col sm:flex-row items-center justify-center gap-5 rounded py-5 rounded-md bg-gray-100"
      ></form>
    </div>
    <!-- Remove All dialog -->
    <div
      v-if="removeAllDialog"
      class="flex flex-col sm:flex-row w-3/4 mx-auto rounded-md bg-gray-100 dark:bg-gray-300 shadow-lg px-12 py-5 gap-5 items-center mb-10"
    >
      <!-- Alert message wrapper -->
      <div class="w-full flex items-center justify-center gap-x-5">
        <input class="bg-gray-100 dark:bg-gray-300 bg-icon bg-danger w-10" type="text" />
        <p class="font-mono text-red-600 italic font-bold w-2/3">
          You're about to remove all tasks, are you sure?
        </p>
      </div>
      <button
        class="block w-full sm:inline sm:w-20 bg-btn bg-done btn-template bg-green-500 hover:bg-green-600"
        @click.prevent="removeAll"
      ></button>
      <button
        class="block w-full sm:inline sm:w-20 bg-btn bg-undone btn-template bg-red-500 hover:bg-red-600"
        @click.prevent="confirmRemoveAll"
      ></button>
    </div>
    <ul
      class="flex justify-center items-center mx-auto rounded-md bg-gray-100 shadow-lg p-10 w-11/12 sm:w-3/4 dark:bg-gray-400 pb-5"
    >
      <li class="w-full">
        <!-- Task heading -->
        <div class="w-full sm:w-2/3 flex mx-auto gap-x-12 text-center">
          <p
            class="w-full text-center sm:text-left sm:w-1/3 font-mono font-bold text-2xl"
          >
            Tasks
          </p>
          <p class="font-mono font-bold text-2xl hidden sm:block">Added at</p>
        </div>
        <TaskItem
          @childToggle="toggleTodo"
          @childRemove="remove"
          @childEdit="edit"
          v-for="(task, index) in tasks"
          :item="task"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import NewTask from "../components/NewTask.vue";
import TaskItem from "../components/TaskItem.vue";
import { useTaskStore } from "../store/task";
import { useUserStore } from "../store/user";
import { useProfileStore } from "../store/profile";
import { useRouter } from "vue-router";

// Initializing array of tasks
let tasks = ref([]);
let removeAllDialog = ref(false);

// Getting tasks from supabase
async function getTasks() {
  tasks.value = await useTaskStore().fetchTasks();
}

getTasks();

// Getting profile info
const profiles = ref([]);

async function getProfile() {
  const res = await useProfileStore().fetchProfile();
  profiles.value = res[0];
  // console.log(profiles.value);
}

getProfile();

// Dropdown variables
const dropdownSelect = ref(false);
const dropdownFilter = ref(false);
const dropdownSort = ref(false);

// Variable for redirections
const redirect = useRouter();

// Global Functions
async function showDone() {
  resetFilters();
  const filterDone = await useTaskStore().filterDone();
  tasks.value = filterDone;
  resetDropdowns();
}

async function showUndone() {
  resetFilters();
  const filterUndone = await useTaskStore().filterUndone();
  tasks.value = filterUndone;
  resetDropdowns();
}

async function resetFilters() {
  getTasks();
  resetDropdowns();
}

async function markAllDone() {
  await useTaskStore().allDone();
  getTasks();
  resetDropdowns();
}

async function markAllUndone() {
  await useTaskStore().allUndone();
  getTasks();
  resetDropdowns();
}

function confirmRemoveAll() {
  removeAllDialog.value = !removeAllDialog.value;
  resetDropdowns();
}

async function removeAll() {
  await getTasks();
  tasks.value.forEach(async (task) => {
    await remove(task);
  });
  resetDropdowns();
}

async function sortTitle() {
  getTasks();
  const sortTitle = await useTaskStore().sortTitle();
  tasks.value = sortTitle;
  resetDropdowns();
}

async function sortDate() {
  const sortDate = await useTaskStore().sortDate();
  tasks.value = sortDate;
  console.log(tasks.value);
  resetDropdowns();
}

function resetDropdowns() {
  dropdownSelect.value = false;
  dropdownFilter.value = false;
  dropdownSort.value = false;
}

function toggleDropdownSelect() {
  dropdownSelect.value = !dropdownSelect.value;
  dropdownFilter.value = false;
  dropdownSort.value = false;
}
function toggleDropdownFilter() {
  dropdownFilter.value = !dropdownFilter.value;
  dropdownSelect.value = false;
  dropdownSort.value = false;
}
function toggleDropdownSort() {
  dropdownSort.value = !dropdownSort.value;
  dropdownFilter.value = false;
  dropdownSelect.value = false;
}

// Individual Functions
async function addTodo(newTodo) {
  await useTaskStore().addTask(newTodo);
  getTasks();
}

async function toggleTodo(item) {
  const toggleComplete = !item.is_complete;
  const toggleId = item.id;
  await useTaskStore().toggleDone(toggleComplete, toggleId);
  getTasks();
}

async function edit(item) {
  const newTitle = item.newValue;
  const editId = item.oldValue.id;
  await useTaskStore().editTask(newTitle, editId);
  getTasks();
}

async function remove(item) {
  await useTaskStore().deleteTask(item.id);
  getTasks();
}
</script>

<style>
/* Template styles */
.cover-pic {
  background: linear-gradient(
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5)),
    url("../assets/todo-cover.jpeg");
}

.btn-template {
  @apply h-10 w-36 max-w-xs text-white font-bold py-2 px-4 rounded;
}

.social-media-logo {
  @apply h-10 w-10 m-2;
}

/* Icons on inputs */
.bg-icon {
  background-repeat: no-repeat;
  background-position: 10px;
  background-size: 18px 18px;
}

.bg-btn {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25px 25px;
}

.bg-email {
  background-image: url("../assets/email.svg");
}

.bg-pwd {
  background-image: url("../assets/pwd.svg");
}

.bg-newpwd {
  background-image: url("../assets/new-pwd.svg");
}

.bg-check {
  background-image: url("../assets/check.svg");
}

.bg-new {
  background-image: url("../assets/new.svg");
}

.bg-edit {
  background-image: url("../assets/edit.svg");
}

.bg-danger {
  background-image: url("../assets/danger.svg");
}

.bg-done {
  background-image: url("../assets/done.svg");
}

.bg-undone {
  background-image: url("../assets/undone.svg");
}

.bg-edit {
  background-image: url("../assets/edit.svg");
}

.bg-bin {
  background-image: url("../assets/bin.svg");
}

.bg-avatar {
  background-image: url("../assets/avatar.svg");
}

.bg-ghost {
  background-image: url("../assets/ghost.svg");
}

.bg-website {
  background-image: url("../assets/website.svg");
}

.bg-filter {
  background-image: url("../assets/filter.svg");
  background-position: 20px;
}

.bg-all {
  background-image: url("../assets/multiple.svg");
  background-position: 20px;
}

.bg-sort {
  background-image: url("../assets/sort.svg");
  background-position: 20px;
}
</style>
