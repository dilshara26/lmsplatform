import {db} from "@/lib/db";

export async function createPurchaseCourseNoValidation(courseId:string, userId:string){
    const newPurchase = await db.purchase.create({
        data:{
            userId,
            courseId
        }
    })
    return newPurchase
}