import {z} from "zod";

export const updateProgressDto = z.object({
    courseId:z.string(),
    chapterId:z.string(),
    isCompleted:z.boolean()
})