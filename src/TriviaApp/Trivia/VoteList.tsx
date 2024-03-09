import { Person } from "@mui/icons-material"
import { Avatar, Box, Icon, Paper, Typography } from "@mui/material"
import { memo } from "react"
import { numToAlpha } from "../../Util"
import { green } from "@mui/material/colors"

export interface VoteListItem {
    player: string,
    icon?: string,
    voted?: number
}

interface VoteListProps {
    items: VoteListItem[]
    reverse?:boolean
    color?:string
}


const VoteListElement = memo(({
    v,
    reverse=false,
    showAvatar=true,
    color=""
}: {v: VoteListItem, reverse?:boolean, showAvatar?: boolean, color?:string}) => <Paper
    variant="outlined"
    square
    style={{
        padding: "8px",
        display: "flex",
        flexDirection: reverse ? "row-reverse": "row",
        alignItems: "center",
        gap: "16px",
        minWidth: "250px"
    }}
>
    {showAvatar && <Avatar
        sx={{
            bgcolor: color
        }}
        alt={v.player}
    ><Person/></Avatar>}
    <Typography>{v.player}</Typography>
    <Box display="flex" flexDirection="row" justifyContent={reverse ? "flex-start" : "flex-end"} flexGrow={1}>
        {v.voted && <Avatar
            sx={{bgcolor: green[300]}}
        >{numToAlpha(v.voted)}</Avatar>}
    </Box>
</Paper>)

const VoteList = memo(({items, reverse=false, color}: VoteListProps) => {
    return <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
    >{
        items.length > 0 ? 
        items.map((v:VoteListItem, i:number) => <VoteListElement key={i} v={v} reverse={reverse} color={color}/>) :
            <VoteListElement v={{player:"No players"}} showAvatar={false}/>
    }</Box>
})

export default VoteList