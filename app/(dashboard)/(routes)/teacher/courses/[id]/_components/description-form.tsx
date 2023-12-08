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
import {Pencil} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {getCourseDTO} from "@/Server/Domain/DTO/course";


interface DescriptionFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    description:z.string().min(1,{
        message:"Title is required"
    })
})

export const DescriptionForm =({initialData, courseId}:
                             DescriptionFormProps
)=>{
    const queryClient = useQueryClient();
    const router = useRouter()
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })


    const updateCourseMutation= useMutation({
        mutationFn:updateCourse,
        onSuccess(data){
            toast.success('Description Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['CourseTitle'] })
        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const[isEditing, setEditing] = useState(false)
    const toggleEdit=()=>{
        setEditing((current)=> !current)
    }
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            description: initialData?.description || ""
        },
    })

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {description} = values;
        const {title} = initialData
        const mutateVal = { title,description, courseId}
        updateCourseMutation.mutate(mutateVal)
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {initialData.description || "No Description Found"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This course is about ....' "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )

}