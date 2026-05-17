import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Search, Filter, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

export const PricingPolicyFilter: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedService, setSelectedService] = useState('');

  const SUB_SERVICES: Record<string, string[]> = {
    internet: ['Giga', 'Sky', 'Meta'],
    fptplay: ['VIP', 'V.VIP'],
    camera: ['IQ1', 'IQ3', 'IQ7']
  };

  const availableSubServices = selectedService ? SUB_SERVICES[selectedService] || [] : [];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Bộ lọc tìm kiếm
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center space-x-1 text-sm font-medium"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-100 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input placeholder="Nhập mã chính sách..." label="Mã chính sách" />
            <Input placeholder="Nhập tên chính sách..." label="Tên chính sách" />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Service</label>
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Tất cả Service</option>
                <option value="internet">Internet</option>
                <option value="fptplay">FPT Play</option>
                <option value="camera">Camera</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Sub service</label>
              <select 
                disabled={!selectedService}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">{selectedService ? 'Tất cả Sub service' : 'Chọn Service trước'}</option>
                {availableSubServices.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <Input placeholder="Tên sản phẩm/dịch vụ..." label="Sản phẩm / Dịch vụ" />
            <Input placeholder="Nhập email người đề xuất..." label="Người đề xuất" />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Thời gian hiệu lực</label>
              <div className="flex items-center space-x-2">
                <input type="date" className="flex-1 h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-slate-500">-</span>
                <input type="date" className="flex-1 h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Phạm vi áp dụng</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <option value="">Toàn quốc</option>
                <option value="mb">Miền Bắc</option>
                <option value="mn">Miền Nam</option>
                <option value="mt">Miền Trung</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
            <Button variant="ghost" icon={RefreshCcw}>Đặt lại</Button>
            <Button variant="primary" icon={Search}>Tìm kiếm</Button>
          </div>
        </div>
      )}
    </div>
  );
};
