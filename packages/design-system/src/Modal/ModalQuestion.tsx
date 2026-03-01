import { TextButton } from '../Button'
import { ModalCentered } from './ModalCentered'

interface ModalQuestionProps {
  question: string
  action: string
  noAction: string
  onTakeAction: () => void
  onDontTakeAction: () => void
}
export const ModalQuestion = (props: ModalQuestionProps) => {
  return (
    <ModalCentered>
      <h1 className="font-bold">{props.question}</h1>
      <div className="mt-4 flex gap-10 justify-center">
        <TextButton text={props.action} onClick={props.onTakeAction} />
        <TextButton
          text={props.noAction}
          variant="opposite"
          onClick={props.onDontTakeAction}
        />
      </div>
    </ModalCentered>
  )
}
