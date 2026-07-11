import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export const UserMenu = ({
  userName,
  className = "",
  logoutHref,
  logoutLabel,
}: {
  userName: string;
  className?: string;
  logoutHref?: string;
  logoutLabel?: string;
}) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 rounded min-w-16 ${className}`}
    >
      <FontAwesomeIcon
        icon={faUser}
        className="h-4 w-4 rounded-full"
        style={{
          width: "1.5rem",
          height: "1.5rem",
        }}
      />
      <span>{userName}</span>
      {logoutHref && logoutLabel ? (
        <a
          href={logoutHref}
          className="rounded-full border border-white/70 px-3 py-1 text-xs font-semibold no-underline hover:bg-white/15"
        >
          {logoutLabel}
        </a>
      ) : null}
    </div>
  );
};
