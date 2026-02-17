<template>
  <div class="outline flex ps-1">
    <input type="number" class="outline-none inset-shadow-none grow w-2.5 text-center" v-model="modelValue">
    <div class="flex flex-col items-center size-fit my-auto scale-75">
        <Icon icon="radix-icons:chevron-up" class="hover:cursor-pointer hover:text-zinc-400 -mt-2 m-px" @click="modelValue++"/>

        <Icon icon="radix-icons:chevron-down" class="hover:cursor-pointer hover:text-zinc-400 -mb-2 m-px" @click="modelValue--"/>
    
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps({
    modelValue: Number,
})


const modelValue = defineModel({type: Number, required: true})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; /* Remove any default margin */
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>