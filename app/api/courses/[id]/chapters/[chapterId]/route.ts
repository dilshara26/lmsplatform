import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"
import { db } from "@/lib/db";

const {Video} = new Mux(
    process.env.MUX_Token_ID!,
    process.env.MUX_TOKEN_SECRET!
)

export async function PATCH(
    req: Request,
     { params: {id:courseId, chapterId}}:{params:{id:string, chapterId:string}}
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                ...values,
            }
        });
        // check for existing video assets
        if(values.videoUrl){
            const existingVideo = await db.muxData.findFirst({
                where:{
                    chapterId
                }
            })
            if(existingVideo){
                await Video.Assets.del(existingVideo.assetId)
                await db.muxData.delete({
                    where:{
                        id: existingVideo.id
                    }
                })
            }
            const asset = await Video.Assets.create({
                input:values.videoUrl,
                playback_policy: "public",
                test: false,
            })

            const newVideo = await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }


        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}
export async function GET (req:Request, {params:{id:courseId, chapterId}}:{params:{id:string, chapterId:string}}) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            },
            include: {
                muxData: true,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params:{id:courseId, chapterId} }: { params: { id: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
