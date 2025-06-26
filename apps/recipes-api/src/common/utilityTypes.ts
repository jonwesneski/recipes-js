export type OmitPrismaFieldsDto<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export type OmitPrismaFieldsEntity<T, K extends keyof any> = Omit<T, 'id' | K>;
