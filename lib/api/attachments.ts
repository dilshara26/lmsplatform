import api from "@/lib/api/base";
import {z} from "zod";
import {createOneAttachment,deleteOneAttachment} from "@/Server/Domain/DTO/attachments";


// export const getAttachments = async (courseId:string)=>{
//     const res = await api.get()
// }

export const createAttachment = async (attachment:z.infer<typeof createOneAttachment>)=>{
    const res = await api.post(`/api/courses/${attachment.courseId}/attachments`,{json:attachment})
    return "success"
}


export const deleteAttachment = async(deleteAttachmentProps:z.infer<typeof deleteOneAttachment>)=>{
    const res = await api.delete(`/api/courses/${deleteAttachmentProps.courseId}/attachments/${deleteAttachmentProps.id}`)
    return "success"
}