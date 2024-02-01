
import { Add, Delete } from "@mui/icons-material"
import { Box, Button, TextField } from "@mui/material"
import { TriviaAnswerType } from "./TriviaFileContentTypes"

interface TriviaQuestionAnswerEditorProps {
    index: number,
    q: string,
    a: TriviaAnswerType[],
    handleAddAnswer?: () => void
    handleDeleteAnswer?: (i: number) => void
}

const TriviaQuestionAnswerEditor = ({
    index,
    q,
    a,
}: TriviaQuestionAnswerEditorProps) => {
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
            defaultValue={q}
        />
        <Box
            paddingLeft="32px"
            paddingY="8px"
            display="flex"
            flexDirection="column"
            gap="8px"
        >{a.map((v, i) => <Box
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
            />
            <Box 
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                minWidth="200px"
                flexGrow={1}
            >
                <Button
                    variant="outlined"
                    size="small"
                    color={v.correct ? "success" : "error"}
                    sx={{
                        flexGrow: 1
                    }}
                >{v.correct ? "Correct" : "Wrong"}</Button>
                <Button variant="outlined" endIcon={<Delete/>} size="small">
                    Delete
                </Button>
            </Box>
        </Box>)}</Box>
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
        >
            <Button
                variant="outlined"
                startIcon={<Add/>}
            >Add Answer</Button>
        </Box>
    </Box>
}

export default TriviaQuestionAnswerEditor