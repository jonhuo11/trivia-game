export enum PlayerMessageType {
    Connect = 0,
    JoinRoom = 1,
    CreateRoom = 2,
    RoomAction = 3
    
}

export enum ServerMessageType {
    ServerError = 0,
    RoomUpdate = 1,
}

export interface PlayerMessage {
    type: PlayerMessageType
    content: string
}

export interface ServerMessage {
    type: ServerMessageType
    content: string
}

export const Action = (c:PlayerMessage):string => {
    return JSON.stringify({
        type: c.type,
        content: btoa(c.content)
    })
}

export interface RoomActionMessage {
    chat?: string
}

export interface JoinRoomMessage {
    code: string
}

export interface RoomUpdateMessage {
    code: string
    players: string[]
    chat: string[]
}
