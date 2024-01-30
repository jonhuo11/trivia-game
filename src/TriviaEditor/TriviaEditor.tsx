/*

Helper for edit .trivia files which are just JSON files
See example.trivia for the format

This is a separate page from the game

*/

import { Box, Button, Container, CssBaseline, Typography } from "@mui/material"

const TriviaEditor = () => {
    return <Container
        component="main"
        sx={{
            backgroundColor: "azure",
            height: "100%"
        }}
    >
        <CssBaseline/>
        <Box>
            <Box>
                <Typography>Welcome to the editor!</Typography>

                <Box>
                    <Button>Add Question</Button>
                </Box>
            </Box>
        </Box>
    </Container>
}

export default TriviaEditor