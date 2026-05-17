import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Search, SlidersHorizontal, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PricingPolicyFilterValues {
  code: string;
  name: string;
  proposer: string;
  scope: string;
  product: string;
}

interface PricingPolicyFilterProps {
  onFilter: (values: PricingPolicyFilterValues) => void;
}

export const PricingPolicyFilter: React.FC<PricingPolicyFilterProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [proposer, setProposer] = useState('');
  const [scope, setScope] = useState('');
  const [product, setProduct] = useState('');

  const handleSearch = () => {
    onFilter({ code, name, proposer, scope, product });
  };

  const handleReset = () => {
    setCode('');
    setName('');
    setProposer('');
    setScope('');
    setProduct('');
    onFilter({ code: '', name: '', proposer: '', scope: '', product: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Nhập mã chính sách..."
              label="Mã chính sách"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Nhập tên chính sách..."
              label="Tên chính sách"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Email người đề xuất..."
              label="Người đề xuất"
              value={proposer}
              onChange={(e) => setProposer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Phạm vi áp dụng</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 transition-colors"
              >
                <option value="">Tất cả</option>
                <option value="Toàn quốc">Toàn quốc</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Nam">Miền Nam</option>
                <option value="Miền Trung">Miền Trung</option>
              </select>
            </div>
            <Input
              placeholder="Tên sản phẩm/dịch vụ..."
              label="Sản phẩm / Dịch vụ"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
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
