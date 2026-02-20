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
import Database from '@tauri-apps/plugin-sql';

let presetStore: Store
let db: Database

const data = defineModel({type: Object, required: true})
const props = defineProps<{
    label: string,
    charactersList: any,
    gameId: number
}>()

//might want to type these
const playerName = ref("")
const chosenCharacter = ref({id: 0, name: ""})
const chosenSkin = ref({id: 0, name: ""})
const selectedPreset = ref({id: 0, name: ""})

const presetList = ref<{id: number, name: string}[]>([{id: 0, name: "no presets"}])

const style = {
  ddInputClass: "rounded-sm px-1 py-0.5 border-zinc-300 inset-shadow-sm",
  ddMenuClass: "border-zinc-300 rounded-b-sm shadow-sm [&_button]:hover:bg-zinc-100"
}

let charactersSkinsList: {id: 0, name: ""}[]
let namesList: {id: 0, name: ""}[]

//shut up (fix this pls)
const test = [{id: "someId", name: "someName"}]

/* function loadPlayerPreset(){
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
 */


async function savePlayerPreset(){
  const res = await db.execute(
    "INSERT into Player (name, prefix, pronouns, skin_id, character_id, game_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      playerName.value,
      data.value.prefix,
      data.value.pronouns,
      chosenCharacter.value.id,
      chosenSkin.value.id,
      props.gameId,
    ]
  )
}

watch(playerName, () => {
  console.log("asasdasd")
  data.value.name = playerName.value

})

watch(chosenCharacter, async (oldValue, newValue) => {
  if(oldValue != newValue){
    data.value.character = chosenCharacter.value.name
    charactersSkinsList = await db.select("SELECT id, name from Skin WHERE character_id = $1", [chosenCharacter.value.id])

    const newSkin = charactersSkinsList.find(item => String(item.name) == "Default")
    chosenSkin.value = newSkin ? newSkin : {id: 0, name:""}
  }
}) 

onMounted(async () => {
  try {
    presetStore = await load('Player\ Presets.json')
    presetList.value = await db.select("SELECT id, name from Player")
    db = await Database.load("sqlite:storage.db")
  } catch (e){

  }
})

</script>
<template>
  {{ charactersSkinsList }}
  <div class="flex flex-col gap-2" v-if="data && presetList">
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
              :returnName="true"
              placeholder="Prefix" 
              v-model="data.prefix"
            />
            <custom-combobox 
              :options="namesList" 
              class="grow"
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Name" 
              :returnName="true"
              v-model="playerName"
            />
          </div>

          <custom-combobox 
            :options="test" 
            :inputClass="style.ddInputClass"
            :menuClass="style.ddMenuClass"
            :returnName="true"
            placeholder="Pronouns" 
            v-model="data.pronouns"
          />

          <div v-if="charactersList" class="flex w-full gap-1">
            <custom-combobox 
              class=""
              :options="charactersList" 
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
              v-model="chosenSkin"
              :options="charactersSkinsList"  
            />  
          </div>
          
          <div class="flex w-full gap-1">
            <custom-combobox 
              class=""
              :options="test" 
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              :returnName="true"
              placeholder="Country" 
              v-model="data.Country"
            />
            <custom-combobox 
              class=""
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              :returnName="true"
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
              :options="presetList" 
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