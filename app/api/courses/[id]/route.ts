import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db"
import {revalidatePath} from "next/cache";

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

export async function PATCH (req:Request, { params:{id}}:{params:{id:string}} ){
    try{
        const {userId} = auth();
        const {title, description,imageUrl} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.updateMany({
            where:{id},
            data:{
                title: title,
                description:description,
                imageUrl:imageUrl
            }
        })
        return new NextResponse("Success")
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 503 });

    }

}