"use client"
import {db} from "@/lib/db"
import {auth, currentUser, useUser} from "@clerk/nextjs"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {redirect} from "next/navigation";
import {IconBadge} from "@/components/icon-badge";
import {LayoutDashboard} from "lucide-react";
import {TitleForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/title-form";
import {DescriptionForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/description-form";
import {ImageForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/image-form";
import {getCourse} from "@/lib/api/course";
import toast from "react-hot-toast";

const CoursePage =  ({params}: { params: { id: string } }) => {

    const {user} = useUser();
    const queryClient = useQueryClient();
    const { isPending, error,isError, data } = useQuery({queryKey:['Course',params.id], queryFn:()=> getCourse(params.id) })
    if (isPending) {
        return <span>Loading...</span>
    }

    const course = data
    console.log(course)
    // if (!user.user) {
    //     redirect("/")
    // }

    if (!course) {
        redirect("/")
    }
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                     </span>
                </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className="text-xl">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm initialData={course} courseId={course.id}/>

                </div>

            </div>
        </div>
    )
}

export default CoursePage