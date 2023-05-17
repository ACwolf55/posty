import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Image from 'next/image'


import {LoadingSpinner} from "~/components/LoadingSpinner";

import { RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { PageLayout } from "~/components/PageLayout";

dayjs.extend(relativeTime)

const CreatePostWizard =()=>{
   
    const {user} = useUser()

    const [input,setInput] = useState("")

    const ctx = api.useContext()

    const { mutate, isLoading:isPosting} = api.posts.create.useMutation({
      onSuccess:()=>{
         setInput('')
         void ctx.posts.getAll.invalidate()
      },
      onError: (e)=> {
        const errorMessage = e.data?.zodError?.fieldErrors.content
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0])
        }else{
          toast.error('Failed to postMessage, please try again in a few minutes')

        }
      }
    })

    if (!user) return null

    return  (
      <div className="flex w-full gap-3 ">
          <Image src={user.profileImageUrl}
           alt="Profile image"
            className="w-14 h-14 rounded-full"
            width={56}
            height={56}
            />
      <input placeholder="post your posty post here ~!" 
      className="bg-transparent grow"
      type='text'
      value={input}
      onChange={(e)=>setInput(e.target.value)}
      onKeyDown={(e)=>{
        if(e.key === "Enter"){
          e.preventDefault()
          if(input !=="") {
            mutate({ content:input})
          }
        }
      }}
      disabled={isPosting}
      />
      {input !== "" && !isPosting && (

      <button onClick={()=>mutate({ content: input})}>Post</button>

      )}
      {isPosting && (
    <div className="flex items-center justify-center">
     <LoadingSpinner size={30}/>
     </div>
     )}
      </div>
    )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView =(props : PostWithUser)=>{
  const {post,author} = props
  console.log('author',author)
return(
  <div className="flex p-4 gap-3 border-b border-slate-400" key={post.id}>
    <Image src={author.profilePicture}
     className="w-14 h-14 rounded-full"
      alt={`@${author.username}'s profile picture`}
      width={56}
      height={56}
      />

    <div className="flex flex-col">
      <div className="flex text-slate-200 gap-1">
        <Link href={`/@${author.username}`}>
        <span>@{author.username}</span> 
        </Link>
        <Link href={`/post/${post.id}`}>
        <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()} `}</span>
        </Link>
        </div>
      <span className="text-xl">{post.content}</span>
    </div>
    </div>
)
}  

const Feed =()=>{

  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if (postsLoading) return (
    <div className="absolute top-0 right-0 h-screen w-screen flex justify-center items-center" >
  <LoadingSpinner />
  </div>
  );

  if (!data) return <p> Something went wrong</p>;

  return(
      <div className='flex flex-col'>
       {data.map((fullPost)=> (
        <PostView {...fullPost} key={fullPost.post.id} />
       ))}
      </div>
  )


}

const Home: NextPage = () => {

  // const hello = api.example.hello.useQuery({ text: "from tRPC" });


  const { isLoaded: userLoaded, isSignedIn} = useUser()
  
  //will fetch post right away
 api.posts.getAll.useQuery();

  //returns empty div if both arent loaded, since user tends to return faster
  // if(!userLoaded && !postsLoaded) return <div/>
  // if(isLoading) return <LoadingSpinner />
  // if(!data) return <div>Something went wrong</div>

  return (
    <>
      <Head>
        <title>Posty~!</title>
        <meta name="description" content="📜" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
      {!isSignedIn && 
      <div className="flex justify-center"><SignInButton /></div>}
      {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
     </PageLayout>

    </>
  );
};

export default Home;
