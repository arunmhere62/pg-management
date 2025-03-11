import prisma from '@/lib/prisma';

export const getPgListQuery = async (userId: number) => {
  if (!userId) {
    throw new Error('Invalid userId provided');
  }
  try {
    const res = await prisma.pg_locations.findMany({
      where: {
        userId: userId
      },
      include: {
        city: {
          select: {
            name: true
          }
        },
        state: {
          select: {
            name: true
          }
        }
      }
    });
    const resModel = res.map((data) => ({
      cityName: data.city?.name,
      stateName: data.state?.name,
      ...data
    }));
    return resModel;
  } catch (error) {
    throw error;
  }
};
