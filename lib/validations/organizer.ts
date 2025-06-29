import { z } from "zod"

const organizerSignupSchema = z.object({
    name : z.string().min(2 , "name should be atleast 2 letters"),
    email : z.string().min(6 , "email should be atleast 6 letters"),
    password : z.string().min(6 , "password should be atleast 6 letters"),
    city : z.string().min(2 , "city should be atleast 6 letters"),
})

export type  organizerSignupSchema = z.infer<typeof organizerSignupSchema>