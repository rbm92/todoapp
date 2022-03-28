<template>
  <!-- Item wrapper -->
  <div
    class="flex flex-col sm:flex-row gap-5 items-center justify-center my-10"
  >
    <p
      class="text-center font-mono w-full sm:w-1/2"
      :class="{ taskDone: item.is_complete }"
    >
      {{ item.title }}
    </p>
    <p class="text-center font-mono w-full sm:w-1/4">{{ item.inserted_at.split('T')[0] }}</p>
    <!-- Button wrapper -->
    <div
      class="w-full sm:w-1/2 flex flex-col sm:flex-row gap-2 items-center justify-center"
    >
      <button
        v-if="!item.is_complete"
        class="block w-full sm:inline sm:w-20 bg-btn bg-done btn-template bg-green-400 hover:bg-green-500"
        @click="toggleTodo"
      ></button>
      <button
        v-if="item.is_complete"
        class="block w-full sm:inline sm:w-20 bg-btn bg-undone btn-template bg-indigo-400 hover:bg-indigo-500"
        @click="toggleTodo"
      ></button>
      <button
        class="block w-full sm:inline sm:w-20 bg-btn bg-edit btn-template bg-yellow-400 hover:bg-yellow-500"
        @click="toggleEdit"
      ></button>

      <button
        class="block w-full sm:inline sm:w-20 bg-btn bg-bin btn-template bg-red-500 hover:bg-red-600"
        @click="confirmRemove"
      ></button>
    </div>
  </div>

  <!-- Edit dialog -->
  <form action="">
    <div
      v-if="editDialog"
      class="flex flex-col sm:flex-row gap-5 items-center justify-center mx-auto my-10"
    >
      <input
        type="text"
        placeholder="nothing is permanent"
        class="block w-80 sm:inline sm:w-3/4 p-2 pl-12 text-gray-500 rounded bg-icon bg-edit"
        v-model="editTodo"
      />
      <button
        class="block w-full sm:inline sm:w-20 bg-btn bg-done btn-template bg-green-400 hover:bg-green-500"
        @click.prevent="edit"
      ></button>
      <p v-if="empty" class="text-red-600 font-bold">
        {{ errorInput }}
      </p>
    </div>
  </form>
  <!-- Remove dialog -->
  <form
    action=""
    v-if="removeDialog"
    class="flex flex-col sm:flex-row items-center justify-around bg-white rounded p-5 gap-y-5 gap-x-10"
  >
    <!-- Alert message wrapper -->
    <div class="sm:w-full flex items-center justify-center gap-x-5">
      <input class="bg-icon bg-danger w-10" type="text" />
      <p class="w-4/5 font-mono font-bold text-red-600 italic">Remove task?</p>
    </div>

    <button
      class="block w-full sm:inline sm:w-32 btn-template bg-gray-400 hover:bg-green-500"
      @click.prevent="remove"
    >
      OK
    </button>
    <button
      class="block w-full sm:inline sm:w-32 btn-template bg-gray-400 hover:bg-red-500"
      @click.prevent="confirmRemove"
    >
      Cancel
    </button>
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
// console.log(props.value.inserted_at);

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
  confirmRemove();
}
</script>

<style>
.taskDone {
  text-decoration-line: line-through;
}
</style>
