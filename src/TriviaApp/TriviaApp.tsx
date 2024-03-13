import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Room from './Room/Room'

export const defaultTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

function TriviaApp() {
    return (<>
        <ThemeProvider theme={defaultTheme}>
            <Box component="main" height="100vh">
                <CssBaseline/>
                <Room/>
            </Box>
        </ThemeProvider>
    </>)
}

export default TriviaApp
