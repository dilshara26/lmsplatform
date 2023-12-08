import {z} from "zod";

export const createCourseDTO = z.object({
    title: z.string().min(1, {message: "Title is required"}),
    description: z.string().optional(),
    imageUrl:z.string().optional()
})

export const getCourseDTO = z.object({

    id: z.string(),
    userId:z.string(),
    title: z.string(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
    price: z.number().nullable(),
    isPublished: z.boolean(),
    categoryId: z.string().nullable(),
    updatedAt: z.string(),
    createdAt: z.string(),
})

