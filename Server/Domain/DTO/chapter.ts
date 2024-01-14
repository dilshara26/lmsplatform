import {z} from "zod";
import {getMuxData} from "@/Server/Domain/DTO/muxData";



export const  getChapter  = z.object({
    id:z.string(),
    title:z.string(),
    description:z.string().nullable(),
    videoUrl:z.string().nullable(),
    position:z.number(),
    isPublished:z.boolean(),
    isFree:z.boolean(),
    courseId:z.string(),
    createdAt:z.string(),
    updatedAt:z.string(),
    muxData: getMuxData.nullable()
})

export const getChapterParams= z.object({
    courseId:z.string(),
    id:z.string()
})

export const createOneChapter= z.object({
    title:z.string(),
    description:z.string().optional(),
    videoUrl:z.string().optional(),
    courseId:z.string(),

})

export const updateOneChapter = z.object({
    id: z.string(),
    position: z.number(),
    courseId:z.string().optional()
})

export const editChapter= z.object({
    id:z.string(),
    title:z.string(),
    courseId:z.string(),
    description:z.string().optional(),
    videoUrl:z.string().optional(),
    isPublished:z.boolean().optional(),
    isFree:z.boolean().optional()
})
