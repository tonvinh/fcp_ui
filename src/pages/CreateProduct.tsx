import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileUp, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TabGia } from '../components/product/TabGia';
import { TabThietBiKemTheo } from '../components/product/TabThietBiKemTheo';
import { PricingPolicyPhamVi } from '../components/pricing/PricingPolicyPhamVi';
import { cn } from '../lib/utils';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [serviceOption, setServiceOption] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('ThongTinChung');
  const [cloudDays, setCloudDays] = useState<string>('3 ngày');
  const [shortName, setShortName] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaultTabs = [
    { id: 'ThongTinChung', label: 'Thông tin chung' },
    { id: 'MetaData', label: 'Meta data' },
    { id: 'DanhMuc', label: 'Danh mục' },
    { id: 'PhamVi', label: 'Phạm vi áp dụng' },
    { id: 'Gia', label: 'Giá' },
  ];

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!shortName.trim()) newErrors.shortName = 'Vui lòng nhập tên ngắn sản phẩm';
    if (!serviceOption) newErrors.serviceOption = 'Vui lòng chọn loại sản phẩm';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setActiveTab('ThongTinChung');
      return;
    }
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const getDynamicTabs = () => {
    switch (serviceOption) {
      case 'Internet only': return [{ id: 'ThietBiKemTheo', label: 'Thiết bị kèm theo' }, { id: 'Internet', label: 'Internet' }];
      case 'Combo Internet FPT Play': return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'FPTPlay', label: 'FPT Play' }];
      case 'Combo Internet Camera': return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'Camera', label: 'Camera' }];
      case 'Combo Internet FPT Play Camera': return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'FPTPlay', label: 'FPT Play' }, { id: 'Camera', label: 'Camera' }];
      case 'FPT Play Only': return [{ id: 'FPTPlay', label: 'FPT Play' }];
      case 'Camera': return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Camera', label: 'Camera' }];
      default: return [];
    }
  };

  const currentTabs = [...defaultTabs, ...getDynamicTabs()];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ThietBiKemTheo': return <TabThietBiKemTheo />;
      case 'ThongTinChung':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label={<>Tên ngắn <span className="text-red-500">*</span></>}
                placeholder="Nhập tên ngắn..."
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                error={errors.shortName}
              />
              <Input label="Tên dài" placeholder="Nhập tên dài..." />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả ngắn</label>
              <div className="bg-white rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-fpt-orange/20 focus-within:border-fpt-orange transition-all">
                <div className="bg-slate-50 border-b px-3 py-1.5 flex gap-1">
                  {['B', 'I', 'U'].map(f => <button key={f} className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200 rounded transition-colors text-slate-600">{f}</button>)}
                </div>
                <textarea placeholder="Nhập mô tả ngắn..." className="w-full h-28 p-3 focus:outline-none resize-none text-sm text-slate-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả dài</label>
              <div className="bg-white rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-fpt-orange/20 focus-within:border-fpt-orange transition-all">
                <div className="bg-slate-50 border-b px-3 py-1.5 flex gap-1">
                  {['B', 'I', 'U'].map(f => <button key={f} className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200 rounded transition-colors text-slate-600">{f}</button>)}
                  <span className="w-px h-4 bg-slate-300 mx-1.5 my-auto" />
                  {['Heading 1', 'Heading 2'].map(h => <button key={h} className="px-2 py-0.5 text-xs hover:bg-slate-200 rounded transition-colors text-slate-600">{h}</button>)}
                </div>
                <textarea placeholder="Nhập mô tả dài chi tiết..." className="w-full h-52 p-3 focus:outline-none resize-none text-sm text-slate-700" />
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100">Hình ảnh <span className="text-slate-400 font-normal">(Tối đa 1MB/hình)</span></h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['1:1', '5:4', '4:3'].map((ratio) => (
                  <div key={ratio} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <p className="font-semibold text-xs text-slate-600 mb-2.5 uppercase tracking-wide">Tỉ lệ {ratio}</p>
                    <div className="border-2 border-dashed border-slate-300 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-fpt-orange/40 transition-all cursor-pointer group">
                      <FileUp className="w-5 h-5 mb-1.5 group-hover:text-fpt-orange transition-colors" />
                      <span className="text-xs font-medium text-slate-500 group-hover:text-fpt-orange">Click upload</span>
                      <span className="text-xs mt-0.5 text-slate-400">≤ 10 hình</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100">Video <span className="text-slate-400 font-normal">(Tối đa 5 video, ≤ 100MB/video)</span></h4>
              <div className="border-2 border-dashed border-slate-300 rounded-xl py-10 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-fpt-orange/40 transition-all cursor-pointer group bg-slate-50">
                <FileUp className="w-7 h-7 mb-2 group-hover:text-fpt-orange transition-colors" />
                <span className="font-medium text-slate-500 group-hover:text-fpt-orange">Click để chọn Upload Video</span>
              </div>
            </div>
          </div>
        );

      case 'MetaData':
        return (
          <div className="space-y-5 max-w-3xl">
            <Input label="Tiêu đề (Title)" placeholder="SEO Title..." />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả (Description)</label>
              <textarea className="w-full flex min-h-[100px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange" placeholder="SEO Description..." />
            </div>
            <Input label="Từ khóa (Keywords)" placeholder="Nhập từ khóa, cách nhau dấu phẩy..." />
            <Input label="Đường dẫn (Slug)" placeholder="duong-dan-san-pham" />
          </div>
        );

      case 'DanhMuc':
        return (
          <div className="space-y-6">
            <p className="text-sm text-slate-500">Cây thư mục 2 cấp. Chọn cấp 2 sẽ tự động chọn cấp 1. Cho phép chọn nhiều danh mục.</p>
            <div className="border border-slate-200 rounded-xl p-5 bg-white max-w-2xl shadow-sm space-y-4">
              {[
                { label: 'Internet', children: ['Internet gia đình', 'Internet doanh nghiệp', 'Nâng cấp Internet'] },
                { label: 'Truyền hình & Giải trí', children: ['FPT Play', 'Combo Internet FPT Play'] },
                { label: 'Camera & Smart Home', children: ['Camera trong nhà', 'Camera ngoài trời', 'Gói lưu trữ Cloud'] },
                { label: 'Thiết bị', children: ['Modem / Router', 'Mesh WiFi', 'Camera'] },
                { label: 'Giải pháp theo nhu cầu', children: ['Khôi phục', 'Nâng cấp', 'Mua thêm'] },
              ].map(({ label, children }, i) => (
                <div key={label} className={i > 0 ? 'pt-4 border-t border-slate-100' : ''}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange/30" />
                    <span className="text-sm font-semibold text-slate-800">{label}</span>
                  </label>
                  <div className="pl-7 space-y-2.5 border-l-2 border-slate-100 ml-2 mt-2.5">
                    {children.map((child) => (
                      <label key={child} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange/30" />
                        <span className="text-sm text-slate-700">{child}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Internet':
        return (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-2 gap-6">
              <Input label="Tốc độ download (Mbps)" placeholder="VD: 150" type="number" />
              <Input label="Tốc độ upload (Mbps)" placeholder="VD: 150" type="number" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Hạ tầng</label>
              <div className="flex gap-6 mt-1">
                {['GPON', 'XGSPON'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="hatang" className="w-4 h-4 text-fpt-orange focus:ring-fpt-orange/30 border-slate-300" defaultChecked={opt === 'GPON'} />
                    <span className="text-sm font-medium text-slate-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'FPTPlay':
        return (
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <label className="block text-sm font-bold text-slate-800">Nền tảng hỗ trợ</label>
              <div className="flex flex-wrap gap-3">
                {['Website', 'Mobile', 'TV', 'FPT Play Box'].map((platform) => (
                  <label key={platform} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange/30" />
                    <span className="text-sm font-medium text-slate-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Số thiết bị đăng nhập tối đa</label>
                <select className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30">
                  <option>1 thiết bị</option><option>3 thiết bị</option><option>5 thiết bị</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Chất lượng xem</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['720p', '1080p', '2K', '4K'].map((quality) => (
                    <label key={quality} className="flex items-center gap-1.5 border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange/30 w-4 h-4" defaultChecked={quality === '1080p' || quality === '720p'} />
                      <span className="text-sm font-medium text-slate-700">{quality}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Thiết bị xem đồng thời</label>
                <select className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30">
                  <option>1 thiết bị</option><option>3 thiết bị</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-3 border-t border-slate-100">
              {['Bóng đá Việt', 'Bóng đá Anh', 'Phim bộ mới nhất', 'Phim bom tấn Âu Mỹ'].map((feat, i) => (
                <div key={feat} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">{feat}</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i === 0 || i === 2} />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-fpt-orange/30 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fpt-orange" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Camera':
        return (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Chất lượng xem</label>
                <select className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30">
                  <option>HD (720p)</option><option>Full HD (1080p)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Số ngày lưu trữ Cloud</label>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 h-9 items-center">
                  {['1 ngày', '3 ngày', '7 ngày', '15 ngày'].map((days) => (
                    <label key={days} className={cn('flex-1 text-center py-1 rounded-md text-xs cursor-pointer transition-all', cloudDays === days ? 'bg-white shadow-sm font-bold text-fpt-orange' : 'text-slate-500 hover:text-slate-700')}>
                      <input type="radio" name="luutru" className="sr-only" checked={cloudDays === days} onChange={() => setCloudDays(days)} />
                      {days}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-12 pt-3">
              {['Công nghệ AI', 'Lưu trữ an toàn'].map((label) => (
                <div key={label} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">{label}</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-fpt-orange/30 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fpt-orange" />
                    <span className="ms-3 text-sm text-slate-600 font-medium">Bật</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'PhamVi': return <PricingPolicyPhamVi />;
      case 'Gia': return <TabGia serviceOption={serviceOption} />;
      default:
        return (
          <div className="py-20 text-center text-slate-400">
            <p className="text-base font-medium text-slate-600 mb-1">Nội dung tab đang được phát triển</p>
            <p className="text-sm">Nội dung sẽ được cập nhật theo đặc thù dịch vụ.</p>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-6 w-full overflow-x-hidden">
      {/* Toast notification */}
      {saveStatus === 'saved' && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">Lưu sản phẩm thành công!</span>
        </div>
      )}
      {saveStatus === 'saving' && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-slate-700 text-white px-5 py-3 rounded-xl shadow-xl">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-semibold text-sm">Đang lưu...</span>
        </div>
      )}
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">{shortName || 'Tạo Sản phẩm mới'}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Cấu hình thông tin, metadata và thông số dịch vụ</p>
        </div>
      </div>

      {/* Service type selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
        <label className="block text-xs font-bold text-[#163172] uppercase tracking-widest mb-2">
          Loại Sản phẩm (Service) <span className="text-red-500">*</span>
        </label>
        <select
          value={serviceOption}
          onChange={(e) => { setServiceOption(e.target.value); setActiveTab('ThongTinChung'); setErrors({}); }}
          className={cn(
            "h-11 w-full max-w-lg rounded-lg border-2 bg-white px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-fpt-orange focus:ring-2 focus:ring-fpt-orange/20 transition-all shadow-sm cursor-pointer",
            errors.serviceOption ? 'border-red-400' : 'border-slate-200'
          )}
        >
          <option value="" disabled>-- Vui lòng chọn loại sản phẩm --</option>
          <option value="Internet only">Internet only</option>
          <option value="Combo Internet FPT Play">Combo Internet + FPT Play</option>
          <option value="Combo Internet Camera">Combo Internet + Camera</option>
          <option value="Combo Internet FPT Play Camera">Combo Internet + FPT Play + Camera</option>
          <option value="FPT Play Only">FPT Play Only</option>
          <option value="Camera">Camera</option>
        </select>
        {errors.serviceOption && <p className="text-sm text-red-500 mt-1.5">{errors.serviceOption}</p>}
      </div>

      {/* Tab content */}
      <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300', serviceOption ? 'opacity-100' : 'opacity-50 pointer-events-none')}>
        {/* Tab headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-50/80 px-2 pt-2 gap-0.5">
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-2.5 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-all border-b-2',
                activeTab === tab.id
                  ? 'border-fpt-orange bg-white text-fpt-orange shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="p-7">{renderTabContent()}</div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button variant="primary" icon={Save} size="lg" onClick={handleSave} isLoading={saveStatus === 'saving'}>
            {saveStatus === 'saved' ? 'Đã lưu!' : 'Lưu sản phẩm'}
          </Button>
        </div>
      </div>
    </main>
  );
};
