"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createCourse} from "@/lib/api/course";
import {updateProgress} from "@/lib/api/progress";


interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
};

export const CourseProgressButton = ({
                                         chapterId,
                                         courseId,
                                         isCompleted,
                                         nextChapterId
                                     }: CourseProgressButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {mutate:updateProgressMutation} = useMutation({
        mutationFn: updateProgress,
        onSuccess(data){
            toast.success("Progress Updated")
        },
        onError:()=>{
            toast.error("Error Happened")
        }

    })
    const onClick = async () => {
        try {
            setIsLoading(true);
            isCompleted = !isCompleted
            const mutateVal = {courseId,chapterId,isCompleted}
            updateProgressMutation(mutateVal)

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not completed" : "Mark as complete"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    )
}