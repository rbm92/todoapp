<template>
  <!-- Dashboard -->
  <div>
    <div class="flex m-10 justify-around">
      <h1 class="text-4xl font-bold">Welcome back!</h1>
      <span class="text-4xl font-bold text-green-600">@{{ userName }}</span>
    </div>
    <!-- Adding a new task -->
    <NewTask @childAddTodo="addTodo" />
    <h2 class="text-3xl font-bold mt-10 ml-10">List of Tasks</h2>
    <!-- Buttons controlling all tasks -->
    <div
      class="grid grid-cols-3 gap-5 mt-5 ml-10 rounded-md bg-gray-100 shadow-lg p-10 max-w-xl"
    >
      <button
        class="btn-template bg-green-700 hover:bg-green-800"
        @click="markAllDone"
      >
        Done All
      </button>
      <button
        class="btn-template bg-indigo-500 hover:bg-indigo-600"
        @click="markAllUndone"
      >
        Undone All
      </button>
      <button
        class="btn-template bg-red-700 hover:bg-red-800"
        @click="removeAll"
      >
        Remove All
      </button>
      <button
        class="btn-template bg-slate-600 hover:bg-slate-700"
        @click="showDone"
      >
        Filter Done
      </button>
      <button
        class="btn-template bg-sky-600 hover:bg-sky-700"
        @click="showUndone"
      >
        Filter Undone
      </button>
      <button
        class="btn-template bg-orange-700 hover:bg-orange-800"
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>
    <ul class="rounded-md bg-gray-100 shadow-lg p-10 m-10">
      <li>
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

// Initialization array of tasks
let tasks = ref([]);

// Getting tasks from supabase
async function getTasks() {
  tasks.value = await useTaskStore().fetchTasks();
}

getTasks();

// Printing user email
const userEmail = useUserStore().user.email;
const userName = userEmail.split("@")[0];

// // Initialization variables
// let editTodo = ref(""); // value from edit dialog

// let editDialog = ref(false); // initially hidden
// let currentIndex = ref(""); // used to show only 1 dialog

// // Error handling
// let emptyNew = ref(false); // for new todo input
// let empty = ref(false); // for editing a task
// let errorInput = ref(""); // error message variable

// // function errHandl() {
// //   errorInput.value = "Field cannot be empty";
// //   empty.value = true;
// // }

// Global Functions
async function showDone() {
  resetFilters();
  const filterDone = await useTaskStore().filterDone();
  tasks.value = filterDone;
}

async function showUndone() {
  resetFilters();
  const filterUndone = await useTaskStore().filterUndone();
  tasks.value = filterUndone;
}

async function resetFilters() {
  getTasks();
}

async function markAllDone() {
  // tasks.value.forEach((task) => (task.completed = true));
  await useTaskStore().allDone();
  getTasks();
}

async function markAllUndone() {
  // tasks.value.forEach((task) => (task.completed = false));
  await useTaskStore().allUndone();
  getTasks();
}

async function removeAll() {
  // tasks.value.length = 0;
  // await useTaskStore().deleteTask();
  await getTasks();
  tasks.value.forEach(async (task) => {
    await remove(task);
  });
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
  @apply w-36 max-w-xs text-white font-bold py-2 px-4 rounded;
}

.bg-icon {
  background-repeat: no-repeat;
  background-position: 10px;
  background-size: 18px 18px;
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
</style>
