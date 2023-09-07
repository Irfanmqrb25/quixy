import { User } from "@prisma/client";
import { Avatar as AvatarStatus, AvatarImage } from "./ui/avatar";
import useActiveList from "@/hooks/useActiveList";

interface AvatarProps {
  data: User;
  className?: string;
}

const AvatarWithStatus: React.FC<AvatarProps> = ({ data, className }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(data.email!) !== -1;

  return (
    <div className="relative">
      <AvatarStatus className={className}>
        <AvatarImage src={data.image || "/assets/default-user.jpg"} />
      </AvatarStatus>
      {isActive && (
        <span className="absolute bottom-0 right-0 block w-2 h-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export default AvatarWithStatus;
