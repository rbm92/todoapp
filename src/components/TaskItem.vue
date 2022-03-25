<template>
  <!-- Item wrapper -->
  <div class="flex flex-col sm:flex-row gap-5 items-center my-10">
    <p class="text-center font-mono w-2/3" :class="{ taskDone: item.is_complete }">{{ item.title }}</p>
    <p class="text-center font-mono w-1/3">{{item.inserted_at.split('20')[1].split('T')[0]}}</p>
    <div class="flex gap-2">
    <button
      v-if="!item.is_complete"
      class="w-12 bg-btn bg-done btn-template bg-green-400 hover:bg-green-500"
      @click="toggleTodo"
    >
    </button>
    <button
      v-if="item.is_complete"
      class="w-12 bg-btn bg-undone btn-template bg-indigo-400 hover:bg-indigo-500"
      @click="toggleTodo"
    >
    </button>
    <button
      class="w-12 bg-btn bg-edit btn-template bg-yellow-400 hover:bg-yellow-500"
      @click="toggleEdit"
    >
    </button>

    <button
      class="w-12 bg-btn bg-bin btn-template bg-red-500 hover:bg-red-600"
      @click="confirmRemove"
    >
    </button>
    </div>
  </div>

  <!-- Edit dialog -->
  <form action="">
    <div v-if="editDialog" class="flex gap-5 items-center justify-center mx-auto my-10">
      <input
        type="text"
        placeholder="nothing is permanent"
        class="a w-2/3 p-2 pl-12 text-gray-500 rounded bg-icon bg-edit"
        v-model="editTodo"
      />
      <button
        class="bg-btn bg-done btn-template bg-green-400 w-12 hover:bg-green-500"
        @click.prevent="edit"
      >
      </button>
      <p v-if="empty" class="text-red-600 font-bold">
        {{ errorInput }}
      </p>
    </div>
  </form>
  <!-- Remove dialog -->
  <form
    action=""
    v-if="removeDialog"
    class="flex items-center justify-around gap-20 bg-white rounded p-5 m-10"
  >
    <div class="flex items-center justify-around gap-10">
      <input class="bg-icon bg-danger w-10" type="text" />
      <p class="font-mono font-bold text-red-600 italic">Remove task?</p>
    </div>
    <div class="flex items-center justify-around gap-10">
      <button
        class="btn-template bg-gray-400 w-20 hover:bg-green-500"
        @click.prevent="remove"
      >
        OK
      </button>
      <button
        class="btn-template bg-gray-400 w-20 hover:bg-red-500"
        @click.prevent="confirmRemove"
      >
        Cancel
      </button>
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
let removeDialog = ref(false); // initially hidden
let currentIndex = ref(""); // used to show only 1 dialog

let taskDone = true; // toggleDone boolean

const emit = defineEmits([
  "childToggle",
  "childRemove",
  "childEdit",
  "childToggleEdit",
]);

const props = defineProps(["item"]);

// Error Handling
function errHandl() {
  errorInput.value = "Field cannot be empty";
  empty.value = true;
}

// Show Edit Dialog
function toggleEdit() {
  editDialog.value = !editDialog.value;
  editTodo.value = props.item.title;
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

function confirmRemove() {
  removeDialog.value = !removeDialog.value;
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
