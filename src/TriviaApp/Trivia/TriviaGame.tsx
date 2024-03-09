import {
    createRef,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { RoomStateContext } from "../Room/Room";
import TeamsList from "./TeamsList";
import { Box, Button, Typography } from "@mui/material";
import { TriviaGameActionMessage, TriviaGameUpdate, TriviaGameUpdateType } from "../Messages";
import QuestionDisplay from "./QuestionDisplay";
import VoteList, { VoteListItem } from "./VoteList";
import { blue, red } from "@mui/material/colors";

enum TriviaState {
	INLIMBO = 0,
	INROUND = 1,
	INLOBBY = 2,
}

export type TriviaPlayer = {
    id: string // matches the one in Room
    voted?: number // which option the player voted for
}

interface TriviaGameState {
	// lobby, in game, win, ...
	state: TriviaState;

	// round number
	round: number;

	// blue team
	blueTeamIds: string[];

	// red team
	redTeamIds: string[];

    // players
    players: {
        [id: string]: TriviaPlayer
    }

    // question
    question: string

    // answers
    answers: string[],

    // time per round
    roundTimeSeconds: number,

    // time per limbo
    limboTimeSeconds: number

    // time to startup
    startupTimeSeconds: number
}

const initialTriviaGameState: TriviaGameState = {
	state: TriviaState.INLOBBY,
	round: 0,
	blueTeamIds: [],
	redTeamIds: [],
    players: {},
    question: "",
    answers: [],
    roundTimeSeconds: 0,
    limboTimeSeconds: 0,
    startupTimeSeconds: 0
};

interface TriviaGameProps {
	wsSendGameMessage: (stringifiedContent: string) => void;
	roomStartGame: () => void;
}

export interface TriviaGameHandle {
	onServerTriviaGameUpdate: (update: TriviaGameUpdate) => void;
	reset: () => void; // when the websocket disconnects
	ping: () => void;
}

const TriviaGame = forwardRef<TriviaGameHandle, TriviaGameProps>(
	({ wsSendGameMessage, roomStartGame }: TriviaGameProps, ref) => {
		const roomState = useContext(RoomStateContext); // chat, playerlist, etc
		const [gameState, setGameState] = useState(initialTriviaGameState);

        const [timer, setTimer] = useState(0);

        const [starting, setStarting ] = useState(false);

		useEffect(() => {
            const ti = window.setInterval(() => {
                setTimer(p => {
                    //console.log("Trivia timer", p)
                    return Math.max(0, p - 1)
                })
            }, 950) // set a little faster to compesnate for lag?

            return () => {
                window.clearInterval(ti)
            }
        }, [])

		const onWebsocketDisconnect = useCallback(() => {
			setGameState(initialTriviaGameState);
		}, [setGameState]);


	    const onServerTriviaGameUpdate = useCallback((update: TriviaGameUpdate): void => {
            console.log(update)

			// use cstate here to get current state value as setState calls are batched
			setGameState((cstate:TriviaGameState) => {
				if (update.state !== cstate.state) {
					console.log(`Prev state ${cstate.state} New state ${update.state}`)
				}
                
                const newState:TriviaGameState = { ...cstate };

                switch(update.type) {
                    case TriviaGameUpdateType.TSUTTeam:
                        // a player changed or joined a team, this only happens while InLobby
                        newState.blueTeamIds = update.blueTeamIds || []
                        newState.redTeamIds = update.redTeamIds || []
                        const allPlayers = [...newState.blueTeamIds, ...newState.redTeamIds]
                        allPlayers.map(v => {
                            if (!(v in newState.players)) {
                                console.log("Adding new player")
                                newState.players[v] = {
                                    id: v,
                                }
                            }
                        })
                        
                        break

                    case TriviaGameUpdateType.TSUTGoToRoundFromLimbo:
                        // load the new question and answers
                        newState.question = update.question
                        newState.answers = update.answers

                        // update the round number and state
                        newState.round = update.round
                        newState.state = update.state

                        // reset the timer
                        setTimer(cstate.roundTimeSeconds)

                        break

                    case TriviaGameUpdateType.TSUTGoToLimboFromRound:

                        break
                    case TriviaGameUpdateType.TSUTStartup:
                        // round and limbo times will be provided
                        console.log("Starting game...")
                        newState.roundTimeSeconds = update.roundTime
                        newState.limboTimeSeconds = update.limboTime
                        newState.startupTimeSeconds = update.startupTime
                        setTimer(newState.startupTimeSeconds)
                        setStarting(true)
                        break
                    default:
                        console.error("Unrecognized game update type")
                        return cstate
                }

				return newState;
			});
		}, [setGameState]);

		// passes the callback for when trivia game updates are received back to the room manager
		useImperativeHandle(
			ref,
			() => {
				return {
					onServerTriviaGameUpdate,
					reset() {
						// when websocket disconnects
						onWebsocketDisconnect();
					},
					ping() {
						console.log("Pinged TriviaGame");
					},
				};
			},
			[]
		);

		const joinTeam = useCallback((color: "blue" | "red") => {
			const tgam: TriviaGameActionMessage = {
				join: color === "blue" ? 0 : 1,
			};
			wsSendGameMessage(JSON.stringify(tgam));
		}, [wsSendGameMessage]);

		const startGame = useCallback(() => {
			roomStartGame();
		}, [roomStartGame]);

		return (
			<Box
                display="flex"
                flexDirection="column"
            >
				{gameState.state === TriviaState.INLOBBY && (
					<Box>
						<TeamsList
							blue={gameState.blueTeamIds}
							red={gameState.redTeamIds}
							handleClickBlueTeam={() => {
								joinTeam("blue");
							}}
							handleClickRedTeam={() => {
								joinTeam("red");
							}}
						/>
						<Button
							variant="outlined"
							sx={{
								display: roomState.isOwner ? "flex" : "none",
							}}
							onClick={startGame}>
							Start Game
						</Button>
                        {starting && <Typography>Game starting in {timer}...</Typography>}
					</Box>
				)}

                <Box
                    display={gameState.state === TriviaState.INLIMBO || gameState.state === TriviaState.INROUND ? "flex" : "none"}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <VoteList 
                        items={gameState.blueTeamIds.map(v => {
                            const pl = gameState.players[v]
                            const vli:VoteListItem = {
                                player: pl.id,
                                voted: pl.voted
                            }
                            return vli
                        })}
                        color={blue[300]}
                    />

                    <QuestionDisplay
                        q={gameState.question}
                        a={gameState.answers}
                        timer={timer}
                    />

                    <VoteList
                        items={gameState.redTeamIds.map(v => {
                            const pl = gameState.players[v]
                            const vli:VoteListItem = {
                                player: pl.id,
                                voted: pl.voted
                            }
                            return vli
                        })}
                        color={red[300]}
                        reverse
                    />
                </Box>
        
			</Box>
		);
	}
);

export default TriviaGame;
