import { Typography } from "../typography/typography"
export const Select = ({ options, className, label }: { options: {label: string, value: string}[], className?: string, label: string }) => {

    return (<label>
        <Typography>{label}</Typography>
        <select className={`border p-2 rounded ${className}`} >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </label>)
}