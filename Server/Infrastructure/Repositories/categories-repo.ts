import {db} from "@/lib/db";

export async function getAllCategories(){
    const categories = await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    })
    return categories
}