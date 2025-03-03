import { getPgListQuery } from './query';

export const getPgListService = async (userId: number) => {
  try {
    const res = await getPgListQuery(userId);
    return res;
  } catch (error) {
    throw error;
  }
};
