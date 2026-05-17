import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, Settings, LogOut,
  ChevronLeft, ChevronRight, FileText, Calculator, Signal
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const menuGroups = [
  {
    label: 'Tổng quan',
    items: [
      { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard', disabled: true },
    ]
  },
  {
    label: 'Danh mục',
    items: [
      { icon: Package, label: 'Sản phẩm & Dịch vụ', path: '/' },
      { icon: FileText, label: 'Chính sách giá', path: '/pricing-policies', indent: true },
    ]
  },
  {
    label: 'Quản lý',
    items: [
      { icon: Users, label: 'Khách hàng', path: '/customers', disabled: true },
    ]
  },
  {
    label: 'Cài đặt',
    items: [
      { icon: Settings, label: 'Cài đặt hệ thống', path: '/settings', disabled: true },
      { icon: Calculator, label: 'Phân bổ giá', path: '/settings/price-allocation', indent: true },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/create' || location.pathname.startsWith('/detail');
    if (path === '/pricing-policies') return location.pathname === '/pricing-policies' || location.pathname.startsWith('/pricing-policies/');
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 select-none',
        'bg-[#0D214F]',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-white/10 shrink-0',
          isCollapsed ? 'justify-center px-0' : 'px-5'
        )}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-fpt-orange flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-900/40 shrink-0">
            F
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                FPT Telecom
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <Signal className="w-2.5 h-2.5 text-fpt-orange" />
                <span className="text-[10px] text-blue-300/80 font-medium tracking-widest uppercase">
                  Catalog Platform
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto dark-scrollbar py-4 px-3 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, idx) => {
                const active = isActive(item.path);
                const isDisabled = 'disabled' in item && item.disabled;
                return (
                  <button
                    key={idx}
                    onClick={() => !isDisabled && navigate(item.path)}
                    title={isCollapsed ? item.label : (isDisabled ? 'Đang phát triển' : undefined)}
                    disabled={isDisabled}
                    className={cn(
                      'w-full flex items-center py-2.5 rounded-lg transition-all duration-150 text-sm font-medium group',
                      isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3',
                      item.indent && !isCollapsed ? 'pl-8' : '',
                      isDisabled
                        ? 'text-white/20 cursor-not-allowed'
                        : active
                          ? 'bg-fpt-orange text-white shadow-md shadow-black/20'
                          : 'text-white/55 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-[18px] h-[18px] shrink-0 transition-colors',
                        isDisabled ? 'text-white/20' : active ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap leading-none flex items-center gap-2">
                        {item.label}
                        {isDisabled && (
                          <span className="text-[9px] font-bold bg-white/10 text-white/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Soon
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-white/10 space-y-0.5">
        <button
          onClick={onToggle}
          title={isCollapsed ? 'Mở rộng' : undefined}
          className={cn(
            'w-full flex items-center py-2.5 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-all text-sm font-medium',
            isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'
          )}
        >
          {isCollapsed
            ? <ChevronRight className="w-[18px] h-[18px] shrink-0" />
            : <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
          }
          {!isCollapsed && <span className="whitespace-nowrap">Thu gọn menu</span>}
        </button>

        <button
          title={isCollapsed ? 'Đăng xuất' : undefined}
          className={cn(
            'w-full flex items-center py-2.5 rounded-lg text-white/40 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium',
            isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'
          )}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
