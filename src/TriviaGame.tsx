import { forwardRef, useContext, useImperativeHandle, useRef, useState } from "react"
import { RoomStateContext } from "./Room"
import PlayerList from "./PlayerList"
import { Box, Typography } from "@mui/material"
import { TriviaGameUpdate } from "./Messages"

interface TriviaGameState {
}

const initialTriviaGameState:TriviaGameState = {
}

interface TriviaGameProps {
    wsSendGameMessage: (stringifiedContent:string) => void
}

export interface TriviaGameHandle {
    onServerTriviaGameUpdate: (update: TriviaGameUpdate) => void
    ping: () => void
}

const TriviaGame = forwardRef<TriviaGameHandle, TriviaGameProps>((
    {wsSendGameMessage}: TriviaGameProps,
    ref
) => {
    const roomState = useContext(RoomStateContext)
    const [gameState, setGameState] = useState(initialTriviaGameState)

    const r = useRef()

    const blueTeam:string[] = []
    const redTeam:string[] = []

    const onServerTriviaGameUpdate = (update: TriviaGameUpdate):void => {

    }

    // passes the callback for when trivia game updates are received back to the room manager
    useImperativeHandle(ref, () => {
        return {
            onServerTriviaGameUpdate,
            ping() {
                console.log("Pinged TriviaGame")
            }
        }
    }, [r])

    return <Box>
        <PlayerList
            blue={blueTeam}
            red={redTeam}
            handleClickBlueTeam={() => {

            }}
            handleClickRedTeam={() => {

            }}
        ></PlayerList>
    </Box>
})

export default TriviaGame