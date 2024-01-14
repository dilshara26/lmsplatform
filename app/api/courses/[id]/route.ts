import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {db} from "@/lib/db"
import {revalidatePath} from "next/cache";
import Mux from "@mux/mux-node";
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

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
            where:{
                id:id,
                userId:user.userId
            },
            include:{
                attachments:{
                    orderBy:{
                        createdAt: "desc"
                    }
                },
                chapters:{
                    orderBy: {
                        position:"asc"
                    },
                    include: {
                        muxData: true
                    }
                }
            }
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
        const {title, description,imageUrl,categoryId,price} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.updateMany({
            where:{id},
            data:{
                title: title,
                description:description,
                imageUrl:imageUrl,
                categoryId:categoryId,
                price:price
            }

        })
        return new NextResponse("Success")
    }catch (e){
        console.log("[COURSES ID]", e);
        return new NextResponse("Internal Error", { status: 503 });

    }

}

export async function DELETE(
    req: Request,
    { params:{id:courseId} }: { params: { id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id:courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

