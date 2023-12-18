"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {updateCourse,getCourse} from "@/lib/api/course";
import { useRouter } from "next/navigation";




import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useState} from "react";
import {Loader2, Pencil, PlusCircle} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {getCourseDTO} from "@/Server/Domain/DTO/course";
import {getCategories} from "@/lib/api/category";
import {createChapter, reOrderChapters} from "@/lib/api/chapter";
import {ChaptersList} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/chapter-list";
import {updateOneChapter} from "@/Server/Domain/DTO/chapter";


interface ChapterFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    title:z.string().min(1,{
        message:"Title is required"
    })
})

export const ChapterForm =({initialData, courseId}:
                                   ChapterFormProps
)=>{
    const queryClient = useQueryClient();
    const router = useRouter()
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const createChaptereMutation= useMutation({
        mutationFn:createChapter,
        onSuccess(data){
            toast.success('Chapter Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['CourseTitle'] })
        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })

    const updateChapterOrderMutation = useMutation({
        mutationFn:reOrderChapters,
        onSuccess(){
            toast.success("Chapters Successfully Reordered")
            setIsUpdating(false);
        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const toggleCreate=()=>{
        setIsCreating((current)=> !current)
    }
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            title: ""
        },
    })

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {title} = values;
        const mutateVal = { title, courseId}
        createChaptereMutation.mutate(mutateVal)
    }

    const onReorder = async (updateData:z.infer<typeof updateOneChapter>[])=>{
        setIsUpdating(true);
        updateChapterOrderMutation.mutate(updateData)
    }
    const onEdit =  (id:string)=>{
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreate} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                        courseId={courseId}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}