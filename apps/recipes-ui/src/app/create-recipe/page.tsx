'use client'

import { useRecipesControllerCreateRecipeV1 } from "@repo/recipes-codegen/recipes";
import { SharedButton, SharedInput } from '@repo/ui';
import { useEffect } from "react";
import CreateSteps from "./_components/CreateSteps";


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
