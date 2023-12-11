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
import {Combobox} from "@/components/ui/combobox";


interface CategoryFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    categoryId:z.string().min(1,{
        message:"Title is required"
    })
})

export const CategoryForm =({initialData, courseId}:
                                   CategoryFormProps
)=>{

    const queryClient = useQueryClient();

    const cat = useQuery({queryKey:['Category'], queryFn:()=> getCategories() })
    const[isEditing, setEditing] = useState(false)
    const updateCourseMutation= useMutation({
        mutationFn:updateCourse,
        onSuccess(data){
            toast.success('Category Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['Course'] })
        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })


    const toggleEdit=()=>{
        setEditing((current)=> !current)
    }
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            categoryId: initialData?.categoryId || ""
        },
    })
    if(cat.isPending){
        return <span>Loading Category...</span>
    }

    const options = cat?.data||[]

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {categoryId} = values;
        const {title} = initialData
        const mutateVal = { title,categoryId, courseId}
        updateCourseMutation.mutate(mutateVal)

    }
    const selectedOption = options.find((option) => option.id === initialData.categoryId);

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOption?.name || "No Category Found"}
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox options={...options} {...field}  />
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