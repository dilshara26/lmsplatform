import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {createNewChapter, findLastChapter} from "@/Server/Infrastructure/Repositories/chapter-repo";

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
        const chapterLast = await findLastChapter(courseId)
        const newPos = chapterLast? chapterLast.position +1: 1
        const newChapter = await createNewChapter(courseId,title,newPos)
        return NextResponse.json(newChapter);

    }catch (error){
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}