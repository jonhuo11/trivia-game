import {
	forwardRef,
	useCallback,
	useContext,
	useImperativeHandle,
	useState,
} from "react";
import { RoomStateContext } from "../Room/Room";
import TeamsList from "./TeamsList";
import { Box, Button } from "@mui/material";
import { TriviaGameActionMessage, TriviaGameUpdate } from "../Messages";
import { ObjectReplace } from "../../Util";
import QuestionDisplay from "./QuestionDisplay";
import VoteList from "./VoteList";
import { blue, red } from "@mui/material/colors";

enum TriviaState {
	INLIMBO = 0,
	INROUND = 1,
	INLOBBY = 2,
}

export type Player = {
    id: string
    name: string
    voted?: number // which option the player voted for
}

interface TriviaGameState {
	// lobby, in game, win, ...
	state: TriviaState;

	// round number
	round: number;

	// blue team
	blueTeam: Player[];

	// red team
	redTeam: Player[];
}

const initialTriviaGameState: TriviaGameState = {
	state: TriviaState.INLOBBY,
	round: 0,
	blueTeam: [],
	redTeam: [],
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

		// TODO reset gameState when disconnected or first connecting

		const onWebsocketDisconnect = useCallback(() => {
			setGameState(initialTriviaGameState);
		}, [setGameState]);

	    const onServerTriviaGameUpdate = useCallback((update: TriviaGameUpdate): void => {
			// use cstate here to get current state value as setState calls are batched
			setGameState((cstate) => {
				if (update.state !== cstate.state) {
					console.log(`Prev state ${cstate.state} New state ${update.state}`)
				}
				switch (cstate.state) {
					case TriviaState.INLOBBY: {
						/*
                    While in limbo, players can
                    - join blue/red team

                    While in round, players can
                    - vote
                    */

						// TODO check here if gameState was changed by server
						break;
					}
					case TriviaState.INLIMBO: {
						break;
					}
					case TriviaState.INROUND: {
						// TODO game logic
						break;
					}
				}
				const newC = { ...cstate };
				ObjectReplace(newC, update);
				return newC;
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
							blue={gameState.blueTeam}
							red={gameState.redTeam}
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
					</Box>
				)}

                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <VoteList 
                        items={[{
                            player:"Joe",
                            voted: 5
                        }]}
                        color={blue[300]}
                    />

                    <QuestionDisplay
                        q="Which voice actor does the voice for Quagmire?"
                        img="https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Glenn-Quagmire.Family-Guy.webp"
                        a={["Seth Macfarlane", "Mila Kunis"]}
                    />

                    <VoteList
                        items={[
                            {
                                player: "Playeromg",
                                voted: 1
                            },
                            {
                                player: "EpicGamer33",
                            }
                        ]}
                        color={red[300]}
                        reverse
                    />
                </Box>
        
			</Box>
		);
	}
);

export default TriviaGame;
