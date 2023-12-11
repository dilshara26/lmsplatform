import {z} from "zod";

export const getAttachment = z.object({
    id:z.string(),
    name:z.string(),
    url:z.string(),
    courseId:z.string()
})

export const createOneAttachment = z.object({
    url:z.string(),
    courseId:z.string(),
})

export const deleteOneAttachment = z.object({
    id:z.string(),
    courseId:z.string()
})

