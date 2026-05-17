import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';

const SUB_SERVICES: Record<string, string[]> = {
  internet: ['Giga', 'Sky', 'Meta'],
  fptplay: ['VIP', 'V.VIP'],
  camera: ['IQ1', 'IQ3', 'IQ7']
};

export const ProductFilter: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const availableSubServices = selectedService ? SUB_SERVICES[selectedService] || [] : [];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Bộ lọc tìm kiếm
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input placeholder="Nhập mã sản phẩm..." label="Mã sản phẩm" />
        <Input placeholder="Nhập tên sản phẩm..." label="Tên sản phẩm" />
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Service
          </label>
          <select 
            value={selectedService}
            onChange={handleServiceChange}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Tất cả Service</option>
            <option value="internet">Internet</option>
            <option value="fptplay">FPT Play</option>
            <option value="camera">Camera</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Sub service
          </label>
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
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Trạng thái
          </label>
          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang kinh doanh</option>
            <option value="inactive">Ngừng kinh doanh</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button variant="ghost" icon={RefreshCcw}>Đặt lại</Button>
        <Button variant="primary" icon={Search}>Tìm kiếm</Button>
      </div>
    </div>
  );
};
