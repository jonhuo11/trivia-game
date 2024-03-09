import { Card, CardContent, Grid, Typography } from "@mui/material"
import TeamListCard from "./TeamListCard"
import { TriviaPlayer } from "./TriviaGame"
import { memo, useMemo } from "react"

interface TeamsListProps {
    blue: string[]
    red: string[]
    handleClickBlueTeam?: ()=>void
    handleClickRedTeam?: ()=>void
}

const TeamsList = memo(({
    blue,
    red,
    handleClickBlueTeam,
    handleClickRedTeam
}: TeamsListProps) => {
    return <Grid
        container
        sx={{
            flexGrow:1,
            //border: "1px solid black"
        }}
        spacing={2}
        direction='row'
        justifyContent='center'
        alignItems='top'
    >
        <Grid item xs={6}>
            <TeamListCard teamTitle="Blue Team" team={blue} handleJoin={handleClickBlueTeam}/>
        </Grid>
        <Grid item xs={6}>
            <TeamListCard teamTitle="Red Team" team={red} handleJoin={handleClickRedTeam}/>
        </Grid>
    </Grid>
})

export default TeamsList