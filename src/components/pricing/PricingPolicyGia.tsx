import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp, X, Map, Tag, StickyNote } from 'lucide-react';
import { TabGiaConfig } from '../product/TabGia';
import { cn } from '../../lib/utils';

// ─── MultiSelect ─────────────────────────────────────────────────────────────
interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  accentClass?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options, selectedIds, onChange, placeholder,
  accentClass = 'bg-[#0D214F] text-white border-[#0D214F]',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);

  const remove = (e: React.MouseEvent, id: string) => { e.stopPropagation(); onChange(selectedIds.filter(i => i !== id)); };

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'min-h-[38px] w-full px-2.5 py-1.5 bg-white border rounded-lg cursor-pointer flex items-center flex-wrap gap-1.5 transition-all',
          isOpen ? 'border-fpt-orange ring-2 ring-fpt-orange/20' : 'border-slate-300 hover:border-slate-400'
        )}
      >
        {selectedIds.length === 0 ? (
          <span className="text-slate-400 text-sm">{placeholder}</span>
        ) : selectedIds.map(id => {
          const opt = options.find(o => o.id === id);
          return (
            <span key={id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border', accentClass)}>
              <span className="truncate max-w-[120px]">{opt?.name}</span>
              <button type="button" onClick={e => remove(e, id)} className="opacity-70 hover:opacity-100 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl max-h-56 overflow-y-auto custom-scrollbar p-1.5">
          {options.map(opt => (
            <label key={opt.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" checked={selectedIds.includes(opt.id)} onChange={() => toggle(opt.id)}
                className="w-4 h-4 rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange/30" />
              <span className="text-sm text-slate-700 font-medium">{opt.name}</span>
            </label>
          ))}
          {options.length === 0 && <p className="text-xs text-slate-400 text-center py-3">Không có tùy chọn</p>}
        </div>
      )}
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SCOPES = [
  { id: 'all', name: 'Toàn quốc' }, { id: 'mb', name: 'Miền Bắc' },
  { id: 'mn', name: 'Miền Nam' }, { id: 'mt', name: 'Miền Trung' },
  { id: 'custom_1', name: 'Nhóm Tòa nhà đặc biệt' },
];
const PRODUCTS = [
  { id: 'giga', name: 'Giga (Internet)' }, { id: 'sky', name: 'Sky (Internet)' },
  { id: 'meta', name: 'Meta (Internet)' }, { id: 'combo_sky', name: 'Combo Sky (Internet + FPT Play)' },
  { id: 'camera_iq3', name: 'Camera IQ3' }, { id: 'camera_iq7', name: 'Camera IQ7' },
];

// ─── Config shape ──────────────────────────────────────────────────────────────
interface PriceConfig {
  id: string;
  name: string;
  scopeIds: string[];
  productIds: string[];
  note: string;
  isExpanded: boolean;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const PricingPolicyGia: React.FC<{ policy?: any }> = ({ policy }) => {
  const [configs, setConfigs] = useState<PriceConfig[]>(() => {
    if (policy) {
      return [
        {
          id: 'config_1',
          name: 'Cấu hình giá #1',
          scopeIds: ['all'],
          productIds: policy.appliedProducts.map((p: any) => {
            const low = p.toLowerCase();
            if (low === 'giga') return 'giga';
            if (low === 'sky') return 'sky';
            if (low === 'meta') return 'meta';
            if (low.includes('combo')) return 'combo_sky';
            return 'giga';
          }),
          note: 'Không áp dụng chung với các chương trình khuyến mãi Tivi khác.',
          isExpanded: true
        }
      ];
    }
    return [];
  });

  const addConfig = () => {
    const idx = configs.length + 1;
    setConfigs(prev => [...prev, {
      id: Date.now().toString(),
      name: `Cấu hình giá #${idx}`,
      scopeIds: [], productIds: [], note: '', isExpanded: true,
    }]);
  };

  const removeConfig = (id: string) => setConfigs(prev => prev.filter(c => c.id !== id));

  const updateConfig = <K extends keyof PriceConfig>(id: string, field: K, value: PriceConfig[K]) =>
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  // Derive serviceOption string for TabGiaConfig
  const getServiceOption = (productIds: string[]) => {
    const names = PRODUCTS.filter(p => productIds.includes(p.id)).map(p => p.name).join(', ');
    return names;
  };

  return (
    <div className="space-y-6">
      {/* Section header — same style as TabGia */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Cấu hình Bảng giá</h2>
            <p className="text-sm text-slate-500">Thiết lập nhiều mức giá, mỗi mức gắn với phạm vi và sản phẩm áp dụng</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={addConfig}>
            Thêm cấu hình giá
          </Button>
        </div>

        <div className="p-6 flex flex-col space-y-6">
          {/* Empty state */}
          {configs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500">
              <div className="w-14 h-14 rounded-full bg-fpt-orange/10 flex items-center justify-center mb-4">
                <Tag className="w-7 h-7 text-fpt-orange" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Chưa có cấu hình giá nào</p>
              <p className="text-xs mt-1 mb-5 text-slate-400">Mỗi cấu hình liên kết sản phẩm với phạm vi áp dụng tương ứng</p>
              <Button variant="primary" icon={Plus} size="sm" onClick={addConfig}>Thêm cấu hình đầu tiên</Button>
            </div>
          )}

          {/* Config cards — same layout as TabGia */}
          {configs.map((config, index) => {
            const isExpanded = config.isExpanded;
            const hasProducts = config.productIds.length > 0;
            const serviceOption = getServiceOption(config.productIds);

            return (
              <div key={config.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-visible">
                {/* Header — matches TabGia exactly */}
                <div
                  className={cn(
                    'px-5 py-4 flex items-center justify-between cursor-pointer transition-colors',
                    isExpanded ? 'bg-slate-50 border-b border-slate-200' : 'hover:bg-slate-50'
                  )}
                  onClick={() => updateConfig(config.id, 'isExpanded', !isExpanded)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Numbered circle */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </div>
                    {/* Editable name — same as TabGia */}
                    <div className="flex-1 max-w-sm" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={config.name}
                        onChange={e => updateConfig(config.id, 'name', e.target.value)}
                        className="w-full bg-transparent font-bold text-slate-800 text-base focus:outline-none focus:border-b-2 focus:border-blue-500 pb-0.5"
                        placeholder="Nhập tên cấu hình giá..."
                      />
                      {!isExpanded && <p className="text-xs text-slate-500 mt-1">Click để xem hoặc chỉnh sửa chi tiết</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removeConfig(config.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa cấu hình"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-slate-300 mx-1" />
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Body — same wrapper style as TabGia */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50/50">
                    {/* Scope + Products + Note — same grid as TabGia's top section */}
                    <div className="mb-6 pb-6 border-b border-slate-200 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phạm vi */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                            <Map className="w-4 h-4 inline mr-1.5 text-indigo-500" />
                            Phạm vi áp dụng <span className="text-red-500">*</span>
                          </label>
                          <MultiSelect
                            options={SCOPES}
                            selectedIds={config.scopeIds}
                            onChange={ids => updateConfig(config.id, 'scopeIds', ids)}
                            placeholder="Chọn một hoặc nhiều phạm vi..."
                            accentClass="bg-indigo-600 text-white border-indigo-600"
                          />
                          <p className="text-[11px] text-slate-500 mt-1.5">Phạm vi được định nghĩa ở tab "Phạm vi áp dụng"</p>
                        </div>

                        {/* Sản phẩm / Dịch vụ */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                            <Tag className="w-4 h-4 inline mr-1.5 text-fpt-orange" />
                            Sản phẩm / Dịch vụ <span className="text-red-500">*</span>
                          </label>
                          <MultiSelect
                            options={PRODUCTS}
                            selectedIds={config.productIds}
                            onChange={ids => {
                              const singleId = ids.slice(-1);
                              updateConfig(config.id, 'productIds', singleId);
                            }}
                            placeholder="Chọn sản phẩm..."
                            accentClass="bg-fpt-orange text-white border-fpt-orange"
                          />
                          <p className="text-[11px] text-slate-500 mt-1.5">Bảng giá sẽ hiển thị theo sản phẩm được chọn</p>
                        </div>
                      </div>

                      {/* Note */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                          <StickyNote className="w-4 h-4 inline mr-1.5 text-amber-500" />
                          Ghi chú / Điều kiện áp dụng
                        </label>
                        <textarea
                          value={config.note}
                          onChange={e => updateConfig(config.id, 'note', e.target.value)}
                          placeholder="Mô tả điều kiện hoặc ghi chú thêm cho cấu hình này (không bắt buộc)..."
                          rows={2}
                          className="w-full flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange resize-none transition-all"
                        />
                      </div>
                    </div>

                    {/* TabGiaConfig — same as TabGia's body */}
                    {!hasProducts ? (
                      <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        <Tag className="w-8 h-8 mb-3 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">Chưa chọn sản phẩm / dịch vụ</p>
                        <p className="text-xs mt-1">Chọn ít nhất 1 sản phẩm ở trên để hiển thị bảng cấu hình giá</p>
                      </div>
                    ) : (
                      <TabGiaConfig
                        serviceOption={serviceOption}
                        basePrice={0}
                        subPrices={{}}
                        billingCycle="Tháng"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more button */}
          {configs.length > 0 && (
            <button
              onClick={addConfig}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-fpt-orange/40 hover:text-fpt-orange hover:bg-orange-50/30 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm cấu hình giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
