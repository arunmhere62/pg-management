import { getPgListQuery } from './query';

export const getPgListService = async (
  userId: number,
  organizationId: number
) => {
  try {
    const res = await getPgListQuery(userId, organizationId);
    return res;
  } catch (error) {
    throw error;
  }
};
