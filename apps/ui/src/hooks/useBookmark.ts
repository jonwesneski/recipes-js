import { useRecipesControllerBookmarkRecipeV1 } from '@repo/codegen/recipes';
import { useNotification } from '@src/providers/NotificationProvider';
import { useOptimistic, useState, useTransition } from 'react';

interface IUseBookmarkProps {
  recipeId: string;
  bookmarked: boolean;
}
export const useBookmark = (props: IUseBookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
  const [_isPending, startTransition] = useTransition();
  const [optimisticIsBookmarked, addOptimisticIsBookmarked] =
    useOptimistic(isBookmarked);
  const { showToast } = useNotification();
  const { mutateAsync } = useRecipesControllerBookmarkRecipeV1();

  const toggleIsBookmarked = () => {
    startTransition(async () => {
      const bookmark = !isBookmarked;
      addOptimisticIsBookmarked(bookmark);

      try {
        await mutateAsync({ id: props.recipeId, data: { bookmark } });
        setIsBookmarked(bookmark);
      } catch (e) {
        console.error(e);
        showToast({
          toastId: props.recipeId,
          title: 'Error',
          message: 'bookmarking failed',
          type: 'error',
        });
      }
    });
  };

  return {
    optimisticIsBookmarked,
    toggleIsBookmarked,
  };
};
