<template>
  <!-- Item wrapper -->
  <div class="flex gap-5 items-center my-10 ml-10">
    <p class="w-60" :class="{ taskDone: item.is_complete }">{{ item.title }}</p>
    <button
      v-if="!item.is_complete"
      class="btn-template bg-green-400 hover:bg-green-500"
      @click="toggleTodo()"
    >
      Done
    </button>
    <button
      v-if="item.is_complete"
      class="btn-template bg-indigo-400 hover:bg-indigo-500"
      @click="toggleTodo()"
    >
      Undone
    </button>
    <button
      class="btn-template bg-yellow-400 hover:bg-yellow-500"
      @click="toggleEdit()"
    >
      Edit
    </button>

    <button class="btn-template bg-red-500 hover:bg-red-600" @click="remove()">
      Remove
    </button>
  </div>

  <!-- Edit dialog -->
  <form action="">
    <div v-if="editDialog" class="flex gap-5 items-center my-10 ml-10">
      <input
        type="text"
        placeholder="nothing is permanent"
        class="p-2 pl-12 text-gray-500 rounded bg-icon bg-edit"
        v-model="editTodo"
      />
      <button
        class="btn-template bg-gray-400 w-20 hover:bg-gray-500"
        @click.prevent="edit()"
      >
        OK
      </button>
      <p v-if="empty" class="text-red-600 font-bold">
        {{ errorInput }}
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useTaskStore } from "../store/task";

// Error Handling variables
let empty = ref(false); // for editing a task
let errorInput = ref(""); // error message variable

// Edit Dialog variables
let editTodo = ref(""); // value from edit dialog
let editDialog = ref(false); // initially hidden
let currentIndex = ref(""); // used to show only 1 dialog

let taskDone = true; // toggleDone boolean

const emit = defineEmits([
  "childToggle",
  "childRemove",
  "childEdit",
  "childToggleEdit",
]);

const props = defineProps(["item"]);

console.log(props.item.title);

// Error Handling
function errHandl() {
  errorInput.value = "Field cannot be empty";
  empty.value = true;
}

// Show Edit Dialog
function toggleEdit() {
  editDialog.value = !editDialog.value;
  editTodo.value = props.item.title
}

// Toggle Done and Undone
function toggleTodo() {
  emit("childToggle", props.item); // sends info to parent component
}

// Edit task
function edit() {
  if (editTodo.value === "") errHandl();
  // shows error message
  else {
    empty.value = false; // hides error message
    editDialog.value = false; // hides edit dialog
    const editValues = {
      oldValue: props.item,
      newValue: editTodo.value,
    };
    emit("childEdit", editValues);
    // pendings[index] = editTodo.value; // modifies text
    editTodo.value = ""; // clears input field
  }
}

// Remove task
function remove() {
  emit("childRemove", props.item);
}
</script>

<style>
.taskDone {
  text-decoration-line: line-through;
}
</style>
