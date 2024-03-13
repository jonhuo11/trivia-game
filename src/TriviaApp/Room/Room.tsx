import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import {
	createContext,
	useCallback,
	useReducer,
	useRef,
	useState,
} from "react";
import JoinRoom from "./JoinRoom";
import {
	Action,
	JoinRoomMessage,
	PlayerMessageType,
	RoomActionMessage,
	RoomUpdateMessage,
	ServerMessage,
	ServerMessageType,
	TriviaGameUpdate,
    TriviaGameUpdateType,
} from "../Messages";
import { ContentCopy } from "@mui/icons-material";
import Chat from "./Chat";
import TriviaGame, { TriviaGameHandle } from "../Trivia/TriviaGame";

// NOTE Change this for debug on/off
const DebugMode: boolean = false;

const WebSocketServerAddress = "ws://localhost:9100/ws"; // TODO move this into a URLs file

enum RoomActions {
	Reset,
	UpdateRoomState,
}

interface RoomAction {
	action: RoomActions;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: any;
}

interface RoomState {
	connected: boolean;
	code: string;
	playerIds: string[];
	chat: string[];
	isOwner: boolean;
}

const initialRoomState: RoomState = {
	connected: false,
	code: "",
	playerIds: [],
	chat: [],
	isOwner: false,
};
const roomStateReducer = (state: RoomState, action: RoomAction): RoomState => {
	switch (action.action) {
		case RoomActions.Reset:
			return initialRoomState;
		case RoomActions.UpdateRoomState: { // TODO make this not a 1-to-1 with the server message
			const p = action.payload as RoomUpdateMessage;
			const newState = {
				...state,
				...p,
				isOwner: state.isOwner || p.created === true,
			};
			//console.log(newState)
			return newState;
		}
		default:
			break;
	}
	return state;
};
export const RoomStateContext = createContext<RoomState>(initialRoomState);
export const RoomStateDispatchContext = createContext<
	React.Dispatch<RoomAction>
>(() => {});

const Room = () => {
	const [connected, setConnected] = useState<boolean>(false);
	const ws = useRef<WebSocket | null>(null);

	const [roomState, roomStateDispatch] = useReducer(
		roomStateReducer,
		initialRoomState
	);

	const gameRef = useRef<TriviaGameHandle>(null);

    const [serverStartedGame, setServerStartedGame] = useState<boolean>(false)

	const onServerMessage = useCallback(
		(event: MessageEvent) => {
			const msgs = JSON.parse(event.data) as ServerMessage[];
			for (const msgkey in msgs) {
				const msg = {
					type: msgs[msgkey].type,
					content: JSON.parse(atob(msgs[msgkey].content)),
				};
				switch (msg.type) {
					case ServerMessageType.ServerError:
						console.error(msg);
						break;
					case ServerMessageType.RoomUpdate:
						roomStateDispatch({
							action: RoomActions.UpdateRoomState,
							payload: msg.content as RoomUpdateMessage,
						});
						break;
					case ServerMessageType.TriviaGameUpdate: {
						// trigger the callback from TriviaGame from here
						if (gameRef.current) {
							gameRef.current.onServerTriviaGameUpdate(
								msg.content as TriviaGameUpdate
							);
						}
                        const tgu = msg.content as TriviaGameUpdate
                        if (tgu.type === TriviaGameUpdateType.TSUTStartup) {
                            // hide the playerlist
                            setServerStartedGame(true)
                        } else if (tgu.type === TriviaGameUpdateType.TSUTSync) {
                            // hide the playerlist
                            if (tgu.state === 3) {
                                setServerStartedGame(true)
                            }
                        }
						break;
                    }
					default:
						console.log("Other message type");
				}
			}
		},
		[roomStateDispatch]
	);

	const disconnect = useCallback(() => {
		if (ws.current) {
			ws.current.close();
			ws.current = null;
		}
		setConnected(false);
        setServerStartedGame(true)
		roomStateDispatch({ action: RoomActions.Reset, payload: "" });
		if (gameRef.current) {
			gameRef.current.reset();
		}
		console.log("Disconnected");
	}, [setConnected, roomStateDispatch]);

	const connect = useCallback(() => {
		const socket = new WebSocket(WebSocketServerAddress);

		socket.onopen = (event: Event) => {
			console.log("Connection opened: ", event);
			setConnected(true);

			if (ws.current) {
				ws.current.send(
					Action({
						type: PlayerMessageType.Connect,
						content: "",
					})
				);
			}
		};

		socket.onerror = (event: Event) => {
			console.log("Websocket error: ", event);
			disconnect();
		};

		socket.onclose = () => {
			disconnect();
		};

		socket.onmessage = onServerMessage;

		ws.current = socket;
	}, [onServerMessage, disconnect]);

	const wsSendMessage = useCallback(
		(type: PlayerMessageType, content: string) => {
			if (!ws.current) {
				return;
			}
			ws.current.send(
				Action({
					type: type,
					content: content,
				})
			);
		},
		[]
	);

	const handleJoinRoom = useCallback(
		(code: string) => {
			const jrm: JoinRoomMessage = {
				code: code,
			};
			wsSendMessage(PlayerMessageType.JoinRoom, JSON.stringify(jrm));
		},
		[wsSendMessage]
	);

	const createRoom = useCallback(() => {
		wsSendMessage(PlayerMessageType.CreateRoom, "");
	}, [wsSendMessage]);

	const onChatSend = useCallback(
		(msg: string) => {
			const chat: RoomActionMessage = {
				chat: msg,
			};
			wsSendMessage(PlayerMessageType.RoomAction, JSON.stringify(chat));
		},
		[wsSendMessage]
	);

	// pass down websocket send to child for game messages
	const wsSendGameMessage = useCallback(
		(stringifiedContent: string) => {
			wsSendMessage(PlayerMessageType.GameAction, stringifiedContent);
		},
		[wsSendMessage]
	);

	// owner is allowed to start the game
	const startGame = useCallback(() => {
		if (!roomState.isOwner) {
			console.error("Only the owner can start games");
			return;
		}
		const ram: RoomActionMessage = {
			start: true,
		};
		wsSendMessage(PlayerMessageType.RoomAction, JSON.stringify(ram));
	}, [roomState, wsSendMessage]);

	return (
		<RoomStateContext.Provider value={roomState}>
			<RoomStateDispatchContext.Provider value={roomStateDispatch}>
				<Box
					display="flex"
					flexDirection="column"
					height="100%"
					justifyContent="center"
					alignItems="center"
					overflow="hidden"
					//bgcolor="red"
				>
					<Box
						display="flex"
						flexDirection="column"
						maxWidth="20vw"
						minWidth="300px"
						justifyContent="center"
						alignItems="center">
						{!connected && (
							<Button onClick={connect} variant="outlined">
								Connect to servers
							</Button>
						)}
						<Stack
							direction={"column"}
							maxWidth={"xs"}
							spacing={2}
							sx={{
								display: connected ? "flex" : "none",
							}}>
							{roomState.code === "" && (
								<>
									<JoinRoom handleJoinRoom={handleJoinRoom} />
									<Button
										onClick={createRoom}
										variant="outlined">
										Create Room
									</Button>
								</>
							)}
							<Button
								sx={{
									position: "fixed",
									left: "10px",
									top: "0px",
								}}
								onClick={disconnect}
								variant="outlined">
								Quit
							</Button>
						</Stack>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						minWidth="900px"
						maxWidth="90vw"
						sx={{
							visibility:
								(connected && roomState.code !== "") ||
								DebugMode
									? "visible"
									: "hidden",
						}}>
						<Stack
							direction="row"
							sx={{
								alignItems: "center",
                                position: !serverStartedGame ? "unset" : "fixed",
                                top: !serverStartedGame ? "unset" : "0",
                                right: !serverStartedGame ? "unset" : "0",
							}}
                        >
							<Typography>Room code: {roomState.code}</Typography>
							<IconButton
								onClick={() => {
									navigator.clipboard.writeText(
										roomState.code
									);
								}}>
								<ContentCopy fontSize="inherit" />
							</IconButton>
						</Stack>
						{!serverStartedGame && <Box>
							<Typography>
								Is owner: {`${roomState.isOwner}`}
							</Typography>
                            <Typography>Players:</Typography>
                            {roomState.playerIds &&
                                roomState.playerIds.map((v, i) => {
                                    return <Typography key={i}>{v}</Typography>;
                                })}
						</Box>}

						<TriviaGame
							wsSendGameMessage={wsSendGameMessage}
							ref={gameRef}
							roomStartGame={startGame}
						/>

						<Box
							sx={{
								position: "fixed",
								bottom: "0",
								right: "0",
							}}>
							<Chat onChatSend={onChatSend} />
						</Box>
					</Box>
				</Box>

				<Box
					sx={{
						position: "fixed",
						bottom: 0,
						left: 0,
					}}>
					<Typography fontSize="12px">Trivia Game</Typography>
				</Box>
			</RoomStateDispatchContext.Provider>
		</RoomStateContext.Provider>
	);
};

export default Room;
