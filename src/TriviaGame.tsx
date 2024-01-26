import { useContext, useState } from "react"
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

const TriviaGame = ({wsSendGameMessage}: TriviaGameProps) => {
    const roomState = useContext(RoomStateContext)
    const [gameState, setGameState] = useState(initialTriviaGameState)

    const blueTeam:string[] = []
    const redTeam:string[] = []

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
}

export default TriviaGame