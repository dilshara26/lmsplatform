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
        const res = await api.get(`/api/course/${id}`)
        const newCourse = getCourseDTO.parse(await res.json())
        return newCourse
}

export const updateCourse = async(id:string)=>{
        const res = await api.patch(`api/course/${id}`)
        return "success"
}

