"use client";


import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {publishChapter, unPublishChapter, updateChapter} from "@/lib/api/chapter";
import {deleteCourse, publishCourse, unPublishCourse} from "@/lib/api/course";

interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

export const CourseActions = ({
                                   disabled,
                                   courseId,
                                   isPublished
                               }: CourseActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient()
    const publishCourseMutation = useMutation({
        mutationFn:publishCourse,
        onSuccess(){
            toast.success("Course Published Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const unPublishCourseMutation = useMutation({
        mutationFn:unPublishCourse,
        onSuccess(){
            toast.success("Course Unpublished Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })

    const deleteCourseMutation = useMutation({
        mutationFn:deleteCourse,
        onSuccess(){
            router.refresh()
            router.push(`/teacher/courses/`);
            toast.success("Course Deleted Successfully")

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })

    const onClick = () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                unPublishCourseMutation.mutate(courseId)
                // await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                // toast.success("Chapter unpublished");
            } else {
                // await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                // toast.success("Chapter published");
                publishCourseMutation.mutate(courseId)
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
            setIsLoading(true);
            deleteCourseMutation.mutate(courseId)

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