'use client';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import ThemeToggle from './ThemeToggle/theme-toggle';
import PgSelection from './header/PgSelection';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 bg-white transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:bg-black'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        {/* <Separator orientation='vertical' className='mr-2 h-4' /> */}
        <div className='hidden sm:block'>
          <Breadcrumbs />
        </div>
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='sm:w-[180px]'>
          <PgSelection />
        </div>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <UserNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
