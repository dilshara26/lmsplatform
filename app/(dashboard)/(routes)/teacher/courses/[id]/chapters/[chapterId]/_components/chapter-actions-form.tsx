"use client";


import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteChapter, publishChapter, unPublishChapter, updateChapter} from "@/lib/api/chapter";
import {deleteCourse} from "@/lib/api/course";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
};

export const ChapterActions = ({
                                   disabled,
                                   courseId,
                                   chapterId,
                                   isPublished
                               }: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient()
    const publishChapterMutation = useMutation({
        mutationFn:publishChapter,
        onSuccess(){
            toast.success("Chapter Published Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const unPublishChapterMutation = useMutation({
        mutationFn:unPublishChapter,
        onSuccess(){
            toast.success("Chapter Unpublished Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const deleteChapterMutation = useMutation({
        mutationFn:deleteChapter,
        onSuccess(){
            toast.success("Course Deleted Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })

    const onClick = () => {
        try {
            setIsLoading(true);
            const mutateVal = {id:chapterId, courseId}

            if (isPublished) {
                unPublishChapterMutation.mutate(mutateVal)
                // await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                // toast.success("Chapter unpublished");
            } else {
                // await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                // toast.success("Chapter published");
                publishChapterMutation.mutate(mutateVal)
            }
            queryClient.invalidateQueries({queryKey:['Chapters']})

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            const mutateVal = {id:chapterId, courseId}
            setIsLoading(true);
            deleteChapterMutation.mutate(mutateVal)
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}