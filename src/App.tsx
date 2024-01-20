import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Room from './Room'

const defaultTheme = createTheme()

function App() {
    return (<>
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline/>
                <Room/>
            </Container>
        </ThemeProvider>
    </>)
}

export default App
