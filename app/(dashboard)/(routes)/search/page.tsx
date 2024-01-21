import {Categories} from "@/app/(dashboard)/(routes)/search/_components/categories";
import {getAllCategories} from "@/Server/Infrastructure/Repositories/categories-repo";
import {CoursesList} from "@/components/courses-list";
import {getCourses, getCoursesForUnAuth} from "@/Server/Handlers/ServerActions/Courses/course-query";
import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {CoursesListUnAuth} from "@/components/course-list-unauth";


interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
};
const SearchPage = async ({searchParams
                          }: SearchPageProps) => {
    const { userId } = auth();
    const coursesForUnAuth = await getCoursesForUnAuth({...searchParams})
    const categories = await getAllCategories()

    if (!userId) {
        return (
            <>
                <div className="p-6 space-y-4">
                    <Categories
                        items={categories}
                    />
                    <CoursesListUnAuth items={coursesForUnAuth} />
                </div>

            </>

        )
    }
    const courses = await getCourses({userId,...searchParams})
    return (
        <>
            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <CoursesList items={courses} />
            </div>

        </>
     );
}
 
export default SearchPage;