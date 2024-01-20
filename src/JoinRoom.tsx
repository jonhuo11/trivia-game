import { Button, Stack, TextField } from "@mui/material"
import { useState } from "react"

const JoinRoom = ({handleJoinRoom} : {handleJoinRoom: (code:string) => void}) => {

    const [code, setCode] = useState<string>("")

    return <Stack
        direction='column'
        maxWidth='xs'
        spacing={2}
    >
        <TextField
            label="Room Code"
            variant="outlined"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCode(e.target.value)
            }}
        />
        <Button
            variant="outlined"
            onClick={() => {handleJoinRoom(code)}}
        >Join Room</Button>
    </Stack>
}

export default JoinRoom