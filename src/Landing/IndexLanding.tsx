import { Box, Container, CssBaseline, Link, ThemeProvider, Typography, createTheme, useMediaQuery } from "@mui/material"
import { ReactNode } from "react"

const defaultTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const BigLink = (props: {children: string, link:string}) => {
    return <Link href={props.link} underline="hover" variant="h3" align="left">{props.children}</Link>
}

const IndexLandingPage = () => {

    //const isDesktop = useMediaQuery(defaultTheme.breakpoints.up('md'))

    return <Box
        display="flex"
        flexDirection="row"
        height="100vh"
    >
        <Box 
            display="flex"
            flexGrow={1}
            flexDirection="column"
        >
            <Box display="flex" flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center">
                <Container><Typography variant="h1" align="left">Trivia Game</Typography></Container>
            </Box>
            <Box flexGrow={3}>
                <Container sx={{display: "flex", flexDirection:"column", gap: "5vh"}}>
                    <BigLink link="/play">Play</BigLink>
                    <BigLink link="/play">About</BigLink>
                    <BigLink link="/play">Contact</BigLink>
                </Container>
            </Box>
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