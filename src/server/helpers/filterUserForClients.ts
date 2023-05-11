import { User } from "@clerk/nextjs/dist/api";


export const filterUserForClient = (user: User) => {
    console.log('user',user)
   
    return {
      id: user.id,
       username: (user.username ? user.username  : user.firstName  ),
        profilePicture: user.profileImageUrl
      }
  }


