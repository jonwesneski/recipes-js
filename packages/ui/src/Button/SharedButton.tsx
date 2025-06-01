import React, { MouseEventHandler } from 'react';

interface SharedButtonProps {
  text: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}
export const SharedButton = (props: SharedButtonProps) => {
 return (
    <div className="rounded-md ring-4" style={{display: 'inline-block'}}>
      <button className="rounded-md ring-3 shadow-[3px_3px_0px_3px_#000000] p-1 bg-green-700 text-white font-semibold" style={{margin: '0 auto'}} onClick={props.onClick}>
        {`${props.text}.`}
      </button>
    </div>
 )
}
