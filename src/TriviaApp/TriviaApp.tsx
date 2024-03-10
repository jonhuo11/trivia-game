import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Room from './Room/Room'

const defaultTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

function TriviaApp() {
    return (<>
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline/>
                <Room/>
            </Container>
        </ThemeProvider>
    </>)
}

export default TriviaApp
