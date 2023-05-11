import { User, createClerkClient } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { filterUserForClient } from "~/server/helpers/filterUserForClients";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(z.object({username:z.string()})).
    query(async({ctx,input})=>{

        const [user] = await clerkClient.users.getUserList({
            username: [input.username]
              })
     
        if(!user) {
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:"User not found"
            })
        }
        return filterUserForClient(user)
    })

  });
  
   