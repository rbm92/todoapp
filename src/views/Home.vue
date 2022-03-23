<template>
  <!-- Dashboard -->
  <div>
    <h1 class="text-3xl font-bold mt-10 ml-10">My Todo App</h1>
    <!-- Adding a new task -->
    <NewTask @childAddTodo="addTodo" />
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
    <h2 class="text-2xl font-bold mt-10 ml-10">List of Tasks</h2>
    <!-- <h2 class="text-2xl font-bold mt-5 ml-10">Pending Tasks</h2> -->
    <!-- List of pending tasks -->
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
import { ref, reactive, computed } from "vue";
import NewTask from "../components/NewTask.vue";
import TaskItem from "../components/TaskItem.vue";

// Array of tasks (examples)
let tasks = reactive([
  {
    title: "Title 1",
    completed: false,
  },
  {
    title: "Title 2",
    completed: true,
  },
]);

// Initialization variables
let editTodo = ref(""); // value from edit dialog

let editDialog = ref(false); // initially hidden
let currentIndex = ref(""); // used to show only 1 dialog

// Error handling
let emptyNew = ref(false); // for new todo input
let empty = ref(false); // for editing a task
let errorInput = ref(""); // error message variable

// function errHandl() {
//   errorInput.value = "Field cannot be empty";
//   empty.value = true;
// }

function addTodo(newTodo) {
  tasks.push({
    title: newTodo,
    completed: false,
  }); // saves input to pending
}

function toggleTodo(item) {
  const index = tasks.indexOf(item);
  tasks[index].completed = !tasks[index].completed;
}

function edit(item) {
  const index = tasks.indexOf(item.oldValue);
  tasks[index].title = item.newValue;
}

function remove(item) {
  const index = tasks.indexOf(item);
  tasks.splice(index, 1);
}

// Global Functions
function markAllDone() {
  tasks.forEach((task) => (task.completed = true));
  // pendings.length = 0;
}

function markAllUndone() {
  tasks.forEach((task) => (task.completed = false));
  // completes.length = 0;
}

function removeAll() {
  tasks.length = 0;
}
</script>

<style>
.btn-template {
  @apply text-white font-bold py-2 px-4 rounded;
}
</style>
