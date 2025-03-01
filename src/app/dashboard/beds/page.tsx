'use client';

import { useSearchParams } from 'next/navigation';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from '@/features/products/components/product-tables/columns';
import { useState, useEffect } from 'react';

const Beds = () => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    categories: ''
  });

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    console.log('Current Page from URL:', page);
    console.log('Current Limit from URL:', limit);

    setFilters((prev) => ({
      ...prev,
      page,
      limit
    }));
  }, [searchParams.toString()]);

  // Generate 100 mock products
  const allProducts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    description: `This is the description for Product ${i + 1}.`,
    created_at: new Date(
      new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365))
    ).toISOString(),
    price: parseFloat((Math.random() * (500 - 10) + 10).toFixed(2)),
    photo_url: `https://api.slingacademy.com/public/sample-products/${
      (i % 10) + 1
    }.png`,
    category: [
      'Electronics',
      'Furniture',
      'Clothing',
      'Toys',
      'Groceries',
      'Books',
      'Jewelry',
      'Beauty Products'
    ][Math.floor(Math.random() * 8)],
    updated_at: new Date().toISOString()
  }));

  const totalProducts = allProducts.length;

  // ✅ Correct pagination logic
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const products = allProducts.slice(startIndex, endIndex);

  console.log('Total Products:', totalProducts);
  console.log('Displaying products:', products);
  console.log('Filters:', filters);

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
};

export default Beds;
