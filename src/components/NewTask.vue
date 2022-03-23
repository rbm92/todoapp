<template>
  <!-- Adding a new task -->
  <form class="" action="">
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
</template>

<script setup>
import { ref, reactive, computed, defineEmits } from "vue";

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
