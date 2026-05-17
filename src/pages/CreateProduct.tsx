import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileUp } from 'lucide-react';
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

  const defaultTabs = [
    { id: 'ThongTinChung', label: 'Thông tin chung' },
    { id: 'MetaData', label: 'Meta data' },
    { id: 'DanhMuc', label: 'Danh mục' },
    { id: 'PhamVi', label: 'Phạm vi áp dụng' },
    { id: 'Gia', label: 'Giá' },
  ];

  const getDynamicTabs = () => {
    switch (serviceOption) {
      case 'Internet only':
        return [{ id: 'ThietBiKemTheo', label: 'Thiết bị kèm theo' }, { id: 'Internet', label: 'Internet' }];
      case 'Combo Internet FPT Play':
        return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'FPTPlay', label: 'FPT Play' }];
      case 'Combo Internet Camera':
        return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'Camera', label: 'Camera' }];
      case 'Combo Internet FPT Play Camera':
        return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Internet', label: 'Internet' }, { id: 'FPTPlay', label: 'FPT Play' }, { id: 'Camera', label: 'Camera' }];
      case 'FPT Play Only':
        return [{ id: 'FPTPlay', label: 'FPT Play' }];
      case 'Camera':
        return [{ id: 'ThietBiKemTheo', label: 'Thiết bị đi kèm' }, { id: 'Camera', label: 'Camera' }];
      default:
        return [];
    }
  };

  const currentTabs = [...defaultTabs, ...getDynamicTabs()];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'ThietBiKemTheo':
        return <TabThietBiKemTheo />;
      case 'ThongTinChung':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input 
                 label={<>Tên ngắn <span className="text-red-500">*</span></>} 
                 placeholder="Nhập tên ngắn..." 
                 value={shortName}
                 onChange={(e) => setShortName(e.target.value)}
              />
              <Input label="Tên dài" placeholder="Nhập tên dài..." />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả ngắn</label>
              <div className="bg-white rounded-md border border-slate-300 overflow-hidden">
                <div className="bg-slate-50 border-b p-2 flex space-x-2">
                   <button className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded">B</button>
                   <button className="px-2 py-1 text-xs italic hover:bg-slate-200 rounded">I</button>
                   <button className="px-2 py-1 text-xs underline hover:bg-slate-200 rounded">U</button>
                </div>
                <textarea placeholder="Nhập mô tả ngắn..." className="w-full h-32 p-3 focus:outline-none resize-none text-sm text-slate-700" />
              </div>
            </div>

            <div className="space-y-1.5 mt-6">
              <label className="block text-sm font-medium text-slate-700">Mô tả dài</label>
              <div className="bg-white rounded-md border border-slate-300 overflow-hidden">
                <div className="bg-slate-50 border-b p-2 flex space-x-2 text-slate-600">
                   <button className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded">B</button>
                   <button className="px-2 py-1 text-xs italic hover:bg-slate-200 rounded">I</button>
                   <button className="px-2 py-1 text-xs underline hover:bg-slate-200 rounded">U</button>
                   <span className="w-px h-5 bg-slate-300 my-auto mx-2"></span>
                   <button className="px-2 py-1 text-xs hover:bg-slate-200 rounded">Heading 1</button>
                   <button className="px-2 py-1 text-xs hover:bg-slate-200 rounded">Heading 2</button>
                </div>
                <textarea placeholder="Nhập mô tả dài chi tiết..." className="w-full h-64 p-3 focus:outline-none resize-none text-sm text-slate-700" />
              </div>
            </div>

            <div className="pt-8">
              <h4 className="text-md font-semibold text-slate-800 mb-4 border-b pb-2">Hình ảnh (Upload không quá 1MB/hình)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['1:1', '5:4', '4:3'].map(ratio => (
                  <div key={ratio} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <p className="font-semibold text-sm text-slate-800 mb-3">Tỉ lệ {ratio}</p>
                    <div className="border-2 border-dashed border-slate-300 bg-white rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <FileUp className="w-6 h-6 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Click upload (&le;10 hình)</span>
                      <span className="text-xs mt-1 text-slate-400">(Chọn 1 làm mặc định)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 pb-4">
              <h4 className="text-md font-semibold text-slate-800 mb-4 border-b pb-2">Video (Tối đa 5 video, không quá 100MB/video)</h4>
              <div className="border-2 border-dashed border-slate-300 rounded-xl py-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50 group">
                 <FileUp className="w-8 h-8 mb-2 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <span className="font-medium text-slate-600 group-hover:text-amber-600">Click để chọn Upload Video</span>
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
              <textarea className="w-full flex min-h-[100px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="SEO Description..." />
            </div>
            <Input label="Từ khóa (Keywords)" placeholder="Nhập từ khóa, cách nhau dấu phẩy..." />
            <Input label="Đường dẫn (Slug)" placeholder="duong-dan-san-pham" />
          </div>
        );
      case 'DanhMuc':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-end">
                <p className="text-sm text-slate-500">Cây thư mục 2 cấp. Chọn cấp 2 sẽ tự động chọn cấp 1. Cho phép chọn nhiều danh mục.</p>
             </div>
             
             <div className="border border-slate-200 rounded-xl p-6 bg-white max-w-2xl shadow-sm">
                <div className="space-y-4">
                  {/* Internet */}
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                      <span className="text-base font-semibold text-slate-800">Internet</span>
                    </label>
                    <div className="pl-8 space-y-3 border-l-2 border-slate-100 ml-2 mt-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Internet gia đình</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Internet doanh nghiệp</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Nâng cấp Internet</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Truyền hình & Giải trí */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                      <span className="text-base font-semibold text-slate-800">Truyền hình & Giải trí</span>
                    </label>
                    <div className="pl-8 space-y-3 border-l-2 border-slate-100 ml-2 mt-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">FPT Play</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Combo Internet FPT Play</span>
                      </label>
                    </div>
                  </div>

                  {/* Camera & Smart Home */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                      <span className="text-base font-semibold text-slate-800">Camera & Smart Home</span>
                    </label>
                    <div className="pl-8 space-y-3 border-l-2 border-slate-100 ml-2 mt-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Camera trong nhà</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Camera ngoài trời</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Gói lưu trữ Cloud</span>
                      </label>
                    </div>
                  </div>

                  {/* Thiết bị */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                      <span className="text-base font-semibold text-slate-800">Thiết bị</span>
                    </label>
                    <div className="pl-8 space-y-3 border-l-2 border-slate-100 ml-2 mt-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Modem / Router</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Mesh WiFi</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Camera</span>
                      </label>
                    </div>
                  </div>

                  {/* Giải pháp theo nhu cầu */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                      <span className="text-base font-semibold text-slate-800">Giải pháp theo nhu cầu</span>
                    </label>
                    <div className="pl-8 space-y-3 border-l-2 border-slate-100 ml-2 mt-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Khôi phục</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Nâng cấp</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" />
                        <span className="text-sm text-slate-700 font-medium">Mua thêm</span>
                      </label>
                    </div>
                  </div>
                </div>
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
             <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Hạ tầng</label>
                <div className="flex space-x-6 mt-2">
                   <label className="flex items-center space-x-2">
                     <input type="radio" name="hatang" className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer" defaultChecked />
                     <span className="text-sm font-medium text-slate-800">GPON</span>
                   </label>
                   <label className="flex items-center space-x-2">
                     <input type="radio" name="hatang" className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                     <span className="text-sm font-medium text-slate-800">XGSPON</span>
                   </label>
                </div>
             </div>
          </div>
        );
      case 'FPTPlay':
        return (
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-3 border-b border-slate-200 pb-5">
               <label className="block text-sm font-bold text-slate-800">Nền tảng hỗ trợ</label>
               <div className="flex flex-wrap gap-4">
                 {['Website', 'Mobile', 'TV', 'FPT Play Box'].map(platform => (
                    <label key={platform} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                      <span className="text-sm font-medium text-slate-700">{platform}</span>
                    </label>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
               <div className="space-y-1.5">
                 <label className="block text-sm font-medium text-slate-700">Số thiết bị đăng nhập tối đa</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1 thiết bị</option>
                    <option>3 thiết bị</option>
                    <option>5 thiết bị</option>
                 </select>
               </div>
               
               <div className="space-y-1.5">
                 <label className="block text-sm font-medium text-slate-700">Chất lượng xem</label>
                 <div className="flex flex-wrap gap-2 mt-1">
                   {['720p', '1080p', '2K', '4K'].map(quality => (
                     <label key={quality} className="flex items-center space-x-2 border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                       <input type="checkbox" className="rounded text-blue-600 border-slate-300 w-4 h-4 focus:ring-blue-500" defaultChecked={quality === '1080p' || quality === '720p'} />
                       <span className="text-sm font-medium text-slate-700">{quality}</span>
                     </label>
                   ))}
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <label className="block text-sm font-medium text-slate-700">Thiết bị xem NHA đồng thời</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1 thiết bị</option>
                    <option>3 thiết bị</option>
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-700">Bóng đá Việt</label>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-700">Bóng đá Anh</label>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-700">Phim bộ mới nhất</label>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-700">Phim bom tấn Âu Mỹ</label>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
               </div>
            </div>
          </div>
        );
      case 'Camera':
        return (
          <div className="space-y-6 max-w-3xl">
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                 <label className="block text-sm font-medium text-slate-700">Chất lượng xem</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>HD (720p)</option>
                    <option>Full HD (1080p)</option>
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="block text-sm font-medium text-slate-700">Số ngày lưu trữ Cloud</label>
                 <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 h-10 items-center">
                   {['1 ngày', '3 ngày', '7 ngày', '15 ngày'].map((days) => (
                      <label 
                        key={days} 
                        className={cn(
                          "flex-1 text-center py-1 rounded text-sm cursor-pointer transition-colors",
                          cloudDays === days ? "bg-white shadow-sm font-bold text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        )}
                      >
                         <input 
                           type="radio" 
                           name="luutru" 
                           className="sr-only" 
                           checked={cloudDays === days} 
                           onChange={() => setCloudDays(days)}
                         />
                         {days}
                      </label>
                   ))}
                 </div>
               </div>
             </div>

             <div className="flex gap-16 pt-4">
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-slate-700">Công nghệ AI</label>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" defaultChecked />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     <span className="ms-3 text-sm font-medium text-slate-600">Có hỗ trợ</span>
                   </label>
                 </div>
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-slate-700">Lưu trữ an toàn</label>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" defaultChecked />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     <span className="ms-3 text-sm font-medium text-slate-600">Bật bảo vệ</span>
                   </label>
                 </div>
             </div>
          </div>
        );
      case 'PhamVi':
        return <PricingPolicyPhamVi />;
      case 'Gia':
        return <TabGia serviceOption={serviceOption} />;
      default:
        return (
          <div className="py-20 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700 mb-2">Nội dung tab "{currentTabs.find(t => t.id === activeTab)?.label}" đang được phát triển...</p>
            <p className="text-sm">Tab sẽ được cấp dữ liệu chi tiết theo đặc thù thiết bị hoặc gói cước.</p>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-6 z-10 w-full overflow-x-hidden bg-slate-50/50">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{shortName || 'Tạo Sản phẩm mới'}</h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình thông tin, metadata và thông số dịch vụ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="max-w-xl space-y-2">
          <label className="block text-sm font-semibold text-blue-900 uppercase tracking-wide">
            1. Chọn Loại Sản phẩm (Service) <span className="text-red-500">*</span>
          </label>
          <select 
            value={serviceOption}
            onChange={(e) => {
               setServiceOption(e.target.value);
               setActiveTab('ThongTinChung');
            }}
            className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm cursor-pointer"
          >
            <option value="" disabled>-- Vui lòng chọn loại sản phẩm --</option>
            <option value="Internet only">Internet only</option>
            <option value="Combo Internet FPT Play">Combo Internet + FPT Play</option>
            <option value="Combo Internet Camera">Combo Internet + Camera</option>
            <option value="Combo Internet FPT Play Camera">Combo Internet + FPT Play + Camera</option>
            <option value="FPT Play Only">FPT Play Only</option>
            <option value="Camera">Camera</option>
          </select>
        </div>
      </div>

      <div className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300",
        serviceOption ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none translate-y-4"
      )}>
        {/* Tabs header */}
        <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-50 pt-2 px-2">
          {currentTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-colors border-b-2",
                activeTab === tab.id 
                  ? "border-blue-600 bg-white text-blue-700 shadow-[0_-2px_0_0_#2563eb]" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tabs Content */}
        <div className="p-8">
          {renderTabContent()}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <Button variant="primary" icon={Save} size="lg">Lưu sản phẩm</Button>
        </div>
      </div>
    </main>
  );
};
