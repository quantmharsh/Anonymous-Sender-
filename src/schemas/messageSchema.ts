import { Content } from "next/font/google"
import {z} from "zod"
export const messageSchema=z.object({
    content:z.string()
    .min(10 ,{message:"Content must be 10 characters long"})
    .max(300 ,{message:"Message content should not be more then 300 characters long "})
})
