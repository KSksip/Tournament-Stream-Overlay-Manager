import type { OverlayData, PlayerArray, SetInfo } from "../types/overlay-data"
import type { Store } from "@tauri-apps/plugin-store"
 
export class Overlay{

  static async save(data: OverlayData, store: Store){
    store.set("setInfo", data.setInfo)
    store.set("player", data.player)

    store.save()
  }

  static async get(store: Store): Promise<OverlayData>{
    const setInfo = await store.get<SetInfo>('setInfo')
    const player = await store.get<PlayerArray>('player')

    if (setInfo && player){
      const data: OverlayData = {
          setInfo: setInfo,
          player: player
      }

      return data
    } else {
      return {
    "player": [{ "character": "error", "country": "", "losers": false, "name": "", "prefix": "", "pronouns": "","region": "","score": 1,"skin": ""},{"character": "","country": "","losers": false,"name": "","prefix": "","pronouns": "","region": "","score": 0,"skin": ""}],"setInfo": {"bestOf": 5,"match": "","phase": ""}}
    }
  }

}