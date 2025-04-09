'use client';
import MainExpenseForm from '@/components/features/expense/expense-form';
import ExpenseEdit from '@/components/features/expense/expense-form/ExpenseEdit';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [];
  let type = 'edit';
  let id = slug[0];
  if (slug.length === 2) {
    [type, id] = slug;
  }
  if (slug[0] === 'new') {
    return <MainExpenseForm mode='create' />;
  }
  return (
    <div>{type === 'details' ? <h1>hello</h1> : <ExpenseEdit id={id} />}</div>
  );
};

export default Page;
