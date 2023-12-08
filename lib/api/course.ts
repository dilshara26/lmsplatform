import * as z from "zod";
import api from "@/lib/api/base";
import {NextResponse} from "next/server";
import {createCourseDTO, getCourseDTO} from "@/Server/Domain/DTO/course";

const formSchema = createCourseDTO;
export const createCourse = async(course: z.infer<typeof formSchema>)=>{

        const res = await api.post("/api/courses",{json:course});
        const newCourse= getCourseDTO.parse(await res.json())
        return newCourse;
}

export const getCourse = async(id:string)=>{
        const res = await api.get(`/api/courses/${id}`)
        const newCourse = getCourseDTO.parse(await res.json())
        return newCourse
}

type updateCourseParams =  z.infer<typeof formSchema> & {courseId:string}
export const updateCourse = async(course:updateCourseParams)=>{

        const {title, description,imageUrl} = course
        const data = createCourseDTO.parse({title, description, imageUrl})
        const res = await api.patch(`/api/courses/${course.courseId}`,{json:data})
        return "success"
}

