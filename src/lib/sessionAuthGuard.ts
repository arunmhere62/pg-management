import { auth } from '@/lib/auth';
import { NotFoundError } from '@/services/utils/error';

export async function ensureAuthenticated() {
  const session = await auth();

  if (!session || !session.user) {
    throw new NotFoundError('User not found');
  }

  if (!session.organizationId) {
    throw new NotFoundError('Organization not found');
  }
  return { error: false, session };
}
