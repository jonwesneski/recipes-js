import { tagsControllerTagNameListV1 } from '@repo/codegen/tags';
import { useState } from 'react';

export default () => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async (nextCursor?: string, includes?: string) => {
    const currentTags = await tagsControllerTagNameListV1({
      params: { cursorId: nextCursor, includes },
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
