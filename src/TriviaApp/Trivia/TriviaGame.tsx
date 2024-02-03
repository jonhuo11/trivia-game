import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { RoomStateContext } from "../Room/Room"
import TeamsList from "./TeamsList"
import { Box, Button, Typography } from "@mui/material"
import { TriviaGameActionMessage, TriviaGameUpdate } from "../Messages"
import QuestionDisplay from "./QuestionDisplay"
import { ObjectReplace } from "../../Util"

enum TriviaState {
    INLIMBO = 0,
    INROUND = 1,
    INLOBBY = 2
}

interface TriviaGameState {
    // lobby, in game, win, ...
    state: TriviaState

    // blue team
    blueTeam: string[],

    // red team
    redTeam: string[]
}

const initialTriviaGameState:TriviaGameState = {
    state: TriviaState.INLOBBY,
    blueTeam: [],
    redTeam: []
}

interface TriviaGameProps {
    wsSendGameMessage: (stringifiedContent:string) => void
    startGame: () => void
}

export interface TriviaGameHandle {
    onServerTriviaGameUpdate: (update: TriviaGameUpdate) => void
    reset: () => void // when the websocket disconnects
    ping: () => void
}

const TriviaGame = forwardRef<TriviaGameHandle, TriviaGameProps>((
    {wsSendGameMessage}: TriviaGameProps,
    ref
) => {
    const roomState = useContext(RoomStateContext) // chat, playerlist, etc
    const [gameState, setGameState] = useState(initialTriviaGameState)

    // TODO reset gameState when disconnected or first connecting

    const onWebsocketDisconnect = () => {
        setGameState(initialTriviaGameState)
    }

    const onServerTriviaGameUpdate = (update: TriviaGameUpdate):void => {
        //console.log("Got trivia game update", update)
        switch(gameState.state) {
            case TriviaState.INLOBBY: {
                /*
                While in limbo, players can
                - join blue/red team

                While in round, players can
                - vote
                */

                // TODO check here if gameState was changed by server
                break
            }
            case TriviaState.INLIMBO: {
                break
            }
            case TriviaState.INROUND: {
                // TODO game logic
                break
            }
        }
        // update local state
        setGameState(c => {
            const newC = {...c}
            ObjectReplace(newC, update)
            //console.log(newC)
            return newC
        })
    }

    // passes the callback for when trivia game updates are received back to the room manager
    useImperativeHandle(ref, () => {
        return {
            onServerTriviaGameUpdate,
            reset() {
                // when websocket disconnects
                onWebsocketDisconnect()
            },
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

    const startGame = () => {

    }

    return <Box>
        {gameState.state === TriviaState.INLOBBY && <Box>
            <TeamsList
                blue={gameState.blueTeam}
                red={gameState.redTeam}
                handleClickBlueTeam={() => {
                    joinTeam("blue")
                }}
                handleClickRedTeam={() => {
                    joinTeam("red")
                }}
            />
            <Button
                variant="outlined"
                sx={{
                    
                }}
                onClick={startGame}
            >
                Start Game
            </Button>
        </Box>}
        {/*
        <Box>
            <QuestionDisplay
                q="Which voice actor does the voice for Quagmire?"
                a={["Seth Macfarlane", "Mila Kunis"]}
            />
        </Box>
        */}
    </Box>
})

export default TriviaGame