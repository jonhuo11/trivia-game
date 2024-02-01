/*
Uses zod to perform type checks
http://zod.dev
*/

import {z} from "zod"

const TriviaFileContent = z.object({
    questions: z.object({
        q: z.string(),
        a: z.object({
            a: z.string(),
            correct: z.boolean().optional()
        }).array()
    }).array()
})

const TriviaFileContentParser = TriviaFileContent.parseAsync

export default TriviaFileContentParser

export type TriviaFileContentType = z.infer<typeof TriviaFileContent>