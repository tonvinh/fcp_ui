import React, { useState, useRef, useEffect } from 'react';
import { Edit2, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TagBlockProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hasDropdown?: boolean;
  headerCheckbox?: string;
  isHeaderChecked?: boolean;
  onHeaderCheckboxChange?: (checked: boolean) => void;
}

const TagBlock: React.FC<TagBlockProps> = ({ 
  title, 
  options, 
  selected, 
  onChange, 
  hasDropdown = false, 
  headerCheckbox = 'Tất cả',
  isHeaderChecked = false,
  onHeaderCheckboxChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeTag = (tagToRemove: string) => {
    onChange(selected.filter(tag => tag !== tagToRemove));
  };

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(t => t !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleHeaderCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (onHeaderCheckboxChange) {
      onHeaderCheckboxChange(checked);
    }
    if (checked) {
      onChange([...options]);
    } else {
      onChange([]);
    }
  };

  return (
    <div className="flex flex-col space-y-1 relative" ref={dropdownRef}>
      <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
        <span>{title}</span>
        <label className="flex items-center space-x-1.5 font-normal text-slate-500 text-xs cursor-pointer">
          <input 
            type="checkbox" 
            checked={isHeaderChecked || (selected.length === options.length && options.length > 0)}
            onChange={handleHeaderCheck}
            className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
          />
          <span>{headerCheckbox}</span>
        </label>
      </div>
      
      {hasDropdown && (
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span>Đã chọn ({selected.length})</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-md z-50 max-h-48 overflow-y-auto p-2">
              {options.map(opt => (
                <label key={opt} className="flex items-center space-x-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selected.includes(opt)}
                    onChange={() => toggleOption(opt)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2 bg-white border border-slate-200 p-2 rounded-md h-32 overflow-y-auto custom-scrollbar content-start">
        {selected.length === 0 && <span className="text-xs text-slate-400 italic w-full text-center mt-4">Chưa có mục nào</span>}
        {selected.map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-blue-600 text-white text-xs font-medium h-fit">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-blue-100 hover:text-white transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- DATA ---
const CUSTOMER_TYPES = ['Doanh nghiệp (Tổ chức/Hộ kinh doanh)', 'Cơ quan nhà nước', 'Đơn vị sự nghiệp', 'ĐSQ, Tổ chức phi chính phủ'];
const CUSTOMER_TARGETS = ['ISP khác', 'KH đối ngoại', 'Chuỗi dự án/ KH nhiều HĐ', 'Nhà báo', 'Nhà trọ/ cho thuê', 'Ký túc xá', 'F-Citizen', 'Đối tượng khác'];
const CHANNELS = ['Mobile', 'Desktop', 'WebSDK', 'DKOL', 'Inside', 'Outside', 'API'];
const SALES_UNITS = ['TIN/PNC', 'GDV', 'KDDA', 'BCOL (KDDA)', 'KDPP', 'CTV thường', 'ĐKOL', 'AM', 'TGDD', 'Khách bình thường ở HiFPT', 'Canh tổ HiFPT', 'CTV HiFPT', 'Đại lý Canh tổ', 'Đối tác kinh doanh', 'Thế Giới Di Động', 'Quản lý ĐTKD'];
const PAYMENT_METHODS = ['Tiền mặt COD', 'Tiền mặt', 'VNPay-QR', 'FoxPay-QR', 'Momo-QR', 'Napas', 'Foxpay', 'TPBank-mPOS', 'MBBank', 'FRT', 'TGDD Thu Hộ'];
const SERVICES = ['Internet', 'FPT Play', 'Camera'];
const CUST_CATEGORIES = ['KH mới', 'KH cũ', 'KH chuyển đổi'];

export const PricingPolicyThongTinChung: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    code: 'INT.2212166',
    name: 'Chính sách nền Giga, Sky, Meta',
    dateFrom: '2022-12-01',
    dateTo: '',
    custCategories: ['KH mới'],
    comboType: 'Only',
    services: ['Internet'],
    createdFrom: '',
    policyClass: 'CS chung',
    crossSell: 'Có',
    minPayment: '',
    minPaymentUnit: '%',
    additionalInfo: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Right Column State
  const [selectedCustTypes, setSelectedCustTypes] = useState<string[]>(['Doanh nghiệp (Tổ chức/Hộ kinh doanh)', 'Cơ quan nhà nước']);
  const [selectedTargets, setSelectedTargets] = useState<string[]>(CUSTOMER_TARGETS);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(CHANNELS);
  const [selectedSalesUnits, setSelectedSalesUnits] = useState<string[]>(SALES_UNITS.slice(0, 12));
  const [selectedPayments, setSelectedPayments] = useState<string[]>(PAYMENT_METHODS);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#0D214F] px-6 py-4 flex items-center space-x-2">
        <h2 className="text-base font-bold text-white">Thông tin chung</h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Mã chính sách</label>
            <input type="text" value={formData.code} onChange={e => updateField('code', e.target.value)} className="w-full h-8 px-3 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Tên chính sách</label>
            <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full h-8 px-3 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Thời gian hiệu lực</label>
            <div className="flex items-center space-x-2">
              <input type="date" value={formData.dateFrom} onChange={e => updateField('dateFrom', e.target.value)} className="w-full h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
              <span className="text-sm text-slate-500">đến</span>
              <input type="date" value={formData.dateTo} onChange={e => updateField('dateTo', e.target.value)} className="w-full h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-2 relative group">
            <label className="text-sm font-medium text-slate-700 mt-1">Phân loại KH</label>
            <div className="flex flex-wrap gap-1.5 p-1 min-h-[32px] border border-slate-300 rounded focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              {formData.custCategories.map(cat => (
                <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-medium">
                  {cat}
                  <button type="button" onClick={() => updateField('custCategories', formData.custCategories.filter(c => c !== cat))} className="ml-1 text-blue-100 hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <select 
                className="flex-1 text-sm outline-none bg-transparent min-w-[80px]"
                value=""
                onChange={(e) => {
                  if (e.target.value && !formData.custCategories.includes(e.target.value)) {
                    updateField('custCategories', [...formData.custCategories, e.target.value]);
                  }
                }}
              >
                <option value="" disabled>Thêm...</option>
                {CUST_CATEGORIES.filter(c => !formData.custCategories.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Only/Combo</label>
            <div className="grid grid-cols-2 gap-2">
              <select value={formData.comboType} onChange={e => updateField('comboType', e.target.value)} className="h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Only">Only</option>
                <option value="Combo">Combo</option>
              </select>
              <select className="h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" disabled>
                <option></option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-2 relative">
            <label className="text-sm font-medium text-slate-700 mt-1">Service</label>
            <div className="flex flex-wrap gap-1.5 p-1 min-h-[32px] border border-slate-300 rounded focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              {formData.services.map(srv => (
                <span key={srv} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-medium">
                  {srv}
                  <button type="button" onClick={() => updateField('services', formData.services.filter(s => s !== srv))} className="ml-1 text-blue-100 hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <select 
                className="flex-1 text-sm outline-none bg-transparent min-w-[80px]"
                value=""
                onChange={(e) => {
                  if (e.target.value && !formData.services.includes(e.target.value)) {
                    updateField('services', [...formData.services, e.target.value]);
                  }
                }}
              >
                <option value="" disabled>Thêm...</option>
                {SERVICES.filter(s => !formData.services.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Tạo từ đề xuất</label>
            <input type="text" value={formData.createdFrom} onChange={e => updateField('createdFrom', e.target.value)} className="w-full h-8 px-3 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Phân loại CS</label>
            <div className="flex items-center space-x-2">
              <select value={formData.policyClass} onChange={e => updateField('policyClass', e.target.value)} className="flex-1 h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="CS chung">CS chung</option>
                <option value="CS đặc thù">CS đặc thù</option>
              </select>
              <button type="button" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Bán chéo tỉnh/thành</label>
            <select value={formData.crossSell} onChange={e => updateField('crossSell', e.target.value)} className="w-full h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Có">Có</option>
              <option value="Không">Không</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Thanh toán tối thiểu</label>
            <div className="flex items-center space-x-2">
              <select className="flex-1 h-8 px-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option></option>
              </select>
              <div className="flex items-center w-20">
                <input type="text" value={formData.minPayment} onChange={e => updateField('minPayment', e.target.value)} className="w-full h-8 px-2 text-sm border border-slate-300 rounded-l outline-none focus:border-blue-500" />
                <span className="h-8 px-2 flex items-center bg-slate-100 border border-l-0 border-slate-300 rounded-r text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-2 h-full">
            <label className="text-sm font-medium text-slate-700 mt-2">Thông tin thêm</label>
            <textarea value={formData.additionalInfo} onChange={e => updateField('additionalInfo', e.target.value)} className="w-full h-24 p-2 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>
        </div>

        {/* Right Columns - Tags & Selections */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0">
          
          <TagBlock 
            title="Loại khách hàng" 
            hasDropdown={true}
            options={CUSTOMER_TYPES}
            selected={selectedCustTypes}
            onChange={setSelectedCustTypes}
          />
          
          <TagBlock 
            title="Đối tượng KH" 
            hasDropdown={true}
            options={CUSTOMER_TARGETS}
            selected={selectedTargets}
            onChange={setSelectedTargets}
          />
          
          <TagBlock 
            title="Kênh bán hàng" 
            headerCheckbox="Cơ bản"
            hasDropdown={true}
            options={CHANNELS}
            selected={selectedChannels}
            onChange={setSelectedChannels}
          />

          <TagBlock 
            title="Đơn vị bán hàng" 
            hasDropdown={true}
            headerCheckbox="Cơ bản"
            options={SALES_UNITS}
            selected={selectedSalesUnits}
            onChange={setSelectedSalesUnits}
          />

          {/* PT Thanh toán spans more width to look balanced */}
          <div className="md:col-span-2 lg:col-span-4 mt-2">
             <TagBlock 
              title="PT Thanh toán" 
              hasDropdown={true}
              options={PAYMENT_METHODS}
              selected={selectedPayments}
              onChange={setSelectedPayments}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
