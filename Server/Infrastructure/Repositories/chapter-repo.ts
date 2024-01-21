import {db} from "@/lib/db";

export async function createNewChapter(courseId:string, title:string, newPos:number){
    const newChapter = await db.chapter.create({
        data:{
            courseId,
            title,
            position:newPos
        }
    })
    return newChapter
}

export async function findLastChapter(courseId:string){
    const chapterLast = await db.chapter.findFirst({
        where:{
            courseId
        },
        orderBy:{
            position:"desc"
        }
    })
    return chapterLast
}
