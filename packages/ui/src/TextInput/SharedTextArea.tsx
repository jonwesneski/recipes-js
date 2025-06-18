import { useRef, useState } from "react";

interface SharedTextAreaProps {
    name: string
}
export const SharedTextArea = (props: SharedTextAreaProps) => {
    const [inputValue, setInputValue] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popUpPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getCaretPosition = () => {
    const position: { row: number | null, column: number | null } = { row: null, column: null };
    if (inputRef.current) {
        // Calcuate row position 
        // // do we care about row position?
        const textarea = inputRef.current;
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPosition);
        const row = textBeforeCursor.split('\n').length;

        // Calculate column position we have 3 columns in textarea
        const currentRowText = textBeforeCursor.split('\n')[row - 1] || '';
        const column = currentRowText.split(' ').length;

        position.row = row;
        position.column = column;
    }
    return position;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // const caretPosition = event.target.selectionEnd;
    // const lines = event.target.value.split('\n');
    // const currentCaretLine = lines.slice(0, event.target.value.substring(0, caretPosition).split('\n').length - 1).join('\n');
    // console.log({caretPosition, total: event.target.textLength, currentCaretLine, lines, value: event.target.value});

    // const textarea = inputRef.current;
    //   const cursorPosition = textarea!.selectionStart;
    //   const textBeforeCursor = textarea!.value.substring(0, cursorPosition);
    //   const caretRow = textBeforeCursor.split('\n').length;
    //   console.log({caretRow})
      const position = getCaretPosition();
    setInputValue(event.target.value);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const position = getCaretPosition();
    //   setCursorPosition({
    //     x: event.clientX - rect.left,
    //     y: event.clientY - rect.top,
    //   });
      setIsPopupVisible(true);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLTextAreaElement>) => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const touch = event.changedTouches[0];
      
      setPopupPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsPopupVisible(true);
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      setIsPopupVisible(true);
    }
    console.log(inputRef.current?.selectionEnd, 'ddddd')
  };

  const handleBlur = () => {
    setIsPopupVisible(false);
    console.log('blur')
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <textarea
      name={props.name}
        value={inputValue}
        onChange={handleInputChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        ref={inputRef}
        style={{ padding: '10px', border: '1px solid #ccc' }}
      />
      {isPopupVisible && (
        <div
          style={{
            position: 'absolute',
            top: popUpPosition.y + 20,
            left: popUpPosition.x,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          <div className="grid grid-cols-4 gap-3">
          <div className="bg-green-300">cups</div>
          <div className="bg-amber-300">oz</div>
          <div className="bg-amber-300">grams</div>
          <div className="bg-amber-300">ml</div>
          <div className="bg-amber-300">L</div>
          </div>
        </div>
      )}
    </div>
  );
}
