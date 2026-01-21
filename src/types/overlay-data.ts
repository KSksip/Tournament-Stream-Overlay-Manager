export type OverlayData = {
    setInfo: SetInfo,
    player: PlayerArray
}

export type PlayerArray = [Player, Player]

export type Player = {
    losers: boolean,
    name: string,
    prefix: string,
    score: number,
    character: string,
    skin: string,
    pronouns: string, 
    country: string,
    region: string,
}

export type PlayerPresets = { [key: string ]: Player, }

export type SetInfo = {
    phase: string,
    match: string,
    bestOf: number,
}