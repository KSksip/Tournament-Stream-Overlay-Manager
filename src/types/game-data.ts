export type GameData = {
    [key: string]: Game,
}

export type Game = {
    character?: {
        [key: string]:{
            skins?: string[]
        },
    }
}
