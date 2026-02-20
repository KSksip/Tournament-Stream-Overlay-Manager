<!-- NOTE TO SELF: LOAD SAVED OVERLAY STATE FROM THE JSON N WHAT NOT!!! -->

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import customCombobox from '../interface/custom-combobox.vue';
import { fetch } from '@tauri-apps/plugin-http';
import Database from '@tauri-apps/plugin-sql';
import { useDebounceFn } from '@vueuse/core';

const data = defineModel({type: Object, required: true})
const props = defineProps<{
    db: Database,
    label: string,
    charactersList: any,
    gameId: number
}>()

type ButtonData = {
  id: number, 
  name: string
}

const playerName = ref<string>("")
const chosenCharacter = ref<ButtonData>({id: 0, name: ""})
const chosenSkin = ref<ButtonData>({id: 0, name: ""})
const selectedPreset = ref<ButtonData>({id: 0, name: ""})
const selectedCountry = ref<ButtonData>({id: 0, name: ""})

const presetList = ref<ButtonData[]>([{id: 0, name: "no presets"}])

const style = {
  ddInputClass: "rounded-sm px-1 py-0.5 border-zinc-300 inset-shadow-sm",
  ddMenuClass: "border-zinc-300 rounded-b-sm shadow-sm [&_button]:hover:bg-zinc-100"
}

const pronounsList = [
  {id:0, name: "she/her"},
  {id:0, name: "he/him"},
  {id:0, name: "she/they"},
  {id:0, name: "he/they"},
  {id:0, name: "they/them"},
]

const charactersSkinsList = ref<ButtonData[]>([{id: 0, name: ""}])

//shut up (fix this pls)
const test = [{id: "someId", name: "someName"}]


async function savePlayerPreset(){

  const res = await props.db.execute(
    "REPLACE into Player (id, name, prefix, pronouns, skin_id, character_id, game_id, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      selectedPreset.value.id == 0 ? null : selectedPreset.value.id,

      data.value.name,
      data.value.prefix,
      data.value.pronouns,
      chosenCharacter.value.id != 0 ? chosenCharacter.value.id : null,
      chosenSkin.value.id != 0 ? chosenSkin.value.id : null,
      props.gameId != 0 ? props.gameId : null,
      selectedCountry.value.name
    ]
  )
  selectedPreset.value = {id: res.lastInsertId!, name: playerName.value}

  presetList.value = await props.db.select("SELECT id, name from Player")

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
  chosenCharacter.value = {id: 0, name: ""}
  selectedPreset.value = {id: 0, name: ""}
  playerName.value = ""
  selectedCountry.value.name = ""
}

async function loadPlayerPreset(){
  const res = await props.db.select("SELECT * from Player WHERE id = $1", [selectedPreset.value.id])

  playerName.value = res[0].name
  data.value.prefix = res[0].prefix
  data.value.pronouns = res[0].pronouns
  selectedCountry.value.name = res[0].country
} 

async function deletePlayerPreset(){
  const res = await props.db.execute("DELETE from Player WHERE id = $1", [selectedPreset.value.id])
  presetList.value = await props.db.select("SELECT id, name from Player")
  clearPlayerData()
}

watch(playerName, () => {
  data.value.name = playerName.value

})

watch(chosenCharacter, async (oldValue, newValue) => {
  if(oldValue != newValue){
    data.value.character = chosenCharacter.value.name
  
    charactersSkinsList.value = await props.db.select("SELECT id, name from Skin WHERE character_id = $1", [chosenCharacter.value.id])
  
    const newSkin = charactersSkinsList.value.find(item => String(item.name) == "Default")
    chosenSkin.value = newSkin ? {id: newSkin.id, name: newSkin.name} : {id: 0, name: ""}
  }
}) 

const countries = ref({})
const formattedCountries = ref<ButtonData[]>()


const debounceCountryFetch = useDebounceFn(async ()=> {
  console.log("a")
  await fetch(`https://restcountries.com/v3.1/name/${selectedCountry.value.name}?fields=name`, {
    method: "GET"
  }).then(async (res) => {
    countries.value = await res.json()
  })

  formattedCountries.value = countries.value.map((item) => { return {id: 0, name: item.name.common} }) 
  data.value.country = selectedCountry.value.name
}, 300)  

watch(selectedCountry.value, debounceCountryFetch)

onMounted(async () => {
  try {
    //presetStore = await load('Player\ Presets.json')
    presetList.value = await props.db.select("SELECT id, name from Player")
  } catch (e){

  }
})

</script>
<template>
  <div class="flex flex-col gap-2" v-if="data && presetList">
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
              :options="presetList" 
              class="grow"
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Name" 
              :returnName="true"
              v-model="playerName"
            />
          </div>

          <custom-combobox 
            :options="pronounsList" 
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
              class="w-full"
              :options="formattedCountries" 
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              placeholder="Country" 
              v-model="selectedCountry"
            />
            <!-- <custom-combobox 
              class=""
              :inputClass="style.ddInputClass"
              :menuClass="style.ddMenuClass"
              :returnName="true"
              placeholder="Region" 
              v-model="data.Region"
              :options="test"  
            />   -->
          </div>

          <div class="flex gap-1 justify-between">
            <button @click="clearPlayerData()" class="bg-zinc-400 text-white hover:cursor-pointer rounded-sm px-2 py-0.5 flex gap-1 ">
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