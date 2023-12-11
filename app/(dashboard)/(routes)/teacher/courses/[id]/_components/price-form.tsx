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
import {getCategories} from "@/lib/api/category";
import {formatPrice} from "@/lib/format";


interface PriceFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    price:z.coerce.number()
})

export const PriceForm =({initialData, courseId}:
                                   PriceFormProps
)=>{
    const queryClient = useQueryClient();
    const router = useRouter()
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })

    const updateCourseMutation= useMutation({
        mutationFn:updateCourse,
        onSuccess(data){
            toast.success('Price Updated Successfully')
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
            price: initialData?.price || undefined
        },
    })

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {price} = values;
        const {title} = initialData
        const mutateVal = { title,price, courseId}
        updateCourseMutation.mutate(mutateVal)
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {initialData.price? formatPrice(initialData.price): "No Price Found"}
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder="e.g. '3000 LKR' "
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