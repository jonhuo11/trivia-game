/*
Uses zod to perform type checks
http://zod.dev
*/

import {z} from "zod"


const TriviaAnswer = z.object({
    a: z.string(),
    correct: z.boolean().optional()
})

const TriviaQuestion = z.object({
    q: z.string(),
    a: TriviaAnswer.array()
})

const TriviaFileContent = z.object({
    questions: TriviaQuestion.array()
})

const TriviaFileContentParser = TriviaFileContent.parseAsync

export default TriviaFileContentParser

export type TriviaFileContentType = z.infer<typeof TriviaFileContent>

export type TriviaQuestionType = z.infer<typeof TriviaQuestion>

export type TriviaAnswerType = z.infer<typeof TriviaAnswer>