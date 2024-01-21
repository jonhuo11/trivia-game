import { Box, IconButton, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { RoomStateContext } from "./Room"
import { Visibility, VisibilityOff } from "@mui/icons-material"

interface ChatProps {
    onChatSend: (msg:string)=>void
}

const Chat = ({
    onChatSend
}: ChatProps) => {
    const roomState = useContext(RoomStateContext)
    const [msg, setMsg] = useState("")
    const [hide, setHide] = useState(false)

    return <Box
        display="flex" 
        flexDirection="column"
        border='1px solid black'
        width="max-content"
        maxWidth="30vw"
    >
        <IconButton
            sx={{
                position: !hide ? "absolute" : "relative",
                top: 0,
                right: 0
            }}
            onClick={() => setHide(v => !v)}
        >{hide ? <Visibility/> : <VisibilityOff/>}</IconButton>
        {!hide && <>
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
        </>}
    </Box>
}

export default Chat