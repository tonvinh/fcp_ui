import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, ChevronLeft, ChevronRight, FileText, Calculator } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
    { icon: Package, label: 'Sản phẩm & Dịch vụ', path: '/' },
    { icon: FileText, label: 'Chính sách giá', path: '/pricing-policies', indent: true },
    { icon: Users, label: 'Khách hàng', path: '/customers' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
    { icon: Calculator, label: 'Phân bổ giá', path: '/settings/price-allocation', indent: true },
  ];

  return (
    <aside className={cn("fixed top-0 left-0 bottom-0 bg-slate-900 text-white z-40 flex flex-col transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      <div className={cn("h-16 flex items-center px-6 border-b border-slate-800", isCollapsed ? "justify-center px-0" : "")}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            F
          </div>
          {!isCollapsed && <span className="text-xl font-bold tracking-tight whitespace-nowrap">FPT Telecom</span>}
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Menu Chính
          </p>
        )}
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/create');
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isCollapsed ? "justify-center" : "space-x-3",
                item.indent && !isCollapsed ? "pl-8" : "",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-200" : "text-slate-500")} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={onToggle}
          className={cn("w-full flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-50 transition-colors text-sm font-medium", isCollapsed ? "justify-center" : "space-x-3")}
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
          {!isCollapsed && <span className="whitespace-nowrap">Thu gọn</span>}
        </button>

        <button className={cn("w-full flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-50 transition-colors text-sm font-medium", isCollapsed ? "justify-center" : "space-x-3")}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 text-slate-500 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
