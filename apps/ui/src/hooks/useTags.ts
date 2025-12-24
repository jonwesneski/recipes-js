import { tagsControllerTagNameListV1 } from '@repo/codegen/tags';
import { useState } from 'react';

export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async (nextCursor?: string, includes?: string) => {
    const currentTags = await tagsControllerTagNameListV1({
      cursorId: nextCursor,
      includes,
    });
    setTags((t) => [...t, ...currentTags.data]);
    if (currentTags.pagination.nextCursor !== null) {
      await fetchTags(currentTags.pagination.nextCursor, includes);
    }
  };

  return {
    tags,
    fetchTags,
  };
};
