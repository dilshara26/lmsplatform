"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {updateCourse,getCourse} from "@/lib/api/course";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {useState} from "react";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";
import toast from "react-hot-toast";

import {FileUpload} from "@/components/file-upload";
import {getCourseDTO} from "@/Server/Domain/DTO/course";


interface ImageFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    imageUrl:z.string().min(1,{
        message:"Image is required"
    })
})

export const ImageForm =({initialData, courseId}:
                                   ImageFormProps
)=>{
    const queryClient = useQueryClient();
    const router = useRouter()
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })


    const updateCourseMutation= useMutation({
        mutationFn:updateCourse,
        onSuccess(data){
            toast.success('Image Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['Course'] })
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
            imageUrl: initialData?.imageUrl || ""
        },
    })

    const {isSubmitting,isValid} = form.formState

    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {imageUrl} = values;
        const {title} = initialData
        const mutateVal = { title,imageUrl, courseId}
        updateCourseMutation.mutate(mutateVal)

    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Image
                        </>
                    )
                    }
                    {!isEditing && initialData.imageUrl &&(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Edit Image
                        </>
                    )

                    }
                </Button>
            </div>
            {!isEditing && ( !initialData.imageUrl? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ):(
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>

                )

            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )

}