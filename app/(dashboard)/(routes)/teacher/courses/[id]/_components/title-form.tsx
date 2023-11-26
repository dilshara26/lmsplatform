"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {updateCourse,getCourse} from "@/lib/api/course";

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

interface TitleFormProps{
    initialData:{
        title:string
    };
    courseId: string
}
const formSchema = z.object({
    title:z.string().min(1,{
        message:"Title is required"
    })
})

export const TitleForm =({initialData, courseId}:
    TitleFormProps
)=>{
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })


    const {mutateAsync:updateCourseMutation} = useMutation({
        mutationFn:updateCourse,
        onSuccess(data){
            toast.success('Title Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['CourseTitle'] })

        }
    })
    const[isEditing, setEditing] = useState(false)
    const toggleEdit=()=>{
        setEditing((current)=> !current)
    }
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:initialData
    })

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{

    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advanced web development'"
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