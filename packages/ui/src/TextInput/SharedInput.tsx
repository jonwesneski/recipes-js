
interface SharedInputProps {
    name: string
    placeHolder?: string;
}
export function SharedInput(props: SharedInputProps) {
    const placeHolder = props.placeHolder ? `${props.placeHolder}...` : undefined
    return (
        <input type="text" 
               className="border-0 border-b focus:outline-none focus:border-gray-300"
               placeholder={placeHolder}
               name={props.name} />
    )
}
