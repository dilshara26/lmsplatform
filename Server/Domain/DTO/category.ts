import {z} from "zod";


export const getCategory = z.object({
    id: z.string(),
    name:z.string(),
})
export const getAllCategories= z.array(getCategory)