'use client'

import { useRecipesControllerCreateRecipeV1 } from "@repo/recipes-codegen/recipes";
import { tagsControllerTagNameListV1 } from "@repo/recipes-codegen/tags";
import { SharedButton, SharedInput } from '@repo/ui';
import { useEffect, useState } from "react";
import CreateSteps from "./_components/CreateSteps";


export default function Page() {


    const { mutate } = useRecipesControllerCreateRecipeV1({mutation: {retry: false} })
    const [tags, setTags] = useState<string[]>([]);

    
    const handleSubmit = () => {
        mutate({data: {}}, {
            onSuccess: () => undefined,
            onError: () => undefined
        })
    }

    useEffect(() => {
      // todo add params
      const fetchTags = async () => {
        const currentTags = await tagsControllerTagNameListV1();
        setTags(tags => [...tags, ...currentTags.data])
        if (currentTags.pagination.next_page !== null) {
          //await fetchTags()
        }
      }
       
      fetchTags();
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
