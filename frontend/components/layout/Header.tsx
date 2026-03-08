'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { UserMenu } from '@/components/common/UserMenu';

export function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4 max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
