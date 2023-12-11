import * as z from "zod";
import api from "@/lib/api/base";
import {getAllCategories, getCategory} from "@/Server/Domain/DTO/category";


export const getCategories = async()=>{
    const res = await api.get("/api/category")
    return getAllCategories.parse(await res.json())
}
