import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(
    req:Request,{ params:{id:courseId}}:{params:{id:string}}
){
    try {
        const {userId} = auth();
        const {title} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        const course = await db.course.findUnique({
            where:{
                id: courseId,
                userId
            }
        })
        if(!course){
            return new NextResponse("Unauthorized",{status:401})

        }
        const chapterLast = await db.chapter.findFirst({
            where:{
                courseId
            },
            orderBy:{
                position:"desc"
            }
        })
        const newPos = chapterLast? chapterLast.position +1: 1
        const newChapter = await db.chapter.create({
            data:{
                courseId,
                title,
                position:newPos
            }
        })
        return NextResponse.json(newChapter);

    }catch (error){
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}