import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { createContext, useReducer, useRef, useState } from "react";
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
} from "../Messages";
import { ContentCopy } from "@mui/icons-material";
import Chat from "./Chat";
import TriviaGame, { TriviaGameHandle } from "../Trivia/TriviaGame";

// NOTE Change this for debug on/off
const DebugMode: boolean = false;

const WebSocketServerAddress = "ws://localhost:9100/ws";

interface RoomState {
	connected: boolean;
	code: string;
	players: string[];
	chat: string[];
	isOwner: boolean;
}

enum RoomActions {
	Reset,
	UpdateRoomState,
}

interface RoomAction {
	action: RoomActions;
	payload?: any;
}

const initialRoomState: RoomState = {
	connected: false,
	code: "",
	players: [],
	chat: [],
	isOwner: false,
};
const roomStateReducer = (state: RoomState, action: RoomAction): RoomState => {
	switch (action.action) {
		case RoomActions.Reset:
			return initialRoomState;
		case RoomActions.UpdateRoomState:
			const p = action.payload as RoomUpdateMessage;
			const newState = {
				...state,
				...p,
				isOwner: state.isOwner || p.created === true,
			};
			//console.log(newState)
			return newState;
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

	const onServerMessage = (event: MessageEvent) => {
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
				case ServerMessageType.TriviaGameUpdate:
					// trigger the callback from TriviaGame from here
					if (gameRef.current) {
						gameRef.current.onServerTriviaGameUpdate(
							msg.content as TriviaGameUpdate
						);
					}
					break;
				default:
					console.log("Other message type");
			}
		}
	};

	const disconnect = () => {
		if (ws.current) {
			ws.current.close();
			ws.current = null;
		}
		setConnected(false);
		roomStateDispatch({ action: RoomActions.Reset, payload: "" });
		if (gameRef.current) {
			gameRef.current.reset();
		}
		console.log("Disconnected");
	};

	const connect = () => {
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
	};

	const wsSendMessage = (type: PlayerMessageType, content: string) => {
		if (!ws.current) {
			return;
		}
		ws.current.send(
			Action({
				type: type,
				content: content,
			})
		);
	};

	const handleJoinRoom = (code: string) => {
		const jrm: JoinRoomMessage = {
			code: code,
		};
		wsSendMessage(PlayerMessageType.JoinRoom, JSON.stringify(jrm));
	};

	const createRoom = () => {
		wsSendMessage(PlayerMessageType.CreateRoom, "");
	};

	const onChatSend = (msg: string) => {
		const chat: RoomActionMessage = {
			chat: msg,
		};
		wsSendMessage(PlayerMessageType.RoomAction, JSON.stringify(chat));
	};

	// pass down websocket send to child for game messages
	const wsSendGameMessage = (stringifiedContent: string) => {
		wsSendMessage(PlayerMessageType.GameAction, stringifiedContent);
	};

	// owner is allowed to start the game
	const startGame = () => {
		if (!roomState.isOwner) {
			console.error("Only the owner can start games");
			return;
		}
		const ram: RoomActionMessage = {
			start: true,
		};
		wsSendMessage(PlayerMessageType.RoomAction, JSON.stringify(ram));
	};

	return (
		<RoomStateContext.Provider value={roomState}>
			<RoomStateDispatchContext.Provider value={roomStateDispatch}>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center">
					{!connected && (
						<Button onClick={connect} variant="outlined">
							Connect
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
								<Button onClick={createRoom} variant="outlined">
									Create Room
								</Button>
							</>
						)}
						<Button onClick={disconnect} variant="outlined">
							Disconnect
						</Button>
					</Stack>
					<Box
						display="flex"
						flexDirection="column"
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
							}}>
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
						<Box>
							<Typography>
								Is owner: {`${roomState.isOwner}`}
							</Typography>
							<Typography>Players:</Typography>
							{roomState.players &&
								roomState.players.map((v, i) => {
									return <Typography key={i}>{v}</Typography>;
								})}
						</Box>

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
			</RoomStateDispatchContext.Provider>
		</RoomStateContext.Provider>
	);
};

export default Room;
