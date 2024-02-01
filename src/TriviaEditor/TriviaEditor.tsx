/*

Helper for edit .trivia files which are just JSON files
See example.trivia for the format

This is a separate page from the game

*/

import { Box, Button, Container, CssBaseline, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { TriviaFileContentType } from "./TriviaFileContent"
import TriviaFileContentParser from "./TriviaFileContent"

export interface LoadedTriviaFile {
    name: string,
    sizeBytes: number,
    parsedData: TriviaFileContentType
}

const TriviaEditor = () => {

    const triviaFileInput = useRef<HTMLInputElement>(null)

    const [triviaData, setTriviaData] = useState<LoadedTriviaFile>()

    const [showRawFileData, setShowRawFileData] = useState<boolean>(false)
    

    const handleTriviaFileUpload = async () => {
        if (triviaFileInput.current && triviaFileInput.current.files && triviaFileInput.current.files.length >= 1) {
            const f = triviaFileInput.current.files[0]
            try {
                const jsonned = JSON.parse(await f.text())
                await TriviaFileContentParser(jsonned)
                setTriviaData({
                    name: f.name,
                    sizeBytes: f.size,
                    parsedData: jsonned as TriviaFileContentType
                })
            } catch(error:any) {
                alert("Could not parse .trivia file, bad format")
                console.error("Could not parse .trivia file, bad format", error)
            }
        } else {
            console.error("Could not find ref to file input or no files attached")
        }
    }

    return <Container
        component="main"
        sx={{
            backgroundColor: "azure",
            height: "100%"
        }}
    >
        <CssBaseline/>
        <Box>
            <Box
                display="flex"
                flexDirection="column"
            >
                <Box>
                    <Typography>Welcome to the editor!</Typography>
                    <Typography display={!triviaData ? "none" : "flex"}>File loaded: {triviaData?.name} ({triviaData?.sizeBytes} bytes)</Typography>
                </Box>

                {triviaData && <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Button 
                        variant="outlined"
                        sx={{maxWidth: "150px"}}
                        onClick={()=>setShowRawFileData(p => !p)}
                    >
                        {!showRawFileData ? "Show" : "Hide"} Raw
                    </Button>
                    {showRawFileData && <TextField
                        multiline
                        maxRows={16}
                        disabled
                        value={JSON.stringify(triviaData?.parsedData, undefined, 4)}
                    />}
                </Box>}
                
                <Box 
                    display="flex"
                    flexDirection="column"
                    marginY="16px"
                >

                    

                </Box>

                <Box display="flex" flexDirection="row">
                    <Button variant="outlined" sx={{marginRight: "24px"}}>Add Question</Button>
                    <Button 
                        variant="outlined"
                        component="label"
                    >
                        Load .trivia File
                        <input
                            type="file"
                            hidden
                            accept=".trivia"
                            ref={triviaFileInput}
                            onChange={handleTriviaFileUpload}
                        />
                    </Button>
                </Box>
            </Box>
        </Box>
    </Container>
}

export default TriviaEditor