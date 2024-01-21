import { useContext, useState } from "react"
import { RoomStateContext } from "./Room"
import PlayerList from "./PlayerList"
import { Box } from "@mui/material"
import { TriviaGameUpdate } from "./Messages"

interface TriviaGameState {
}

const initialTriviaGameState:TriviaGameState = {
}

interface TriviaGameProps {
    nextGameUpdate: TriviaGameUpdate
    wsSend: (message:string) => void
}

const TriviaGame = ({nextGameUpdate, wsSend}: TriviaGameProps) => {
    const roomState = useContext(RoomStateContext)
    const [gameState, setGameState] = useState(initialTriviaGameState)

    const blueTeam = nextGameUpdate.blueTeam
    const redTeam = nextGameUpdate.redTeam

    return <Box>
        <PlayerList blue={blueTeam} red={redTeam}></PlayerList>
    </Box>
}

export default TriviaGame