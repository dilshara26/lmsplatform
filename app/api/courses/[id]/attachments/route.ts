import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET(
    req:Request, { params:{id}}:{params:{id:string}}
){
    try{
        const user = auth();
        console.log(user)
        if(!user.userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.attachment.findMany({
            where:{
                courseId:id
            }
        })
        return NextResponse.json(course)
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST (req:Request, { params: { id: cId } }: { params: { id: string } }){
    try{
        const {userId} = auth();
        const {url,courseId } = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        console.log("params are below")
        console.log(cId)
        const courseOwner = await db.course.findUnique({
            where: {
                id: cId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }



        const attachment = await db.attachment.create({
            data:{
                url,
                name: url.split("/").pop(),
                courseId:courseId
            }
        })

        return new NextResponse("Success")
    }catch (e){
            console.log("[ATTACHMENT ID]", e);
        return new NextResponse("Internal Error", { status: 503 });

    }

}