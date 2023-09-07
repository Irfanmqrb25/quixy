import Image from "next/image";

import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { TbBoxMultiple } from "react-icons/tb";

import { Post, Image as ImageType } from "@prisma/client";
import Link from "next/link";

interface UserPostCard {
  post: Post & {
    images: ImageType[];
  };
}

const UserPostCard: React.FC<UserPostCard> = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="relative overflow-hidden">
        <div className="absolute p-0 pb-0 pr-1">
          <TbBoxMultiple />
        </div>
        <AspectRatio ratio={4 / 3} className="relative overflow-hidden">
          <Image
            src={post.images[0].url}
            alt="post image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            fill
            className="object-cover rounded-sm"
          />
        </AspectRatio>
        {post.images.length > 1 && (
          <div className="absolute top-0 right-0 p-1 text-slate-300">
            <TbBoxMultiple />
          </div>
        )}
      </Card>
    </Link>
  );
};

export default UserPostCard;
