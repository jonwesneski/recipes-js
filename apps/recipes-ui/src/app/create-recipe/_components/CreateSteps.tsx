'use client'

import { SharedInput, SharedTextArea } from '@repo/ui'

export const CreateSteps = () => {
  return (
    <div>
      <SharedInput name="ingredient" placeHolder="ingredient" />
      <SharedInput name="amount" placeHolder="amount" />
      <select name="measurements">
        <option value="cups">cups</option>
        <option value="oz">oz</option>
      </select>
      <div>
        <SharedTextArea name="ingredients" />
      </div>
    </div>
  )
}
