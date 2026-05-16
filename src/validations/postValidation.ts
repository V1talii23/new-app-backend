import { z } from "zod"

export const postIdSchema = z.object({
    postId: z.string().uuid("Invalid post ID format")
})

export const postCreateSchema = z.object({
    title: z.string().min(3, "Title must be at leat 3 characters"),
    content: z.string().max(250).optional(),
    eventDate:z.coerce.date().optional(),
    published: z.boolean().default(false),
    rating: z.number().min(1).max(10)
}) 

export const postUpdateSchema = z.object({
    title: z.string().min(3, "Title must be at leat 3 characters").optional(),
    content: z.string().max(250).optional(),
    published: z.boolean().optional(),
    rating: z.int().min(1).max(10).optional(),
    eventDate: z.coerce.date().optional()
}).refine((data) => 
    Object.values(data).some(val => val !== undefined && val !== ""))
  
export const postSearchSchema = z.object({
    search: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(5).max(30).default(15),
    sortBy: z.enum(["title", "createdAt","updatedAt", "rating", "eventDate", "published"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("asc")
})
    