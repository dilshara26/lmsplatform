
import { currentUser } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {getUniqueCourse} from "@/Server/Handlers/ServerActions/Courses/course-query";
import {getUniquePurchase} from "@/Server/Handlers/ServerActions/Purchase/purchase-query";
import {db} from "@/lib/db";
import {
    createPurchaseCourseNoValidation,
} from "@/Server/Handlers/ServerActions/Purchase/purchase-commands";

export async function POST(req:Request,{params:{id:couresId}}:{params:{id:string}}){

    try{
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await getUniqueCourse(couresId,true)
        const purchase = await getUniquePurchase(user.id, couresId)

        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }
        const newPurchase = await createPurchaseCourseNoValidation(couresId, user.id)
        return NextResponse.json(newPurchase)
    }catch (e) {
        console.log("ERROR HAPPENED [CHECKOUT]")
        return NextResponse.error()
    }


}