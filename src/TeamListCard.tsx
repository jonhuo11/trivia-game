import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material"

interface TeamListCardProps {
    teamTitle: string
}

const TeamListCard = ({teamTitle}: TeamListCardProps) => {
    return <Card>
        <CardContent>
            <Typography>{teamTitle}</Typography>
        </CardContent>
        <CardActions>
            <Box justifyContent='center'>
                <Button>
                    Join Team
                </Button>
            </Box>
        </CardActions>
    </Card>
}

export default TeamListCard