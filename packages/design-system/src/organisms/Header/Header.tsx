import { MobileNavigation } from "../../molecules/MobileNavigation/MobileNavigation";
import { Navigation } from "../../molecules/Navigation/Navigation";
import { UserMenu } from "../../molecules/UserMenu/UserMenu";

type HeaderProps = {
  userName: string;
  logoutHref?: string;
  logoutLabel?: string;
};

export const Header = ({ userName, logoutHref, logoutLabel }: HeaderProps) => {
  return (
    <header className="grid grid-cols-2 justify-end items-center gap-2 cursor-pointer h-16 w-full py-2 px-4 bg-primary text-white ">
      <MobileNavigation className="justify-self-start" />
      <Navigation className="desktop-navigation" />
      <UserMenu
        userName={userName}
        logoutHref={logoutHref}
        logoutLabel={logoutLabel}
        className="justify-self-end col-start-2"
      />
    </header>
  );
};
