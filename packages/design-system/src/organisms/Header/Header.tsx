import { MobileNavigation } from "../../molecules/MobileNavigation/MobileNavigation";
import { UserMenu } from "../../molecules/UserMenu/UserMenu";

export const Header = ({ userName }: { userName: string }) => {
  return (
    <header className="grid grid-cols-2 justify-end items-center gap-2 cursor-pointer h-16 w-full py-2 px-4 bg-primary text-white ">
      <MobileNavigation className="justify-self-start" />
      <UserMenu userName={userName} className="justify-self-end col-start-2" />
    </header>
  );
};
