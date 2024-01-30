import { Box, Card, CardContent, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"

interface QuestionDisplayProps {
    q: string,
    a: string[]
}

const AlphabetUpper:string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
/*
Kahoot style question display main question in the center box, answers below
*/
const QuestionDisplay = ({
    q,
    a
}: QuestionDisplayProps) => {

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <Box>
            <Card>
                <CardContent>
                    <Typography textAlign="center">{q}</Typography>
                </CardContent>
            </Card>
        </Box>
        <Box
            sx={{
                width: "100%",
                alignSelf: "flex-start"
            }}
        >
            <List
                component="nav"
            >{a.map((v, i) => <ListItemButton
            >
                <ListItemText
                    key={i}
                    primary={`${AlphabetUpper[i]}) ${v}`}
                />
            </ListItemButton>)}</List>
        </Box>
    </Box>
}

export default QuestionDisplay