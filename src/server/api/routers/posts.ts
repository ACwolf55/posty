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

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

//rate limiter allows for 3 posts every 5 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 m"),
  analytics: true
});

export const postsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take:100,
      orderBy:[{createdAt:"desc"}]
    });

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
      content: z.string().min(2).max(280)
    })
  )
  .mutation(async ({ctx,input})=>{
     const AuthorId = ctx.userId

     const {success} = await ratelimit.limit(AuthorId)

     if(!success){ throw new TRPCError({code:"TOO_MANY_REQUESTS"})}

      const post = await ctx.prisma.post.create({
          data: {
            AuthorId,
            content:input.content
          }
      })
      return post
  })
});
