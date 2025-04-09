// hooks/useSetBreadcrumbs.ts
import { setBreadcrumbs } from '@/store/slices/breadcrumbSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function useSetBreadcrumbs(
  breadcrumbs: { title: string; link?: string }[]
) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs(breadcrumbs));
  }, [dispatch, breadcrumbs]);
}
