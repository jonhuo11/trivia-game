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

export enum TriviaGameUpdateType {
    TSUTTeam = 0,
    TSUTGoToRoundFromLimbo = 1,
	TSUTGoToLimboFromRound = 2,
    TSUTStartup = 3,
    TSUTSync = 4
}

// incoming update from server, on server side is TriviaStateUpdateMessage
export interface TriviaGameUpdate {
    type: number;
	blueTeamIds: string[];
	redTeamIds: string[];
	state: number;
	round: number;
	roundTime: number;
	limboTime: number;
    startupTime: number;
    question: string;
    answers: {
        a: string
    }[];
}

export enum TriviaGameActionType {
    TGATJoin = 0,
    TGATGuess = 1
}

// outgoing, updates related to the trivia game itself
export interface TriviaGameActionMessage {
    type: TriviaGameActionType;
	join?: number; // 0 is blue 1 is red
    guess?: number; // the player's guess of which answer
}

// helper for compressing actions
export const Action = (c: PlayerMessage): string => {
	return JSON.stringify({
		type: c.type,
		content: btoa(c.content), // TODO is there a more efficient way to do this
	});
};
