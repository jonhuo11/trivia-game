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

enum TriviaState {
	INLIMBO = 0,
	INROUND = 1,
	INLOBBY = 2,
}

interface TriviaGameState {
	// lobby, in game, win, ...
	state: TriviaState;

	// round number
	round: number;

	// blue team
	blueTeam: string[];

	// red team
	redTeam: string[];
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
			<Box>
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
				
                <Box>
                    <QuestionDisplay
                        q="Which voice actor does the voice for Quagmire?"
                        a={["Seth Macfarlane", "Mila Kunis"]}
                    />
                </Box>
        
			</Box>
		);
	}
);

export default TriviaGame;
