import type { GameData, Game } from '../types/game-data';
import type { Store } from '@tauri-apps/plugin-store';

export async function getGameData(store: Store): Promise<GameData> {
    const keys = await store.keys()
    const data: GameData = {}

    for(const key of keys) {
        const chunk = await store.get<Game>(key)
        data[key] = chunk!
    }
    return data
}