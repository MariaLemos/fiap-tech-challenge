import { ThemeToggle } from "../../atoms"
import { SectionBox } from "../SectionBox/SectionBox"

export const Navigation = ({ className }: { className?: string }) => {

    return (<SectionBox className={`navigation ${className}`}><nav>
      
    </nav>
    <ThemeToggle /></SectionBox>)
}