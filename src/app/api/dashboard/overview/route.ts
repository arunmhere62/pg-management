import { errorHandler } from '@/services/utils/error';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
  } catch (error) {
    return errorHandler(error);
  }
};
