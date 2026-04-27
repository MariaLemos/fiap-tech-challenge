import { Navigation } from "@repo/design-system";
import "./page.css";
import { Wellcome } from "./components/Welcome/welcome";
import { Statement } from "./components/Statement/Statement";
import { NewTransaction } from "./components/NewTransaction/NewTransaction";

export default function Home() {
  return (
    <main className="home-page">
      <Navigation className="navigation" />
      <Wellcome />
      <NewTransaction />
      <Statement />
    </main>
  );
}
