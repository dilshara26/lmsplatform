import {z} from "zod";
export const getMuxData = z.object({
    id: z.string(),
    assetId: z.string(),
    playbackId:z.string().nullable(),
})

