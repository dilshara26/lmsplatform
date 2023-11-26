import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db"

export async function GET(
    req:Request, { params:{id}}:{params:{id:string}}
){
    try{
        const user = auth();
        console.log(user)
        if(!user.userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.findUnique({
            where:{id}
        })
        return NextResponse.json(course)
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req:Request, { params:{id}}:{params:{id:string}} ){
    try{
        const {userId} = auth();
        const {title} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.updateMany({
            where:{id},
            data:{
                title: title
            }
        })
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 500 });

    }

}