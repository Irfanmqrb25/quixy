import * as z from "zod";

export const editProfileSchema = z.object({
  image: z.string(),
  username: z
    .string()
    .min(5, {
      message: "Username min 5 characters",
    })
    .max(15, {
      message: "Username max 15 characters",
    }),
  description: z.string().max(50, {
    message: "Description max 50 characters",
  }),
});
