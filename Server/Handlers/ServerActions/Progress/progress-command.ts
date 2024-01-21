import {db} from "@/lib/db";

export async function updateProgress(userId:string , chapterId:string, isCompleted:boolean){
    const userProgress = await db.userProgress.upsert({
        where: {
            userId_chapterId: {
                userId,
                chapterId: chapterId,
            }
        },
        update: {
            isCompleted
        },
        create: {
            userId,
            chapterId: chapterId,
            isCompleted,
        }
    })

    return userProgress
}