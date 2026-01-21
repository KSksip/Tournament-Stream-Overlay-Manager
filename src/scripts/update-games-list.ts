import { GameData } from '../types/game-data'
import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { load } from '@tauri-apps/plugin-store';

const store = await load('data.json');

export async function refreshGameData(): Promise<void> {
    const gamedata: GameData = {}

    const games = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH, {baseDir: BaseDirectory.Home})
    
    for(const game of games){
        const characters = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH + game.name + '/stock-icons', {baseDir: BaseDirectory.Home})
        
        
        gamedata[game.name] = { character: {} }
        for(const character of characters){
            const skins = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH + game.name + '/stock-icons/' + character.name, {baseDir: BaseDirectory.Home})
            
            gamedata[game.name].character![character.name] = {skins: []}
            
            for (const skin of skins){
                skin.name = skin.name.replace(".png", "")
                
                gamedata[game.name].character![character.name].skins!.push(skin.name)
            }
        }
    }

    for (const key in gamedata){
        await store.set(key, gamedata[key])
    }
    await store.save()
}