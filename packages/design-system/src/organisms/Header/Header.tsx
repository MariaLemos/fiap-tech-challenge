import { UserMenu } from "../../molecules/UserMenu/UserMenu";

export const Header = () => {
  return (
    <header className="flex justify-end items-center gap-2 cursor-pointer h-16 w-full p-6 bg-primary text-white ">
      <UserMenu userName="John Doe" />
    </header>
  );
};
