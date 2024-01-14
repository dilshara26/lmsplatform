"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import {getChapter} from "@/Server/Domain/DTO/chapter";

import {updateChapter} from "@/lib/api/chapter";
import {useMutation,useQueryClient} from "@tanstack/react-query";

interface ChapterDescriptionFormProps {
    initialData: z.infer<typeof getChapter >;
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
                                           initialData,
                                           courseId,
                                           chapterId
                                       }: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);
    const queryClient = useQueryClient()
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const editChapterOrderMutation = useMutation({
        mutationFn:updateChapter,
        onSuccess(){
            toast.success("Chapter Description Successfully Added")

            queryClient.invalidateQueries({queryKey:['Chapters']})

        },
        onError(){
            toast.error("Something Went Wrong")
        }
    })
    const onSubmit =(values: z.infer<typeof formSchema>) => {
        const {description} = values
        const mutateVal = {id:initialData.id, title:initialData.title, description,courseId:initialData.courseId}
        editChapterOrderMutation.mutate(mutateVal)

        router.refresh();

    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No description"}
                    {initialData.description && (
                        <Preview
                            value={initialData.description}
                        />
                    )}
                </div>
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
                                        <Editor
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