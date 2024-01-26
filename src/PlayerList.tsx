import { Card, CardContent, Grid, Typography } from "@mui/material"
import TeamListCard from "./TeamListCard"

interface PlayerListProps {
    blue: string[]
    red: string[]
    handleClickBlueTeam?: ()=>void
    handleClickRedTeam?: ()=>void
}

const PlayerList = ({
    blue,
    red,
    handleClickBlueTeam,
    handleClickRedTeam
}: PlayerListProps) => {
    return <Grid
        container
        sx={{flexGrow:1}}
        spacing={2}
        direction='row'
        justifyContent='center'
        alignItems='center'
    >
        <Grid item xs={6}>
            <TeamListCard teamTitle="Blue Team" team={blue} handleJoin={handleClickBlueTeam}/>
        </Grid>
        <Grid item xs={6}>
            <TeamListCard teamTitle="Red Team" team={red} handleJoin={handleClickRedTeam}/>
        </Grid>
    </Grid>
}

export default PlayerList