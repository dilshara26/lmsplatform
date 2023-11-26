import {z} from "zod";

export const createCourseDTO = z.object({
    title: z.string().min(1, {message: "Title is required"}),
})

export const getCourseDTO = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
    price: z.number().nullable(),
    isPublished: z.boolean().nullable(),
    categoryId: z.string().nullable(),
    updatedAt: z.string().nullable(),
    createdAt: z.string().nullable(),
})

