import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { Player } from "./TriviaGame"

interface TeamListCardProps {
    teamTitle: string,
    team: Player[],
    handleJoin?: ()=>void
}

const TeamListCard = ({teamTitle, team, handleJoin}: TeamListCardProps) => {
    return <Card sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%"
    }}>
        <CardContent>
            <Typography>{teamTitle}</Typography>
            <Box>{team.map((v, i) => {
                return <Typography key={i}>{v.name}</Typography>
            })}</Box>
        </CardContent>
        <CardActions>
            <Box justifyContent='center'>
                <Button onClick={handleJoin}>
                    Join Team
                </Button>
            </Box>
        </CardActions>
    </Card>
}

export default TeamListCard