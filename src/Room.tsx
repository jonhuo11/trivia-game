import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { createContext, useReducer, useRef, useState } from "react"
import JoinRoom from "./JoinRoom"
import { Action, JoinRoomMessage, PlayerMessageType, RoomActionMessage, RoomUpdateMessage, ServerMessage, ServerMessageType } from "./Messages"
import { ContentCopy } from "@mui/icons-material"
import Chat from "./Chat"


const WebSocketServerAddress = "ws://localhost:9100/ws"

interface RoomState {
    code: string
    playerList: string[]
    chat: string[]
}

enum RoomActions {
    Reset,
    UpdateRoomState
}

interface RoomAction {
    action: RoomActions
    payload?: any
}

const initialRoomState:RoomState = {
    code: "",
    playerList: [],
    chat: []
}
const roomStateReducer = (state:RoomState, action:RoomAction):RoomState => {
    switch(action.action) {
        case RoomActions.Reset:
            return initialRoomState
        case RoomActions.UpdateRoomState:
            const p = action.payload as RoomUpdateMessage
            //console.log("Room update", p)
            return {
                code: p.code,
                playerList: p.players,
                chat: p.chat
            }
        default:
            break
    }
    return state
}
export const RoomStateContext = createContext<RoomState>(initialRoomState)
export const RoomStateDispatchContext = createContext<React.Dispatch<RoomAction>>(()=>{})


const Room = () => {
    const [connected, setConnected] = useState<boolean>(false)
    const ws = useRef<WebSocket | null>(null)

    const [roomState, roomStateDispatch] = useReducer(roomStateReducer, initialRoomState)

    const onServerMessage = (event:MessageEvent) => {
        const msgs = JSON.parse(event.data) as ServerMessage[]
        for (const msgkey in msgs) {
            const msg = {
                type: msgs[msgkey].type,
                content: JSON.parse(atob(msgs[msgkey].content))
            }
            //console.log(msg)
            switch(msg.type) {
                case ServerMessageType.ServerError:
                    console.error(msg)
                    break
                case ServerMessageType.RoomUpdate:
                    // if not already in room
                    // console.log("Got room update from server")
                    
                    roomStateDispatch({
                        action: RoomActions.UpdateRoomState,
                        payload: msg.content as RoomUpdateMessage
                    })
                    break
                default:
                    console.log("Other message type")
            }
        }
    }

    const disconnect = () => {
        if (ws.current) {
            ws.current.close()
            ws.current = null
        }
        setConnected(false)
        roomStateDispatch({action:RoomActions.Reset, payload: ""})
        console.log("Disconnected")
    }

    const connect = () => {
        const socket = new WebSocket(WebSocketServerAddress)

        socket.onopen = ((event: Event) => {
            console.log("Connection opened: ", event)
            setConnected(true)

            if (ws.current) {
                ws.current.send(Action({
                    type: PlayerMessageType.Connect,
                    content: ""
                }))
            }
        })

        socket.onerror = ((event: Event) => {
            console.log("Websocket error: ", event)
            disconnect()
        })

        socket.onclose = (() => {
            disconnect()
        })

        socket.onmessage = onServerMessage

        ws.current = socket
    }

    const handleJoinRoom = (code:string) => {
        //console.log(code)
        if (ws.current) {
            const jrm: JoinRoomMessage = {
                code: code
            }
            ws.current.send(Action({
                type: PlayerMessageType.JoinRoom,
                content: JSON.stringify(jrm)
            }))
        }
    }

    const createRoom = () => {
        if (ws.current) {
            ws.current.send(Action({
                type: PlayerMessageType.CreateRoom,
                content: ""
            }))
        }
    }

    const onChatSend = (msg:string) => {
        if (ws.current) {
            //console.log(msg)
            const chat:RoomActionMessage = {
                chat: msg
            }

            ws.current.send(Action({
                type: PlayerMessageType.RoomAction,
                content: JSON.stringify(chat)
            }))
        }
    }

    return <RoomStateContext.Provider value={roomState}>
        <RoomStateDispatchContext.Provider value={roomStateDispatch}>
            <Box 
                display="flex"
                flexDirection='column'
                justifyContent='center'
            >
                {!connected ? <>
                    <Box>
                        <Button onClick={connect} variant="outlined">Connect</Button>
                    </Box>
                </> : <>
                    <Stack
                        direction={'column'}
                        maxWidth={'xs'}
                        spacing={2}
                    >
                        {roomState.code === "" &&
                            <>
                                <JoinRoom handleJoinRoom={handleJoinRoom}/>
                                <Button onClick={createRoom} variant="outlined">Create Room</Button>
                            </>
                        }
                        <Button onClick={disconnect} variant="outlined">Disconnect</Button>
                    </Stack>
                    {roomState.code && <Box>
                        <Stack
                            direction='row'
                            sx={{
                                alignItems: "center"
                            }}
                        >
                            <Typography>
                                Room code: {roomState.code}
                            </Typography>
                            <IconButton onClick={() => {navigator.clipboard.writeText(roomState.code)}}>
                                <ContentCopy fontSize="inherit"/>
                            </IconButton>
                        </Stack>
                        <Box>
                            <Typography>Players:</Typography>
                            {roomState.playerList && roomState.playerList.map((v, i) => {
                                return <Typography key={i}>{v}</Typography>
                            })}
                        </Box>

                        <Box>
                            <Chat onChatSend={onChatSend}/>
                        </Box>
                    </Box>}
                </>}
            </Box>
        </RoomStateDispatchContext.Provider>
    </RoomStateContext.Provider>
}

export default Room