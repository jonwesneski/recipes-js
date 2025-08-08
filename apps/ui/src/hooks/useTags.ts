import { tagsControllerTagNameListV1 } from '@repo/codegen/tags';
import { useState } from 'react';

export default () => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async () => {
    // todo add params cursor & input
    const currentTags = await tagsControllerTagNameListV1();
    setTags((t) => [...t, ...currentTags.data]);
    if (currentTags.pagination.nextCursor !== null) {
      await fetchTags();
    }
  };

  return {
    tags,
    fetchTags,
  };
};
