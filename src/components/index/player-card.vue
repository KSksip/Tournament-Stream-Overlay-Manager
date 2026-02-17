<script lang="ts" setup>
  // NOTE TO SELF PLEASE RENAME 
  // playerPresets to Presets
  // AND
  // PlayerPreset to PlayerPresets 
import { load, Store } from '@tauri-apps/plugin-store'
import { ref, computed, watch, onMounted } from 'vue'
import customCombobox from '../interface/custom-combobox.vue';
import { type PlayerPresets } from '../../types/overlay-data';
import { PlayerPreset } from '../../api/player-presets';

let presetStore: Store

const data = defineModel({type: Object, required: true})
const props = defineProps<{
    label: string,
    charactersList: any,
}>()

const playerName = ref<string>('')
const chosenCharacter = ref<string>('')
const playerPresets = ref<PlayerPresets>({})
const selectedPreset = ref<string>('')

const style = {
  ddInputClass: "rounded-sm px-1 py-0.5 border-zinc-300 inset-shadow-sm",
  ddMenuClass: "border-zinc-300 rounded-b-sm shadow-sm [&_button]:hover:bg-zinc-100"
}

const charactersSkinsList = computed(() => {
  if(props.charactersList[data.value.character]?.skins){
    return props.charactersList[data.value.character].skins

  } else {
    return []
  }
})

const playerPresetsKeys = computed(()=>{
  return Object.keys(playerPresets.value)
})

//shut up (fix this pls)
const test = ['']

function loadPlayerPreset(){
  if(playerPresetsKeys.value.includes(selectedPreset.value)) {
    data.value = playerPresets.value[selectedPreset.value]
    playerName.value = playerPresets.value[selectedPreset.value]!.name
  }
}

async function savePlayerPreset(){
  PlayerPreset.save(presetStore, selectedPreset.value, data.value)
  playerPresets.value = await PlayerPreset.get(presetStore)
}

async function deletePlayerPreset(){
  PlayerPreset.delete(presetStore, selectedPreset.value)
  playerPresets.value = await PlayerPreset.get(presetStore)

  selectedPreset.value = ""
}

function clearPlayerData(){
  data.value = {
    losers: false,
    name: "",
    prefix: "",
    score: 0,
    character: "",
    skin: "",
    pronouns: "",
  }
  chosenCharacter.value = ""
  selectedPreset.value = ""
  playerName.value = ""
}

watch(playerName, () => {
  data.value.name = playerName.value

  console.log(playerPresetsKeys.value.includes(data.value.name))
  if(playerPresetsKeys.value.includes(data.value.name)){
    selectedPreset.value = data.value.name
  }
})

watch(chosenCharacter, () => {
  data.value.character = chosenCharacter.value

  if(charactersSkinsList.value.includes("Default")){
    data.value.skin = "Default"
  }
})

onMounted(async () => {
  try {
    presetStore = await load('Player\ Presets.json')
    playerPresets.value = await PlayerPreset.get(presetStore)
  } catch (e){

  }
})

</script>
<template>
  <div class="flex flex-col gap-2" v-if="data && playerPresets">
    {{ data }}
    <div class="flex whitespace-nowrap justify-between">
        <div class="flex gap-1 justify-between">
            <h1 class="text-xl">{{ label }}</h1>
            
            <!-- figure this out -->
            
        </div>
        <div class="my-auto pe-1">
          <label class="mx-1.5" for="losers">[L]</label>
          <input class="checked:bg-green-500 size-3.5 hover:cursor-pointer" name="losers" type="checkbox" v-model="data.losers">
        </div>
    </div>
    <div class="flex gap-10">
      <div class="flex flex-col gap-1">
          <div class="flex gap-1">
            <custom-combobox 
              :options="test" 
              class="w-25"
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Prefix" 
              v-model="data.prefix"
            />
            <custom-combobox 
              :options="test" 
              class="grow"
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Name" 
              v-model="playerName"
            />
          </div>

          <custom-combobox 
            :options="test" 
            :inputClass="style.ddInputClass"
            :menuClass="style.ddMenuClass"
            placeholder="Pronouns" 
            v-model="data.pronouns"
          />

          <div v-if="charactersList" class="flex w-full gap-1">
            <custom-combobox 
              class=""
              :options="Object.keys(charactersList)" 
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Character" 
              v-model="chosenCharacter"
            />
            <custom-combobox 
              class=""
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Skin" 
              v-model="data.skin"
              :options="charactersSkinsList"  
            />  
          </div>
          
          <div class="flex w-full gap-1">
            <custom-combobox 
              class=""
              :options="test" 
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Country" 
              v-model="data.Country"
            />
            <custom-combobox 
              class=""
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Region" 
              v-model="data.Region"
              :options="test"  
            />  
          </div>

          <div class="flex gap-1 justify-between">
            <button @click="clearPlayerData()" class="bg-zinc-400 text-white rounded-sm px-2 py-0.5 flex gap-1 ">
                <!-- <span>Clear</span> -->
                <Icon class="my-auto" icon="radix-icons:reload"/>
            </button>

            <div class="flex gap-1 grow">
              <custom-combobox
              :options="playerPresetsKeys" 
              class="w-40 grow"
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Player Preset" 
              v-model="selectedPreset"
              />    
              
              <button @click="loadPlayerPreset()" class="size-7 flex justify-center outline outline-zinc-300 rounded-sm hover:cursor-pointer my-auto">
                  <Icon class="my-auto" icon="radix-icons:enter"/>
              </button>

              <button @click="savePlayerPreset()" class="size-7 flex justify-center outline outline-zinc-300 rounded-sm hover:cursor-pointer my-auto">
                  <Icon class="my-auto" icon="radix-icons:file"/>
              </button>

              <button @click="deletePlayerPreset()" class="size-7 flex text-red-600 justify-center outline outline-zinc-300 rounded-sm hover:cursor-pointer my-auto">
                  <Icon class="my-auto" icon="radix-icons:trash"/>
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>