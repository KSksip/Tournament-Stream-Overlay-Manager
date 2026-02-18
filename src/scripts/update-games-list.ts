import { GameData } from '../types/game-data'
import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { load } from '@tauri-apps/plugin-store';
import Database from '@tauri-apps/plugin-sql';

const store = await load('data.json');
const db = await Database.load("sqlite:storage.db")

export async function refreshGameData(): Promise<void> {
    const gamedata: GameData = {}

    const games = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH, {baseDir: BaseDirectory.Home})
    
    for(const game of games){
        const characters = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH + game.name + '/stock-icons', {baseDir: BaseDirectory.Home})
        
        
        const gameResult = await db.execute(`INSERT INTO Game VALUES (null, $1)`, [game.name])
        gamedata[game.name] = { character: {} }
        for(const character of characters){
            const skins = await readDir(import.meta.env.VITE_LOCAL_TEST_DIR_PATH + game.name + '/stock-icons/' + character.name, {baseDir: BaseDirectory.Home})
            
            
            const characterResult = await db.execute(`INSERT INTO Character VALUES (null, $1, $2)`, [character.name, gameResult.lastInsertId])
            gamedata[game.name].character![character.name] = {skins: []}
            
            for (const skin of skins){
                skin.name = skin.name.replace(".png", "")
                
                db.execute(`INSERT INTO Character VALUES (null, $1, $2)`, [skin.name, characterResult.lastInsertId])
                gamedata[game.name].character![character.name].skins!.push(skin.name)
            }
        }
    }

    for (const key in gamedata){
        await store.set(key, gamedata[key])
    }
    await store.save()
}