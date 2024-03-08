import { Person } from "@mui/icons-material"
import { Avatar, Box, Paper, Typography } from "@mui/material"
import { memo } from "react"

interface VoteListItem {
    player: string,
    icon?: string,
    voted: boolean
}

interface VoteListProps {
    items: VoteListItem[]
}

const VoteList = memo(({items}: VoteListProps) => {
    return <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
    >{items.map((v:VoteListItem) => <Paper
            variant="outlined"
            square
            style={{
                padding: "8px",
                display: "flex",
                flexDirection:"row",
                alignItems: "center",
                gap: "16px",
                minWidth: "250px"
            }}
        >
            <Avatar
                alt={v.player}
            ><Person/></Avatar>
            <Typography>{v.player}</Typography>
        </Paper>)
    }</Box>
})

export default VoteList