<template>
  <!-- Dashboard -->
  <div>
    <h1 class="text-3xl font-bold mt-10 ml-10">My Todo App</h1>
    <form class="" action="">
      <!-- Adding a new task -->
      <div class="flex gap-5 items-center mt-5 ml-10">
        <label for="name">New Todo</label>
        <input
          class="border border-gray-400 rounded"
          v-model="newTodo"
          type="text"
          name="newTodo"
          id="name"
        />
        <button
          class="btn-template bg-blue-500 hover:bg-blue-600"
          @click.prevent="addTodo"
        >
          Add
        </button>
      </div>
      <p v-if="emptyNew" class="text-red-600 font-bold mt-5 ml-10">
        {{ errorInput }}
      </p>
    </form>
    <!-- Buttons controlling all pending tasks -->
    <div class="flex gap-5 mt-5 ml-10">
      <button
        class="btn-template bg-green-700 hover:bg-green-800"
        @click="markAllDone"
      >
        Mark All Done
      </button>

      <button
        class="btn-template bg-red-700 hover:bg-red-800"
        @click="removeAllUndone"
      >
        Remove All
      </button>
    </div>
    <h2 class="text-2xl font-bold mt-5 ml-10">Pending Tasks</h2>
    <!-- List of pending tasks -->
    <ul>
      <li v-for="(pending, index) in pendings">
        <!-- Item wrapper -->
        <div class="flex gap-5 items-center my-10 ml-10">
          <p>{{ pending }}</p>
          <button
            class="btn-template bg-green-400 hover:bg-green-500"
            @click="doneTodo(index)"
          >
            Done
          </button>
          <button
            class="btn-template bg-yellow-400 hover:bg-yellow-500"
            @click="showEditDialog(index)"
          >
            Edit
          </button>

          <button
            class="btn-template bg-red-500 hover:bg-red-600"
            @click="removePending(index)"
          >
            Remove
          </button>
        </div>
        <!-- Edit dialog -->
        <form action="">
          <div
            v-if="editDialog && currentIndex === index"
            class="flex gap-5 items-center my-10 ml-10"
          >
            <input
              type="text"
              class="border border-gray-400 rounded"
              v-model="editTodo"
            />
            <button
              class="btn-template bg-gray-400 hover:bg-green-500"
              @click.prevent="editPending(index)"
            >
              OK
            </button>
            <p v-if="empty" class="text-red-600 font-bold">
              {{ errorInput }}
            </p>
          </div>
        </form>
      </li>
    </ul>
    <h2 class="text-2xl font-bold mt-5 ml-10">Completed Tasks</h2>
    <!-- Buttons controlling all completed tasks -->
    <div class="flex gap-5 mt-5 ml-10">
      <button
        class="btn-template bg-indigo-500 hover:bg-indigo-600"
        @click="markAllUndone"
      >
        Mark All Undone
      </button>
      <button
        class="btn-template bg-red-700 hover:bg-red-800"
        @click="removeAllDone"
      >
        Remove All
      </button>
    </div>
    <!-- List of completed tasks -->
    <ul>
      <li v-for="(complete, index) in completes">
        <!-- Item wrapper -->
        <div class="flex gap-5 items-center my-10 ml-10">
          <p class="">{{ complete }}</p>
          <button
            class="btn-template bg-indigo-400 hover:bg-indigo-500"
            @click="undoneTodo(index)"
          >
            Undone
          </button>
          <button
            class="btn-template bg-yellow-400 hover:bg-yellow-500"
            @click="showEditDialog(index)"
          >
            Edit
          </button>
          <button
            class="btn-template bg-red-500 hover:bg-red-600"
            @click="removeCompleted(index)"
          >
            Remove
          </button>
        </div>
        <!-- Edit dialog -->
        <form action="">
          <div
            v-if="editDialog && currentIndex === index"
            class="flex gap-5 items-center my-10 ml-10"
          >
            <input
              type="text"
              class="border border-gray-400 rounded"
              v-model="editTodo"
            />
            <button
              class="btn-template bg-gray-400 hover:bg-green-500"
              @click.prevent="editCompleted(index)"
            >
              OK
            </button>
            <p v-if="empty" class="text-red-600 font-bold">
              {{ errorInput }}
            </p>
          </div>
        </form>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

// Arrays of pendings and completes
let pendings = reactive([]);
let completes = reactive([]);

// Initialization variables
let newTodo = ref(""); // value from new todo input
let editTodo = ref(""); // value from edit dialog

let editDialog = ref(false); // initially hidden
let currentIndex = ref(""); // used to show only 1 dialog

// Error handling
let emptyNew = ref(false); // for new todo input
let empty = ref(false); // for editing a task
let errorInput = ref(""); // error message variable

function errHandl() {
  errorInput.value = "Field cannot be empty";
  empty.value = true;
}

function addTodo() {
  if (newTodo.value === "") {
    errorInput.value = "New Todo field cannot be empty";
    emptyNew.value = true;
  }
  // shows error message
  else {
    emptyNew.value = false; // hides error message
    pendings.push(newTodo.value); // saves input to pending
    newTodo.value = ""; // clears input field
  }
}

function doneTodo(index) {
  completes.push(pendings[index]); // adds task to completed
  removePending(index); // removes task from pending
}

function undoneTodo(index) {
  pendings.push(completes[index]); // adds task to pending
  removeCompleted(index); // removes task from completed
}

function showEditDialog(index) {
  currentIndex.value = index; // points at the dialog that will show
  editDialog.value = true; // shows edit dialog
}

function editPending(index) {
  if (editTodo.value === "") errHandl();
  // shows error message
  else {
    empty.value = false; // hides error message
    editDialog.value = false; // hides edit dialog
    currentIndex.value = index; // points at the dialog that will show
    pendings[index] = editTodo.value; // modifies text
    editTodo.value = ""; // clears input field
    console.log(empty.value);
  }
}

function editCompleted(index) {
  completes[index] = editTodo.value; // modify text
  editTodo.value = ""; // clearing input field
  editDialog.value = false; // hiding edit dialog
}

function removePending(index) {
  pendings.splice(index, 1); // deleting task from pending
}

function removeCompleted(index) {
  completes.splice(index, 1); // deleting task from complete
}

function markAllDone() {
  pendings.forEach((pending) => completes.push(pending));
  removeAllUndone();
}

function markAllUndone() {
  completes.forEach((complete) => pendings.push(complete));
  removeAllDone();
}

function removeAllUndone() {
  pendings.length = 0;
}

function removeAllDone() {
  completes.length = 0;
}
</script>

<style scoped>
.btn-template {
  @apply text-white font-bold py-2 px-4 rounded;
}
</style>
