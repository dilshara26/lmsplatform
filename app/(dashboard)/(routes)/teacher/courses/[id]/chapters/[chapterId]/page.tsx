"use client"
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import {
    ChapterTitleForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/chapters/[chapterId]/_components/chapter-title-form";
import {useQuery} from "@tanstack/react-query";
import {getCourse} from "@/lib/api/course";
import {getSelectedChapter} from "@/lib/api/chapter";
import toast from "react-hot-toast";
import {
    ChapterDescriptionForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/chapters/[chapterId]/_components/chapter-description";
import {
    ChapterAccessForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/chapters/[chapterId]/_components/chapter-access-form";




const ChapterIdPage =  ({
                                 params
                             }: {
    params: { id: string; chapterId: string }
}) => {

    const reqChap = {id:params.chapterId, courseId:params.id}

    const { isLoading, error, data:chapter, isError } = useQuery({queryKey:['Chapter',reqChap], queryFn:()=> getSelectedChapter(reqChap) })


    if(isLoading){
        return <div>Loading </div>
    }
    if(isError){
        toast.error("Error in Loading Chapters")
    }
    console.log(chapter)

    if (!chapter) {
        return redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {/*{!chapter.isPublished && (*/}
            {/*    <Banner*/}
            {/*        variant="warning"*/}
            {/*        label="This chapter is unpublished. It will not be visible in the course"*/}
            {/*    />*/}
            {/*)}*/}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.id}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
                            </div>
                            {/*<ChapterActions*/}
                            {/*    disabled={!isComplete}*/}
                            {/*    courseId={params.courseId}*/}
                            {/*    chapterId={params.chapterId}*/}
                            {/*    isPublished={chapter.isPublished}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.id}
                                chapterId={params.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.id}
                                chapterId={params.chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.id}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video
                            </h2>
                        </div>
                        {/*<ChapterVideoForm*/}
                        {/*    initialData={chapter}*/}
                        {/*    chapterId={params.chapterId}*/}
                        {/*    courseId={params.courseId}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChapterIdPage;