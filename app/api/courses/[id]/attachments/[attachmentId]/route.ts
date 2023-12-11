import {db} from "@/lib/db";
import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function DELETE(
    req:Request, { params:{id:cId, attachmentId}}:{params:{id:string, attachmentId:string}}
){
    try{
        const user = auth();
        console.log(user)
        if(!user.userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: cId,
                userId: user.userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.attachment.delete({
            where:{
                id:attachmentId
            }
        })
        return NextResponse.json(course)
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
