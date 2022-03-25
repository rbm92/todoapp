<template>
  <!-- Dashboard -->
  <div>
    <div
      class="flex flex-col sm:flex-row items-center justify-center m-10 gap-x-28 gap-y-5 my-20"
    >
      <h1 class="text-4xl font-bold">Welcome back!</h1>
      <span class="font-mono text-3xl font-bold text-green-500"
        >@{{ userName }}</span
      >
    </div>
    <!-- Adding a new task -->
    <NewTask @childAddTodo="addTodo" />

    <!-- <h2 class="text-3xl font-bold mt-10 ml-10">List of Tasks</h2> -->
    <!-- Buttons controlling all tasks -->
    <div
      class="flex flex-col sm:flex-row w-3/4 gap-10 my-20 rounded-md bg-gray-100 shadow-lg p-10 mx-auto justify-center"
    >
      <!-- Select All -->
      <div class="flex flex-col gap-1">
        <button
          class="pl-10 bg-btn bg-all btn-template bg-slate-500 hover:bg-slate-600"
          @click="toggleDropdownSelect"
        >
          SELECT
        </button>
        <button
          v-if="dropdownSelect"
          class="pl-10 bg-btn bg-all btn-template bg-green-600 hover:bg-green-700"
          @click="markAllDone"
        >
          Done
        </button>
        <button
          v-if="dropdownSelect"
          class="pl-10 bg-btn bg-all btn-template bg-indigo-400 hover:bg-indigo-500"
          @click="markAllUndone"
        >
          Undone
        </button>
        <button
          v-if="dropdownSelect"
          class="pl-10 bg-btn bg-all btn-template bg-red-600 hover:bg-red-700"
          @click="confirmRemoveAll"
        >
          Remove
        </button>
      </div>
      <!-- Filters -->
      <div class="flex flex-col gap-1">
        <button
          class="pl-10 bg-btn bg-filter btn-template bg-gray-500 hover:bg-gray-600"
          @click="toggleDropdownFilter"
        >
          SELECT
        </button>
        <button
          v-if="dropdownFilter"
          class="pl-10 bg-btn bg-filter btn-template bg-lime-600 hover:bg-lime-700"
          @click="showDone"
        >
          Done
        </button>
        <button
          v-if="dropdownFilter"
          class="pl-10 bg-btn bg-filter btn-template bg-sky-600 hover:bg-sky-700"
          @click="showUndone"
        >
          Undone
        </button>
        <button
          v-if="dropdownFilter"
          class="pl-10 bg-btn bg-filter btn-template bg-pink-600 hover:bg-pink-700"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
      <!-- Sorts -->
      <div class="flex flex-col gap-1">
        <button
          class="pl-10 bg-btn bg-sort btn-template bg-zinc-500 hover:bg-zinc-600"
          @click="toggleDropdownSort"
        >
          SELECT
        </button>
        <button
          v-if="dropdownSort"
          class="pl-10 bg-btn bg-sort btn-template bg-emerald-600 hover:bg-emerald-700"
          @click="sortTitle"
        >
          Title
        </button>
        <button
          v-if="dropdownSort"
          class="pl-10 bg-btn bg-sort btn-template bg-cyan-600 hover:bg-cyan-700"
          @click="sortDate"
        >
          Date
        </button>
        <button
          v-if="dropdownSort"
          class="pl-10 bg-btn bg-sort btn-template bg-rose-600 hover:bg-rose-700"
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
    <div
      v-if="removeAllDialog"
      class="flex w-3/4 mx-auto rounded-md bg-gray-100 shadow-lg p-5 gap-5"
    >
      <input class="bg-gray-100 bg-icon bg-danger w-10" type="text" />
      <p class="font-mono text-red-600 italic font-bold w-2/3">
        You're about to remove all tasks, are you sure?
      </p>
      <button
        class="bg-btn bg-done btn-template bg-green-400 w-16 hover:bg-green-500"
        @click.prevent="removeAll"
      ></button>
      <button
        class="bg-btn bg-undone btn-template bg-red-500 w-16 hover:bg-red-600"
        @click.prevent="confirmRemoveAll"
      ></button>
    </div>
    <!-- Remove All dialog -->
    <ul
      class="flex justify-center items-center mx-auto rounded-md bg-gray-100 shadow-lg p-10 my-20 w-3/4"
    >
      <li class="w-full">
        <!-- Task heading -->
        <div class="flex justify-around items-center mx-auto">
          <p class="font-mono font-bold text-2xl">Task</p>
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

// Initializing array of tasks
let tasks = ref([]);
let removeAllDialog = ref(false);

// Printing date
// console.log(tasks.value.inserted_at.split('T')[0]);

// Getting tasks from supabase
async function getTasks() {
  tasks.value = await useTaskStore().fetchTasks();
}

getTasks();

// Printing user email
const userEmail = useUserStore().user.email;
const userName = userEmail.split("@")[0];

// Dropdown variables
const dropdownSelect = ref(false);
const dropdownFilter = ref(false);
const dropdownSort = ref(false);

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
  // tasks.value.forEach((task) => (task.completed = true));
  await useTaskStore().allDone();
  getTasks();
  resetDropdowns();
}

async function markAllUndone() {
  // tasks.value.forEach((task) => (task.completed = false));
  await useTaskStore().allUndone();
  getTasks();
  resetDropdowns();
}

function confirmRemoveAll() {
  removeAllDialog.value = !removeAllDialog.value;
  resetDropdowns();
}

async function removeAll() {
  // tasks.value.length = 0;
  // await useTaskStore().deleteTask();
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
  getTasks();
  const sortDate = await useTaskStore().sortDate();
  tasks.value = sortDate;
  resetDropdowns();
}

function resetDropdowns() {
  dropdownSelect.value = false;
  dropdownFilter.value = false;
  dropdownSort.value = false;
}

function toggleDropdownSelect() {
  dropdownSelect.value = !dropdownSelect.value;
}
function toggleDropdownFilter() {
  dropdownFilter.value = !dropdownFilter.value;
}
function toggleDropdownSort() {
  dropdownSort.value = !dropdownSort.value;
}

// Individual Functions
async function addTodo(newTodo) {
  // tasks.value.push({
  //   title: newTodo,
  //   completed: false,
  // }); // saves input to pending

  await useTaskStore().addTask(newTodo);
  getTasks();
}

async function toggleTodo(item) {
  // const index = tasks.value.indexOf(item);
  // console.log(item.completed);
  // tasks.value[index].completed = !tasks.value[index].completed;
  const toggleComplete = !item.is_complete;
  const toggleId = item.id;
  await useTaskStore().toggleDone(toggleComplete, toggleId);
  getTasks();
}

async function edit(item) {
  // const index = tasks.value.indexOf(item.oldValue);
  // tasks.value[index].title = item.newValue;
  const newTitle = item.newValue;
  const editId = item.oldValue.id;
  await useTaskStore().editTask(newTitle, editId);
  getTasks();
}

async function remove(item) {
  // const index = tasks.value.indexOf(item);
  // tasks.value.splice(index, 1);
  await useTaskStore().deleteTask(item.id);
  getTasks();
}
</script>

<style>
.btn-template {
  @apply h-10 w-36 max-w-xs text-white font-bold py-2 px-4 rounded;
}

.social-media-a {
  @apply rounded hover:border-2 hover:border-green-700;
}

.social-media-logo {
  @apply h-10 w-10 m-2;
}

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
