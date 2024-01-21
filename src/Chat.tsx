import { Box, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { RoomStateContext } from "./Room"

interface ChatProps {
    onChatSend: (msg:string)=>void
}

const Chat = ({
    onChatSend
}: ChatProps) => {
    const roomState = useContext(RoomStateContext)
    const [msg, setMsg] = useState("")

    return <Box
        display="flex" 
        flexDirection="column"
        border='1px solid black'
        width="max-content"
        maxWidth="30vw"
    >
        <Box minHeight='32px'>
            {roomState.chat && roomState.chat.map((v, i) => <Typography key={i}>{v}</Typography>)}
        </Box>
        <Box>
            <TextField
                label="Chat"
                size='small'
                variant='standard'
                value={msg}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setMsg(e.target.value)
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        onChatSend(msg)
                        setMsg("")
                    }
                }}
            />
        </Box>
    </Box>
}

export default Chat