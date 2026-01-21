<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { refreshGameData } from './scripts/update-games-list';
import { load, type Store } from '@tauri-apps/plugin-store';
import { getGameData } from './api/game-data';
import { OverlayInfo } from './types/overlay-data';

let store: Store




onMounted(async ()=>{
    try{
        await refreshGameData()
        store = await load('Overlay\ Data.json')

        

        

        await SaveOverlayData(data.value, store)

    } catch(e) {
    }
})
</script>

<template>
    <p>{{ data }}</p>

</template>