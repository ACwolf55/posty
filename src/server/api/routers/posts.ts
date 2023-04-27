import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  console.log('user',user)
 
  return {
    id: user.id,
     username: (user.username ? user.username  : user.firstName  ),
      profilePicture: user.profileImageUrl
    }
}

export const postsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany( {take:100,} );

   const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.AuthorId),
      limit:100,
   })).map(filterUserForClient)

   console.log('users',users)

   return posts.map((post)=>{
    const author = users.find((user) => user.id === post.AuthorId)
    
    if (!author|| !author.username) throw new TRPCError(
      { code: "INTERNAL_SERVER_ERROR", 
    message: "author not found"
  })

    return{
    post,
    author: {
      ...author,
      username: author.username
    }
    // author: users.find((user)=> user.id === post.AuthorId)
   }})

  }),

  create: privateProcedure
  .input(
    z.object({
      content: z.string().emoji().min(1).max(200)
    })
  )
  .mutation(async ({ctx,input})=>{
      const authorId = ctx.currentUser.id

      const post = await ctx.prisma.post.create({
          data: {
            authorId,
            content:input.content
          }
      })
      return post
  })
});
