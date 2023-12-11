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
import {ImageIcon, Pencil, PlusCircle, File, X, Loader2} from "lucide-react";
import toast from "react-hot-toast";

import {FileUpload} from "@/components/file-upload";
import {getCourseDTO} from "@/Server/Domain/DTO/course";
import {createAttachment, deleteAttachment} from "@/lib/api/attachments";


interface AttachmentFormProps{
    initialData:z.infer<typeof getCourseDTO>
    courseId: string
}
const formSchema = z.object({
    url:z.string().min(1,{
        message:"url is required"
    })
})

export const AttachmentForm =({initialData, courseId}:
                             AttachmentFormProps
)=>{
    const queryClient = useQueryClient();
    const router = useRouter()
    const { isLoading, error, data } = useQuery({queryKey:['CourseTitle',courseId], queryFn:()=> getCourse(courseId) })
    const [deletingId, setDeletingId] = useState<string | null>(null);


    const updateAttachmentMutation= useMutation({
        mutationFn:createAttachment,
        onSuccess(data){
            toast.success('Attachment Updated Successfully')
            queryClient.invalidateQueries({ queryKey: ['Course'] })
        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })

    const deleteAttachmentMutation = useMutation({
        mutationFn:deleteAttachment,
        onSuccess(){
            toast.success("Attachment Deleted Successfully")
            queryClient.invalidateQueries({queryKey:['Course']})
        },
        onError(){
            toast.error("Failed Deleting Attachment")
        }
    })
    const[isEditing, setEditing] = useState(false)
    const toggleEdit=()=>{
        setEditing((current)=> !current)
    }


    const onSubmit= async (values: z.infer<typeof formSchema>)=>{
        const {url} = values;
        const {id} = initialData
        const mutateVal = {url, courseId:id}
        updateAttachmentMutation.mutate(mutateVal)

    }
    const onDelete = async (attachmentId:string, courseId:string)=>{
        setDeletingId(attachmentId)
        const mutateVal = {id:attachmentId,courseId}
        deleteAttachmentMutation.mutate(mutateVal)
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => onDelete(attachment.id,courseId)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}