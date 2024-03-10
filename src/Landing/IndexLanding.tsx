import { Box, Container, CssBaseline, Link, ThemeProvider, Typography, createTheme } from "@mui/material"

const defaultTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const IndexLandingPage = () => {
    return <Box
        display="flex"
        flexDirection="row"
        height="100vh"
    >
        <Box display="flex" flexGrow={1} flexDirection="column">
            <Box display="flex" flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center">
                <Container><Typography variant="h1" align="left">Trivia Game</Typography></Container>
            </Box>
            <Box flexGrow={3}>
                <Container sx={{display: "flex", flexDirection:"column", gap: "5vh"}}>
                    <Link underline="hover" variant="h5" align="left">About</Link>
                    <Link underline="hover" variant="h5" align="left">Feedback</Link>
                </Container>
            </Box>
        </Box>

        <Box display="flex" flexGrow={3} minWidth="75vw">
            <Container sx={{backgroundColor: defaultTheme.palette.primary.light}}>

            </Container>
        </Box>
    </Box>
}

const IndexLandingPageWrapper = () => {
    return <ThemeProvider theme={defaultTheme}>
        <Box component="main">
            <CssBaseline/>
            <IndexLandingPage/>
        </Box>
    </ThemeProvider>
}

export default IndexLandingPageWrapper