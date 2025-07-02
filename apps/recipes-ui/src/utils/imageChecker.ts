export const isImageSizeUnderLimit = (dataImageString: string): boolean => {
  return calculateImageSize(dataImageString) < 40_000;
};

export const calculateImageSize = (dataImageString: string): number => {
  const base64Data = dataImageString.split(',')[1];
  const padding = (base64Data.match(/=+$/) ?? [''])[0].length;
  const sizeInBytes = (base64Data.length * 3) / 4 - padding;
  return sizeInBytes;
};
