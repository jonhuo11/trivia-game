import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"

interface QuestionDisplayProps {
    q: string,
    a: string[]
}

/*
Kahoot style question display main question in the center box, answers below
*/
const QuestionDisplay = ({
    q,
    a
}: QuestionDisplayProps) => {

    return <Box>
        <Box>
            <Typography>q</Typography>
        </Box>
        <Box>
            <List
                component="nav"
            >{a.map((v, i) => <ListItemButton
            >
                <ListItemText
                    key={i}
                    primary={v}
                />
            </ListItemButton>)}</List>
        </Box>
    </Box>
}

export default QuestionDisplay