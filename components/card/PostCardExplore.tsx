import { FullPostType } from "@/types";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import Link from "next/link";

interface PostCardExploreProps {
  post: FullPostType;
}

const PostCardExplore: React.FC<PostCardExploreProps> = ({ post }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Link href={`/post/${post.id}`}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={post.images[0].url}
              alt="post"
              fill
              className="object-cover"
            />
          </AspectRatio>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PostCardExplore;
