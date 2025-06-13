'use client'

import { useEffect } from "react";
import { SharedInput } from '../../../node_modules/@repo/ui/dist/TextInput/SharedInput'
import CreateSteps from "./_components/CreateSteps";
import { useRecipesControllerCreateRecipeV1 } from "@repo/recipes-codegen/recipes";
import { SharedButton } from '@repo/ui'


export default function Page() {


    const { mutate } = useRecipesControllerCreateRecipeV1({mutation: {retry: false}})
    
    const handleSubmit = () => {
        mutate({data: {}}, {
            onSuccess: () => undefined,
            onError: () => undefined
        })
    }

    useEffect(() => {
       
    }, []);


  return (
    <div className="flex justify-center">
    <div className="create-recipe">
        <SharedInput name="recipe" placeHolder="Recipe name" />
        <SharedInput name="description" placeHolder="Short description" />
        <CreateSteps />
        <SharedButton text="submit" onClick={() => console.log('9')} />
    </div>
    </div>
  );
}
