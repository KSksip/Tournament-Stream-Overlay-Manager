import type { Store } from '@tauri-apps/plugin-store'
import { Player, PlayerPresets } from '../types/overlay-data'


export class PlayerPreset {
    static async get(store: Store): Promise<PlayerPresets> {
        let keys = await store.keys()
        let data: PlayerPresets = {}

        for(const key of keys) {
            let entry: Player | undefined = await store.get(key)
            if (entry){
                data[key] = entry
            }
        }

        return data
    }

    static async save(store: Store, playerName: string, playerData: Player) {
        playerData.losers = false
        playerData.score = 0
        playerData.character = ""
        
        store.set(playerName, playerData)
        store.save()
    }

    static async delete(store: Store, playerName: string) {
        store.delete(playerName)
        store.save()
    }
}


/* export async function getPlayerPresets(store: Store): Promise<PlayerPresets> {
    let keys = await store.keys()
    let data: PlayerPresets = {}

    for(const key of keys) {
        let entry: Player | undefined = await store.get(key)
        if (entry){
            data[key] = entry
        }
    }

    return data
} */

export async function savePlayerPreset(store: Store, playerName: string, playerData: Player) {
    playerData.losers = false
    playerData.score = 0
    playerData.character = ""
    
    store.set(playerName, playerData)
    store.save()
}

export async function deletePlayerPreset(store: Store, playerName: string) {
    store.delete(playerName)
    store.save()
}