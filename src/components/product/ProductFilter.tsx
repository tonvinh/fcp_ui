import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Search, SlidersHorizontal, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

const SUB_SERVICES: Record<string, string[]> = {
  'Internet': ['Giga', 'Sky', 'Meta'],
  'FPT Play': ['VIP', 'V.VIP'],
  'Camera': ['IQ1', 'IQ3', 'IQ7'],
  'Smart Home': ['Sky', 'Meta'],
};

export interface ProductFilterValues {
  code: string;
  name: string;
  service: string;
  subService: string;
  status: string;
}

interface ProductFilterProps {
  onFilter: (values: ProductFilterValues) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [subService, setSubService] = useState('');
  const [status, setStatus] = useState('');

  const availableSubServices = service ? SUB_SERVICES[service] || [] : [];

  const handleSearch = () => {
    onFilter({ code, name, service, subService, status });
  };

  const handleReset = () => {
    setCode('');
    setName('');
    setService('');
    setSubService('');
    setStatus('');
    onFilter({ code: '', name: '', service: '', subService: '', status: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-slate-700">
          <SlidersHorizontal className="w-4 h-4 text-fpt-orange" />
          <span className="text-sm font-semibold">Bộ lọc tìm kiếm</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
          <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
          {isExpanded
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Nhập mã sản phẩm..."
              label="Mã sản phẩm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Nhập tên sản phẩm..."
              label="Tên sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Service</label>
              <select
                value={service}
                onChange={(e) => { setService(e.target.value); setSubService(''); }}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange transition-colors"
              >
                <option value="">Tất cả Service</option>
                <option value="Internet">Internet</option>
                <option value="FPT Play">FPT Play</option>
                <option value="Camera">Camera</option>
                <option value="Smart Home">Smart Home</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Sub service</label>
              <select
                disabled={!service}
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">{service ? 'Tất cả' : 'Chọn Service trước'}</option>
                {availableSubServices.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange transition-colors"
              >
                <option value="">Tất cả</option>
                <option value="active">Đang kinh doanh</option>
                <option value="inactive">Ngừng kinh doanh</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" icon={RefreshCcw} size="sm" onClick={handleReset}>Đặt lại</Button>
            <Button variant="primary" icon={Search} size="sm" onClick={handleSearch}>Tìm kiếm</Button>
          </div>
        </div>
      )}
    </div>
  );
};
