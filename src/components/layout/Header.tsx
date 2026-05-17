import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLocation } from 'react-router-dom';

export interface HeaderProps {
  isCollapsed?: boolean;
}

const BREADCRUMBS: Record<string, { section: string; page: string }> = {
  '/': { section: 'Danh mục', page: 'Danh sách Sản phẩm' },
  '/create': { section: 'Sản phẩm & Dịch vụ', page: 'Tạo sản phẩm mới' },
  '/pricing-policies': { section: 'Danh mục', page: 'Chính sách giá' },
  '/pricing-policies/create': { section: 'Chính sách giá', page: 'Tạo chính sách mới' },
  '/settings/price-allocation': { section: 'Cài đặt', page: 'Phân bổ giá Dịch vụ con' },
};

export const Header: React.FC<HeaderProps> = ({ isCollapsed = false }) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (BREADCRUMBS[path]) return BREADCRUMBS[path];
    if (path.startsWith('/detail/')) return { section: 'Sản phẩm & Dịch vụ', page: 'Chi tiết Sản phẩm' };
    if (path.startsWith('/pricing-policies/')) return { section: 'Chính sách giá', page: 'Chi tiết Chính sách' };
    return { section: 'FPT Catalog', page: 'Quản lý Dịch vụ' };
  };

  const { section, page } = getBreadcrumb();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-30',
        'flex items-center justify-between px-6 transition-all duration-300',
        isCollapsed ? 'left-20' : 'left-64'
      )}
    >
      {/* Left: breadcrumb / title */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-800">FPT Catalog</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">{section}</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-700">{page}</span>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="pl-9 pr-4 py-2 h-9 bg-slate-100 border border-transparent rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-fpt-orange/20 transition-all w-56"
          />
        </div>

        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fpt-orange rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* User */}
        <button className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fpt-orange to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            HO
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Head of Product</p>
            <p className="text-xs text-slate-400 leading-tight">admin@fpt.vn</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </header>
  );
};
