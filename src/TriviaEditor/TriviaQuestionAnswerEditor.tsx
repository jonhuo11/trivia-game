
import { Add, Delete } from "@mui/icons-material"
import { Box, Button, TextField } from "@mui/material"
import { TriviaAnswerType, TriviaQuestionType } from "./TriviaFileContentTypes"
//import { forwardRef, useImperativeHandle } from "react"

interface TriviaQuestionAnswerEditorProps {
    index: number,
    q: string,
    a: TriviaAnswerType[],
    handleUpdateTriviaQA?: (qi:number, q:TriviaQuestionType) => void,
    handleDeleteQA?: (qi:number) => void,
}

/*
export interface TriviaQAEditorHandle {
    // returns data needed to update the question in triviaData
    collect: () => TriviaQuestionType
}*/

const TriviaQuestionAnswerEditor = (
    {
        index,
        q,
        a,
        handleUpdateTriviaQA,
        handleDeleteQA
    }: TriviaQuestionAnswerEditorProps
) => {

    // useImperativeHandle(ref, () => {
    //     return {
    //         collect() {
    //             console.log("collect!")
    //             return {
    //                 q: "temp",
    //                 a: []
    //             }
    //         }
    //     }
    // }, [])

    return <Box 
        display="flex"
        flexDirection="column"
        flexGrow={1}
        padding="16px"
        border="1px solid black"
        borderRadius="8px"
        gap="4px"
    >
        <TextField 
            label={`Question ${index}`}
            fullWidth
            size="small"
            value={q}
            onChange={(evt) => {
                if (!handleUpdateTriviaQA) return
                handleUpdateTriviaQA(index, {
                    q: evt.target.value,
                    a: a
                })
            }}
        />
        <Box
            paddingLeft="32px"
            paddingY="8px"
            display="flex"
            flexDirection="column"
            gap="8px"
        >{a.map((v, i) => <Box
            key={i}
            display="flex"
            flexDirection="row"
            gap="4px"
        >
            <TextField
                key={i}
                label={`Answer ${i}`}
                fullWidth
                size="small"
                defaultValue={v.a}
                onChange={evt => {
                    if (!handleUpdateTriviaQA) return
                    const clone = {
                        q: q,
                        a: [...a]
                    }
                    clone.a[i].a = evt.target.value
                    handleUpdateTriviaQA(index, clone)
                }}
            />
            <Box 
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                minWidth="180px"
                flexGrow={1}
                flexShrink={1}
            >
                <Button
                    variant="outlined"
                    size="small"
                    color={v.correct ? "success" : "error"}
                    sx={{
                        flexGrow: 1
                    }}
                    onClick={_evt => {
                        if (!handleUpdateTriviaQA) return
                        const clone = {
                            q: q,
                            a: [...a]
                        }
                        clone.a[i].correct = !clone.a[i].correct
                        handleUpdateTriviaQA(index, clone)
                    }}
                >{v.correct ? "Correct" : "Wrong"}</Button>
                <Button variant="outlined" endIcon={<Delete/>} size="small" onClick={()=>{
                    // delete answer
                    if (!handleUpdateTriviaQA) return
                    const clone = {
                        q: q,
                        a: [...a]
                    }
                    clone.a.splice(i)
                    handleUpdateTriviaQA(index, clone)
                }}>
                    Delete
                </Button>
            </Box>
        </Box>)}</Box>
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            gap="8px"
        >
            <Button
                variant="outlined"
                startIcon={<Add/>}
                onClick={() => {
                    // add answer
                    if (!handleUpdateTriviaQA) return
                    const clone = {
                        q: q,
                        a: [...a, {
                            a: "New answer",
                            correct: false
                        }]
                    }
                    handleUpdateTriviaQA(index, clone)
                }}
            >Add Answer</Button>
            <Button
                variant="outlined"
                startIcon={<Delete/>}
                onClick={() => {
                    // delete question
                    if (handleDeleteQA) handleDeleteQA(index)
                }}
            >Delete</Button>
        </Box>
    </Box>
}

export default TriviaQuestionAnswerEditor