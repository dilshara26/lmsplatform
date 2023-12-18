import * as z from "zod";
import api from "@/lib/api/base";
import {getInitCourseDTO} from "@/Server/Domain/DTO/course";
import {
    createOneChapter,
    editChapter,
    getChapter,
    getChapterParams,
    updateOneChapter
} from "@/Server/Domain/DTO/chapter";

export const createChapter = async(chapter: z.infer<typeof createOneChapter>)=>{

    const res = await api.post(`/api/courses/${chapter.courseId}/chapters`,{json:chapter});
    const newChapter= getChapter.parse(await res.json())
    return newChapter;
}

export const reOrderChapters = async (chapter :z.infer<typeof updateOneChapter>[])=>{
    const res = await api.put(`/api/courses/${chapter[0].courseId}/chapters/reorder`,{json:chapter})
    return "success"
}

export const updateChapter = async (chapter :z.infer<typeof editChapter>)=>{
    const res = await api.patch(`/api/courses/${chapter.courseId}/chapters/${chapter.id}`,{json:chapter})
    return "success"
}

export const getSelectedChapter = async(chapter: z.infer<typeof getChapterParams>)=>{
    const res = await api.get(`/api/courses/${chapter.courseId}/chapters/${chapter.id}`)
    const newChapter = getChapter.parse(await res.json())
    return newChapter

}