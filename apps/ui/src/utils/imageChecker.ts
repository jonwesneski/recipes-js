export const isImageSizeUnderLimit = (dataImageString: string): boolean => {
  return calculateImageSize(dataImageString) < 60_000;
};

const PADDING_REGEX = /=+$/;
export const calculateImageSize = (dataImageString: string): number => {
  const base64Data = dataImageString.split(',')[1];
  const padding = (PADDING_REGEX.exec(base64Data) ?? [''])[0].length;
  const sizeInBytes = (base64Data.length * 3) / 4 - padding;
  return sizeInBytes;
};
