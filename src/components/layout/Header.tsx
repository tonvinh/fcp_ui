import React from 'react';
import { Bell, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HeaderProps {
  isCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isCollapsed = false }) => {
  return (
    <header className={cn("fixed top-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-30 flex items-center justify-between px-6 transition-all duration-300", isCollapsed ? "left-20" : "left-64")}>
      <div className="flex items-center text-slate-800 text-lg font-semibold">
        Quản lý Dịch vụ
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full text-sm outline-none transition-all w-64 ring-2 ring-transparent focus:ring-blue-100"
          />
        </div>
        
        <button className="text-slate-500 hover:text-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-medium group-hover:bg-orange-200 transition-colors">
            HO
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-slate-700">Head of Product</p>
            <p className="text-slate-500 text-xs">admin@fpt.vn</p>
          </div>
        </div>
      </div>
    </header>
  );
};
