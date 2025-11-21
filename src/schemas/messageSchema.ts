import {z} from 'zod'

export const messageSchema = z.object({
  content:z.string()
           .min(10,{message:"content must be at least 10 character"})
           .max(300,{message:"content must be longer than 300 character"})
})