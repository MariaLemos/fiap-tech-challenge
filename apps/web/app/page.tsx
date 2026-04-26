import { Typography, SectionBox, ThemeToggle, Navigation } from "@repo/design-system";
import "./page.css";
import { Wellcome } from "./components/Welcome/welcome";
import { Statement } from "./components/Statement/Statement";

export default function Home() {
  return (
    
     
      <main className="home-page">
        <Navigation/>
        <Wellcome/>
        <SectionBox title="Demo Tema" variant="colored">
          <Typography variant="p">
            Este texto adapta automaticamente entre light e dark mode! 
            Use o botão de tema no header para testar.
          </Typography>
        </SectionBox>
        <Statement/>
      </main>

  );
}
