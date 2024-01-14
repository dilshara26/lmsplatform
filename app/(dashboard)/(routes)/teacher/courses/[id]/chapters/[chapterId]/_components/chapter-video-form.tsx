"use client";

import * as z from "zod";
import axios from "axios";

import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {updateChapter} from "@/lib/api/chapter";
import {getChapter} from "@/Server/Domain/DTO/chapter";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
    initialData: z.infer<typeof getChapter >;
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
                                     initialData,
                                     courseId,
                                     chapterId,
                                 }: ChapterVideoFormProps) => {
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const editChapterOrderMutation = useMutation({
        mutationFn:updateChapter,
        onSuccess(){
            toast.success("Chapter Video Successfully Added")

            queryClient.invalidateQueries({queryKey:['Chapters']})

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const onSubmit =(values: z.infer<typeof formSchema>) => {
        const {videoUrl} = values
        const mutateVal = {id:initialData.id, title:initialData.title, videoUrl,courseId:initialData.courseId}
        editChapterOrderMutation.mutate(mutateVal)

        router.refresh();

    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
    )
}