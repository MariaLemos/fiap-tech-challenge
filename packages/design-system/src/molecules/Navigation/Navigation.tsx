import { ThemeToggle } from "../../atoms";
import { SectionBox } from "../SectionBox/SectionBox";
import Link from "next/link";
import "./Navigation.css";

const pagesList = [
  { name: "Home", path: "/" },
  { name: "Transferencias", path: "/transfer" },
  { name: "Investimentos", path: "/investments" },
  { name: "Outros serviços", path: "/services" },
];

export const Navigation = ({ className }: { className?: string }) => {
  return (
    <SectionBox
      className={`flex flex-col justify-between items-center navigation ${className}`}
    >
      <nav>
        <ul className="flex navigation divide-primary divide-solid divide-y-2">
          {pagesList.map((page) => (
            <li key={page.path} className="px-4 pt-4 pb-2">
              <Link href={page.path}>{page.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
    </SectionBox>
  );
};
