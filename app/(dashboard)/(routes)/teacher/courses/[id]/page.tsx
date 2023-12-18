"use client"
import {db} from "@/lib/db"
import {auth, currentUser, useUser} from "@clerk/nextjs"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {redirect} from "next/navigation";
import {IconBadge} from "@/components/icon-badge";
import {CircleDollarSign, LayoutDashboard, ListChecks,File} from "lucide-react";
import {TitleForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/title-form";
import {DescriptionForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/description-form";
import {ImageForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/image-form";
import {getCourse} from "@/lib/api/course";
import toast from "react-hot-toast";
import {getCategories} from "@/lib/api/category";
import {CategoryForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/select-category";
import {PriceForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/price-form";
import {AttachmentForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/attachment-form";
import {ChapterForm} from "@/app/(dashboard)/(routes)/teacher/courses/[id]/_components/chapter-form";

const CoursePage =  ({params}: { params: { id: string } }) => {

    const user = useUser();

    const queryClient = useQueryClient();

    const { isPending, error,isError, data } = useQuery({queryKey:['Course',params.id], queryFn:()=> getCourse(params.id) })
    if (isPending) {
        return <span>Loading...</span>
    }
    if(!user.isLoaded){
        return <span>User Loading...</span>
    }

    const course = data
    console.log(course)
    // if (!user.user) {
    //     redirect("/")
    // }

    if (!course) {
        redirect("/")
    }

    if(course.userId != user?.user?.id ){
        console.log(user?.user?.id)
        console.log(course.userId)
        redirect("/")
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter=> chapter.isPublished)

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
                    <CategoryForm initialData={course} courseId={course.id}/>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Course chapters
                            </h2>
                        </div>
                        <ChapterForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>


            </div>
        </div>
    )
}

export default CoursePage