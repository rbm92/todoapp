<template>
  <!-- Dashboard -->
  <div>
    <h1 class="text-3xl font-bold mt-10 ml-10">My Todo App</h1>
    <!-- Adding a new task -->
    <NewTask @childAddTodo="addTodo" />
    <h2 class="text-2xl font-bold mt-10 ml-10">List of Tasks</h2>
    <!-- Buttons controlling all tasks -->
    <div class="flex gap-5 mt-5 ml-10">
      <button
        class="btn-template bg-green-700 hover:bg-green-800"
        @click="markAllDone"
      >
        Mark All Done
      </button>
      <button
        class="btn-template bg-indigo-500 hover:bg-indigo-600"
        @click="markAllUndone"
      >
        Mark All Undone
      </button>
      <button
        class="btn-template bg-red-700 hover:bg-red-800"
        @click="removeAll"
      >
        Remove All
      </button>
    </div>
    <ul>
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

// Initialization array of tasks
let tasks = ref([]);

// Getting tasks from supabase
async function getTasks() {
  tasks.value = await useTaskStore().fetchTasks();
}
  
getTasks();

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
  const toggleId = item.id 
  await useTaskStore().toggleDone(toggleComplete, toggleId);
  getTasks();
}

async function edit(item) {
  // const index = tasks.value.indexOf(item.oldValue);
  // tasks.value[index].title = item.newValue;
  const newTitle = item.newValue;
  const editId = item.oldValue.id;
  console.log(newTitle);
  console.log(editId);
  await useTaskStore().editTask(newTitle, editId);
  getTasks();
}

async function remove(item) {
  // const index = tasks.value.indexOf(item);
  // tasks.value.splice(index, 1);
  await useTaskStore().deleteTask(item.id);
  getTasks();
}

// Global Functions
async function markAllDone() {
  // tasks.value.forEach((task) => (task.completed = true));
  console.log(tasks.value);
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
  await useTaskStore().deleteTask();
  getTasks();
}
</script>

<style>
.btn-template {
  @apply text-white font-bold py-2 px-4 rounded;
}
</style>
