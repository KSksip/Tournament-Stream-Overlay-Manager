<template>
    <div v-if="modelValue" ref="root" class="relative" :class="isFocused ? 'z-50' : ''" >
        <div
        :class="inputClass"
        class="z-20 flex border whitespace-nowrap bg-white border-inherit w-full min-w-5">
            <input v-model="modelValue.name" @click="handleClickedInput()" :placeholder="props.placeholder" type="text" class="outline-none min-w-1 w-full grow placeholder:text-zinc-500">
            <button class="flex" @click="isFocused = !isFocused">
                <Icon icon="radix-icons:chevron-down" class="my-auto hover:cursor-pointer hover:text-zinc-400"/>
            </button>
        </div>
        
        <div
        :class="menuClass"
        class="flex -z-10 bg-white w-full -mt-0.5 absolute flex-col w-inherit border border-t-0 start-0 border-inherit max-h-25 overflow-y-scroll" 
        v-if="isFocused == true">
        <!-- style this -->
            <button v-for="option in filteredOptions"  @click="selectOption({id: option.id, name: option.name})" 
            class="outline-none border-t border-t-inherit w-full text-sm text-start hover:cursor-pointer p-1">
                <span>
                 {{ option.name }}
                </span>
            </button>
            
            <span class="italic text-zinc-500 ps-1 text-sm" v-if="filteredOptions?.length == 0">. . .</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core';

const modelValue = defineModel({type: Object, required: true})
const rootEl = useTemplateRef<HTMLElement>('root')
const isFocused = ref(false)
    
const props = defineProps({
    options: Array,
    placeholder: String,
    inputClass: String,
    menuClass:String,
})

const filteredOptions = computed(() => {
    return props.options.filter((option: any) => option.name.toLowerCase().includes(modelValue.value.name.toLowerCase()))
})


function handleClickedInput(){
    if(!isFocused.value){
        modelValue.value.name = ''
    }
    isFocused.value = true
}

function selectOption(val:any){
    isFocused.value = false
    modelValue.value = val
}


onClickOutside(rootEl, (event) => {
    if(isFocused.value){
        isFocused.value = false
    }
})
</script>

<style>

</style>