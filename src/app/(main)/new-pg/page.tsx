import NewPgCreate from '@/components/features/new-pg/NewPgCreate';

export default function NewPgPage() {
  return (
    <div>
      <p className='mb-4 w-[80%] text-lg'>
        To start using the application, please create a PG location. This will
        allow you to manage tenants, rooms, beds, rent payments, and other
        PG-specific features. You won&apos;t be able to access the dashboard or
        manage any data until a PG is created.
      </p>
      <NewPgCreate mode='create' />
    </div>
  );
}
