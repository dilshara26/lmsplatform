import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET(
){
    try{
        const user = auth();
        console.log(user)
        if(!user.userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const cat = await db.category.findMany({
            orderBy:{
                name:"asc"
            }
        })
        return NextResponse.json(cat)
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}