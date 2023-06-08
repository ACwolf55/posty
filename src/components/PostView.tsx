
import Link from "next/link";
import Image from 'next/image'
import { RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"


dayjs.extend(relativeTime)


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

export const PostView = (props : PostWithUser)=>{
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
      <div className="flex text-slate-200 gap-1 ">
        <Link href={`/@${author.id}`} className="hover:bg-slate-700 p-0.7 rounded">
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