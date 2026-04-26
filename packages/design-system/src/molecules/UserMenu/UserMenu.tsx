import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export const UserMenu = ({ userName }: { userName: string }) => {
  return (
    <div className="flex justify-end items-center gap-2 cursor-pointer px-4 rounded">
      <FontAwesomeIcon
        icon={faUser}
        className="h-4 w-4 rounded-full"
        style={{
          width: "1.5rem",
          height: "1.5rem",
        }}
      />
      <span>{userName}</span>
    </div>
  );
};
