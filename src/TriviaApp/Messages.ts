export enum PlayerMessageType {
	Connect = 0,
	JoinRoom = 1,
	CreateRoom = 2,
	RoomAction = 3,
	GameAction = 4,
}

export enum ServerMessageType {
	ServerError = 0,
	RoomUpdate = 1,
	TriviaGameUpdate = 2,
}

export interface PlayerMessage {
	type: PlayerMessageType;
	content: string;
}

export interface ServerMessage {
	type: ServerMessageType;
	content: string;
}

// outgoing
export interface RoomActionMessage {
	chat?: string;
	start?: boolean;
}

// outgoing
export interface JoinRoomMessage {
	code: string;
}

// incoming
export interface RoomUpdateMessage {
	code: string;
	players: string[];
	chat: string[];
	created?: boolean;
}

// incoming update from server, on server side is TriviaStateUpdateMessage
export interface TriviaGameUpdate {
	blueTeam?: string[];
	redTeam?: string[];
	state: number;
	round: number;
	roundTime?: number;
	limboTime?: number;
}

// outgoing, updates related to the trivia game itself
export interface TriviaGameActionMessage {
	join?: number; // 0 is blue 1 is red
}

// helper for compressing actions
export const Action = (c: PlayerMessage): string => {
	return JSON.stringify({
		type: c.type,
		content: btoa(c.content), // TODO is there a more efficient way to do this
	});
};
