import { tagsControllerTagNameListV1 } from '@repo/codegen/tags';
import { useState } from 'react';

export default () => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async () => {
    const currentTags = await tagsControllerTagNameListV1();
    setTags((tags) => [...tags, ...currentTags.data]);
    if (currentTags.pagination.nextCursor !== null) {
      await fetchTags();
    }
  };

  return {
    tags,
    fetchTags,
  };
};
