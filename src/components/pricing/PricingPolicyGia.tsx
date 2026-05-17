import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { TabGia } from '../product/TabGia';
import { cn } from '../../lib/utils';

// --- MultiSelect Component ---
interface MultiSelectProps {
  options: { id: string, name: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedIds, onChange, placeholder }) => {
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

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedIds.filter(i => i !== id));
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[36px] px-2 py-1 bg-white border border-slate-300 rounded-md cursor-pointer flex items-center flex-wrap gap-1 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
      >
        {selectedIds.length === 0 ? (
          <span className="text-slate-400 text-sm ml-1">{placeholder}</span>
        ) : (
          selectedIds.map(id => {
            const opt = options.find(o => o.id === id);
            return (
              <span key={id} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                <span className="truncate max-w-[100px]">{opt?.name}</span>
                <button type="button" onClick={(e) => removeOption(e, id)} className="ml-1 text-blue-400 hover:text-blue-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-md max-h-60 overflow-y-auto p-1">
          {options.map(opt => (
            <label key={opt.id} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer rounded">
              <input 
                type="checkbox" 
                checked={selectedIds.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-slate-700">{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
interface PriceConfig {
  id: string;
  scopeIds: string[];
  productIds: string[];
  isExpanded: boolean;
}

export const PricingPolicyGia: React.FC = () => {
  const [configs, setConfigs] = useState<PriceConfig[]>([]);

  // These could eventually come from Context/Props mapped from Tab 1 & Tab 2
  const scopes = [
    { id: 'all', name: 'Phạm vi: Toàn quốc' },
    { id: 'mb', name: 'Phạm vi: Miền Bắc' },
    { id: 'mn', name: 'Phạm vi: Miền Nam' },
    { id: 'custom_1', name: 'Phạm vi: Nhóm Tòa nhà' }
  ];

  const products = [
    { id: 'giga', name: 'Giga (Internet)' },
    { id: 'sky', name: 'Sky (Internet)' },
    { id: 'combo_sky', name: 'Combo Sky (Internet + FPT Play)' },
    { id: 'camera', name: 'Camera IQ3' }
  ];

  const addConfig = () => {
    setConfigs([
      ...configs,
      {
        id: Date.now().toString(),
        scopeIds: [],
        productIds: [],
        isExpanded: true
      }
    ]);
  };

  const removeConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const updateConfig = (id: string, field: keyof PriceConfig, value: any) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cấu hình Bảng giá</h2>
          <p className="text-sm text-slate-500">Thiết lập nhiều mức giá, mỗi mức giá áp dụng cho nhiều phạm vi và sản phẩm</p>
        </div>
        
        <Button variant="primary" icon={Plus} onClick={addConfig}>
          Thêm cấu hình giá
        </Button>
      </div>

      <div className="p-6 flex flex-col space-y-6">
        {configs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-blue-500" />
             </div>
             <p className="text-lg font-medium text-slate-700">Chưa có cấu hình giá nào</p>
             <p className="text-sm mt-1 mb-4">Tạo cấu hình giá để liên kết Sản phẩm với Phạm vi áp dụng</p>
             <Button variant="primary" icon={Plus} onClick={addConfig}>Thêm cấu hình giá đầu tiên</Button>
          </div>
        ) : (
          configs.map((config, index) => {
            const combinedProductNames = products
              .filter(p => config.productIds.includes(p.id))
              .map(p => p.name)
              .join(', ');

            return (
              <div key={config.id} className="border border-blue-200 bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:border-blue-400">
                {/* Config Header */}
                <div className="bg-blue-50/50 px-5 py-4 border-b border-blue-100 flex items-start lg:items-center justify-between flex-col lg:flex-row gap-4">
                  <div className="flex items-center space-x-4 flex-1 w-full">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {index + 1}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full max-w-4xl">
                      <MultiSelect 
                        options={scopes}
                        selectedIds={config.scopeIds}
                        onChange={(ids) => updateConfig(config.id, 'scopeIds', ids)}
                        placeholder="-- Chọn nhiều Phạm vi áp dụng --"
                      />
                      
                      <MultiSelect 
                        options={products}
                        selectedIds={config.productIds}
                        onChange={(ids) => updateConfig(config.id, 'productIds', ids)}
                        placeholder="-- Chọn nhiều Sản phẩm / Dịch vụ --"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 shrink-0 self-end lg:self-auto">
                    <button 
                      type="button"
                      onClick={() => updateConfig(config.id, 'isExpanded', !config.isExpanded)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors flex items-center"
                    >
                      {config.isExpanded ? (
                        <><ChevronUp className="w-4 h-4 mr-1" /> Thu gọn</>
                      ) : (
                        <><ChevronDown className="w-4 h-4 mr-1" /> Mở rộng bảng giá</>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeConfig(config.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Xóa cấu hình này"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Config Body - Reuse TabGia */}
                {config.isExpanded && (
                  <div className="p-5 bg-white">
                    {config.productIds.length === 0 ? (
                      <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <ChevronUp className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">Vui lòng chọn ít nhất 1 sản phẩm / dịch vụ ở trên</p>
                        <p className="text-xs mt-1">Hệ thống sẽ tải bảng giá tương ứng với các sản phẩm được chọn.</p>
                      </div>
                    ) : (
                      <div className="mt-[-24px]">
                          {/* Pass concatenated names to TabGia so it shows relevant sub-forms (Internet, FPT Play, etc.) */}
                          <TabGia serviceOption={combinedProductNames} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
