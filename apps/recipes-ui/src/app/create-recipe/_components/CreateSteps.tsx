'use client'
import { useEffect } from "react";
import {SharedInput} from '../../../../node_modules/@repo/ui/dist/TextInput/SharedInput'
//import {SharedInput} from '@repo/ui'


export default function CreateSteps() {

  return (
    <div>
        <SharedInput name="ingredient" placeHolder="ingredient" />
        <SharedInput name="amount" placeHolder="amount" />
        <select name="measurements">
            <option value='cups'>cups</option>
            <option value='oz'>oz</option>
        </select>
        <div>
        <textarea></textarea>
        </div>
    </div>
  );
}
