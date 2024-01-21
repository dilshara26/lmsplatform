import {db} from "@/lib/db";

export async function getUniquePurchase(userId:string,courseId:string ){
    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: userId,
                courseId: courseId
            }
        }
    });
    return purchase
}