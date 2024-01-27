import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { RoomStateContext } from "../Room"
import TeamsList from "./TeamsList"
import { Box, Typography } from "@mui/material"
import { TriviaGameActionMessage, TriviaGameUpdate } from "../Messages"

enum TriviaState {
    LOBBY = 0,
    GAME,
}

interface TriviaGameState {
    // lobby, in game, win, ...
    state: TriviaState

    // blue team
    blue: string[],

    // red team
    red: string[]
}

const initialTriviaGameState:TriviaGameState = {
    state: TriviaState.LOBBY,
    blue: [],
    red: []
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
    const roomState = useContext(RoomStateContext) // chat, playerlist, etc
    const [gameState, setGameState] = useState(initialTriviaGameState)

    // TODO reset gameState when disconnected or first connecting

    const onServerTriviaGameUpdate = (update: TriviaGameUpdate):void => {
        //console.log("Got trivia game update", update)
        switch(gameState.state) {
            case TriviaState.LOBBY: {
                /*
                While in lobby, players can
                - join blue/red team
                */

                // joining teams
                setGameState(c => ({
                    ...c,
                    blue: update.blueTeam,
                    red: update.redTeam
                }))
                break
            }
            case TriviaState.GAME: {
                // TODO game logic
                break
            }
        }
    }

    // passes the callback for when trivia game updates are received back to the room manager
    useImperativeHandle(ref, () => {
        return {
            onServerTriviaGameUpdate,
            ping() {
                console.log("Pinged TriviaGame")
            }
        }
    }, [])

    const joinTeam = (color: "blue" | "red") => {
        const tgam:TriviaGameActionMessage = {
            join: color === "blue" ? 0 : 1
        }
        wsSendGameMessage(JSON.stringify(tgam))
    }

    return <Box>
        <TeamsList
            blue={gameState.blue}
            red={gameState.red}
            handleClickBlueTeam={() => {
                joinTeam("blue")
            }}
            handleClickRedTeam={() => {
                joinTeam("red")
            }}
        ></TeamsList>
    </Box>
})

export default TriviaGame