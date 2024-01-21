import * as z from "zod";
import api from "@/lib/api/base";
import {updateProgressDto} from "@/Server/Domain/DTO/progress";

export const updateProgress = async(progress: z.infer<typeof updateProgressDto>)=>{

    const res = await api.put(`/api/courses/${progress.courseId}/chapters/${progress.chapterId}/progress`,{json:progress});
    return "success";
}