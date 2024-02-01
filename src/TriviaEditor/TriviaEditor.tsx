/*

Helper for edit .trivia files which are just JSON files
See example.trivia for the format

This is a separate page from the game

*/

import { Box, Button, Container, CssBaseline, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { TriviaFileContentType } from "./TriviaFileContent"
import TriviaFileContentParser from "./TriviaFileContent"
import TriviaQuestionAnswerEditor from "./TriviaQuestionAnswerEditor"
import { Add, UploadFile } from "@mui/icons-material"

export interface LoadedTriviaFile {
    name: string,
    sizeBytes: number,
    parsedData: TriviaFileContentType
}

const NewDefaultLoadedTriviaFile:LoadedTriviaFile = {
    name: "new_trivia_set.trivia",
    sizeBytes: 0,
    parsedData: {
        questions: [
            {
                q: "New Question",
                a: []
            }
        ]
    }
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

    const addQuestion = () => {
        // if empty loaded trivia file, create new
        // if not empty, edit existing
        if (!triviaData) {
            setTriviaData(NewDefaultLoadedTriviaFile)
        } else {
            setTriviaData(p => {if (p) { return {
                ...p,
                parsedData: {
                    questions: [
                        ...p.parsedData.questions,
                        {
                            q: "a",
                            a: []
                        }
                    ]
                }
            }}})
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
                    <Button 
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFile/>}
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
                    gap="16px"
                    padding="8px"
                    border="1px solid black"
                    borderRadius="8px"
                >{triviaData && <>
                    <Typography variant="h4">Question editor</Typography>

                    {triviaData.parsedData.questions.map((v, i) => {
                        return <TriviaQuestionAnswerEditor
                            key={i}
                            index={i}
                            q={v.q}
                            a={v.a}
                        />
                    })}</>
                }</Box>

                <Box display="flex" flexDirection="column" gap="24px">
                    <Button
                        variant="outlined"
                        startIcon={<Add/>}
                        onClick={addQuestion}
                    >{!triviaData ? "Create New Question Set" : "Add Question"}</Button>
                </Box>
            </Box>
        </Box>
    </Container>
}

export default TriviaEditor