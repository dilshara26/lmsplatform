import { Category, Course } from "@prisma/client";


import { db } from "@/lib/db";
import {getProgress} from "@/Server/Handlers/ServerActions/Progress/progress-query";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type CourseWithCategoryForUnAuth = Course & {
    category: Category | null;
    chapters: { id: string }[];
};

type CourseEnrolledWithProgressWithCategory =Course & {
    category: Category | null;
    chapters: [];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

type GetCoursesforUnAuth = {
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
                                     userId,
                                     title,
                                     categoryId
                                 }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                };
            })
        );

        return coursesWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}

export async function getUniqueCourse(courseId:string, isPublished:boolean){
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            isPublished: true,
        }
    });
    return course

}

export const  getUserEnrolledCourses = async(userId:string): Promise<DashboardCourses> =>{
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseEnrolledWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        }
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }

}

export const getCoursesForUnAuth = async ({
                                     title,
                                     categoryId
                                 }: GetCoursesforUnAuth): Promise<CourseWithCategoryForUnAuth[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc",
            }
        });
        return courses;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}
