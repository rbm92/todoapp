<template>
  <!-- Adding a new task -->
  <form class="mx-auto p-5 rounded-md bg-gray-100 shadow-lg w-3/4 justify-center flex flex-col items-center gap-y-5" action="">
    <div class="flex flex-col sm:flex-row justify-center items-center my-5 gap-10 w-full">
      <label class="font-mono text-xl" for="name">New Todo</label>
      <input
        class="block w-4/5 sm:inline sm:w-1/2 p-2 pl-12 text-gray-500 rounded bg-icon bg-new"
        placeholder="What's on your mind?"
        v-model="newTodo"
        type="text"
        name="newTodo"
        id="name"
      />
      <button
        class="block w-full btn-template bg-blue-500 sm:inline sm:w-32 hover:bg-blue-600"
        @click.prevent="addTodo"
      >
        Add
      </button>
    </div>
    <p v-if="emptyNew" class="font-mono text-red-600 font-bold ml-10">
      {{ errorInput }}
    </p>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useTaskStore } from "../store/task";

const emit = defineEmits(["childAddTodo"]);

// New Todo dialog variables
let newTodo = ref(""); // newTodo input field

let emptyNew = ref(false); // error box initially hidden
let errorInput = ref(""); // error message variable

function addTodo() {
  if (newTodo.value === "") {
    emptyNew.value = true; // shows error
    errorInput.value = "New Todo field cannot be empty";
    setTimeout(() => {
      emptyNew.value = false; // hides error
    }, 3000);
  }
  // shows error message
  else {
    emptyNew.value = false; // hides error message
    emit("childAddTodo", newTodo.value); // sends info to parent component
    newTodo.value = ""; // clears input field
  }
}
</script>

<style></style>
