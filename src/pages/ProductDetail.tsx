import React, { useState } from 'react';
import { ArrowLeft, Edit, Copy, ChevronDown, ChevronUp, Map, DollarSign, Package, CheckCircle2, Info, Tags, Router, Box, FileText, MonitorPlay, Camera as CameraIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

export const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [expandedConfigs, setExpandedConfigs] = useState<Record<string, boolean>>({
    'config_1': true,
    'config_2': false
  });

  // Mock Data for a complex product (Combo Internet + FPT Play + Camera)
  const productDetails = {
    id: id || 'PRD-001',
    code: 'CB-INT-FPT-CAM-2026',
    name: 'Combo Internet + FPT Play + Camera (Giga)',
    status: 'Ban hành',
    createdDate: '10/05/2026',
    createdBy: 'admin@fpt.vn',
    
    // Thong tin chung
    shortDescription: 'Gói Combo toàn diện: Internet tốc độ cao, truyền hình giải trí FPT Play và giải pháp an ninh Camera.',
    longDescription: 'Gói Combo cung cấp giải pháp toàn diện cho hộ gia đình hiện đại. Bao gồm đường truyền Internet cáp quang tốc độ cao (Giga), tài khoản truyền hình FPT Play gói MAX xem trên 3 thiết bị đồng thời, và 1 Camera trong nhà chuẩn hình ảnh 1080p, tích hợp AI nhận diện thông minh.',
    images: 3,
    videos: 1,

    // Meta data
    metaTitle: 'Combo Internet Truyền Hình Camera FPT | Đăng ký ngay',
    metaKeywords: ['combo internet camera', 'fpt play', 'lắp mạng fpt'],
    slug: 'combo-internet-fpt-play-camera-giga',

    // Danh muc
    categories: ['Internet gia đình', 'Combo Internet FPT Play', 'Camera trong nhà'],

    // Dac ta dich vu - Internet
    internet: {
      download: 150,
      upload: 150,
      infrastructure: 'GPON'
    },

    // Dac ta dich vu - FPT Play
    fptPlay: {
      platforms: ['Website', 'Mobile', 'TV', 'FPT Play Box'],
      maxDevices: '3 thiết bị',
      quality: ['720p', '1080p'],
      concurrentDevices: '1 thiết bị',
      features: ['Bóng đá Việt', 'Phim bộ mới nhất']
    },

    // Dac ta dich vu - Camera
    camera: {
      quality: 'Full HD (1080p)',
      cloudDays: '3 ngày',
      aiEnabled: true,
      safeStorage: true
    },

    // Thiet bi kem theo
    devices: {
      default: [
        { type: 'Modem', name: 'Modem WiFi 6 AX3000GZ', quantity: 1, contract: 'Mượn' },
        { type: 'Camera', name: 'Camera IQ3', quantity: 1, contract: 'Bán' }
      ],
      groups: [
        { name: 'Combo Router + 2 Mesh', fee: 500000, devices: [
          { type: 'Modem', name: 'Modem WiFi 6 AX3000GZ', quantity: 1 },
          { type: 'Access Point', name: 'Mesh WiFi 6 AX3000', quantity: 2 }
        ]}
      ]
    },

    // Cau hinh Gia & Pham vi
    priceConfigs: [
      {
        id: 'config_1',
        name: 'Cấu hình giá Vùng Lõi',
        scopes: ['Vùng lõi HCM', 'Vùng lõi HN', 'Đà Nẵng'],
        policy: 'CSG-2026-001 (Chính sách Internet T5)',
        products: ['Combo 3 Dịch Vụ'],
        tables: {
          'Combo 3 Dịch Vụ': [
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 350000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 300000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 350000, discountAmt: 50000, discountMonths: 6, bonusMonths: 1, priceAfterDiscount: 300000, usageMonths: 7, total: 1800000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 350000, discountAmt: 50000, discountMonths: 12, bonusMonths: 2, priceAfterDiscount: 300000, usageMonths: 14, total: 3600000 }
          ]
        }
      },
      {
        id: 'config_2',
        name: 'Cấu hình giá Vùng Ven',
        scopes: ['Các tỉnh Miền Tây', 'Các tỉnh Miền Núi Phía Bắc'],
        policy: 'CSG-2026-002 (Khuyến mãi Hè)',
        products: ['Combo 3 Dịch Vụ'],
        tables: {
          'Combo 3 Dịch Vụ': [
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 300000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 250000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 300000, discountAmt: 50000, discountMonths: 6, bonusMonths: 2, priceAfterDiscount: 250000, usageMonths: 8, total: 1500000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 300000, discountAmt: 50000, discountMonths: 12, bonusMonths: 3, priceAfterDiscount: 250000, usageMonths: 15, total: 3000000 }
          ]
        }
      }
    ]
  };

  const toggleConfig = (configId: string) => {
    setExpandedConfigs(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ban hành': return <Badge variant="success">Ban hành</Badge>;
      case 'Chờ duyệt': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'Đề xuất': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đề xuất</Badge>;
      case 'Nháp': return <Badge variant="default">Nháp</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleEdit = (tabId: string) => {
    navigate(`/products/edit/${productDetails.id}?tab=${tabId}`);
  };

  return (
    <main className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/products')}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{productDetails.name}</h1>
              {getStatusBadge(productDetails.status)}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">{productDetails.code}</span>
              <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-slate-300 mr-2"></span>Ngày tạo: {productDetails.createdDate}</span>
              <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-slate-300 mr-2"></span>Người tạo: <strong className="text-slate-700 ml-1">{productDetails.createdBy}</strong></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-14 md:ml-0">
          <Button variant="outline" icon={Copy}>Sao chép</Button>
          <Button variant="primary" icon={Edit} onClick={() => handleEdit('ThongTinChung')}>Chỉnh sửa</Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Thông tin cơ bản & Phân loại */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Thông tin cơ bản & Phân loại</h2>
            </div>
            <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEdit('ThongTinChung')}>Sửa</Button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Thong tin chung */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả ngắn</span>
                  <p className="text-sm font-medium text-slate-800">{productDetails.shortDescription}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả dài chi tiết</span>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {productDetails.longDescription}
                  </p>
                </div>
              </div>

              {/* Right Side: Meta Data & Danh muc */}
              <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center"><Tags className="w-3.5 h-3.5 mr-1.5"/> Danh mục</span>
                  <div className="flex flex-wrap gap-2">
                    {productDetails.categories.map(c => (
                      <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center"><FileText className="w-3.5 h-3.5 mr-1.5"/> Meta Data (SEO)</span>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Đường dẫn (Slug)</span>
                      <span className="text-sm font-medium text-blue-600">/{productDetails.slug}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Tiêu đề (Title)</span>
                      <span className="text-sm text-slate-800 font-medium">{productDetails.metaTitle}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Từ khóa (Keywords)</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {productDetails.metaKeywords.map(k => <Badge key={k} variant="default" className="bg-white border-slate-200 text-slate-600">{k}</Badge>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><FileText className="w-4 h-4" /></div>
                    <div><p className="text-xs text-slate-500 font-medium">Hình ảnh</p><p className="text-sm font-bold text-slate-800">{productDetails.images} files</p></div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><MonitorPlay className="w-4 h-4" /></div>
                    <div><p className="text-xs text-slate-500 font-medium">Video</p><p className="text-sm font-bold text-slate-800">{productDetails.videos} files</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Đặc tả dịch vụ (3 Cột ngang) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                <Box className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Đặc tả dịch vụ</h2>
            </div>
            <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEdit('Internet')}>Sửa đặc tả</Button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Internet */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden group hover:border-green-300 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-bold text-slate-800 flex items-center mb-5"><Router className="w-5 h-5 mr-2 text-green-600"/> Internet</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Download</span>
                  <span className="font-bold text-slate-800">{productDetails.internet.download} Mbps</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Upload</span>
                  <span className="font-bold text-slate-800">{productDetails.internet.upload} Mbps</span>
                </div>
                <div className="flex justify-between items-end pb-2">
                  <span className="text-sm text-slate-500">Hạ tầng</span>
                  <Badge variant="default" className="bg-white shadow-sm border-slate-200 text-slate-700">{productDetails.internet.infrastructure}</Badge>
                </div>
              </div>
            </div>

            {/* FPT Play */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden group hover:border-orange-300 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-bold text-slate-800 flex items-center mb-5"><MonitorPlay className="w-5 h-5 mr-2 text-orange-600"/> FPT Play</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Đăng nhập tối đa</span>
                  <span className="font-bold text-slate-800">{productDetails.fptPlay.maxDevices}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Chất lượng</span>
                  <div className="flex gap-1">
                    {productDetails.fptPlay.quality.map(q => <span key={q} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{q}</span>)}
                  </div>
                </div>
                <div className="flex flex-col border-b border-slate-200 pb-2 space-y-1">
                  <span className="text-sm text-slate-500">Tính năng đi kèm</span>
                  <span className="font-semibold text-slate-800 text-sm">{productDetails.fptPlay.features.join(' • ')}</span>
                </div>
                <div className="flex flex-col pt-1 space-y-1">
                  <span className="text-sm text-slate-500">Nền tảng</span>
                  <span className="font-medium text-slate-600 text-xs">{productDetails.fptPlay.platforms.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Camera */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-bold text-slate-800 flex items-center mb-5"><CameraIcon className="w-5 h-5 mr-2 text-blue-600"/> Camera</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Chất lượng xem</span>
                  <span className="font-bold text-slate-800">{productDetails.camera.quality}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Lưu trữ Cloud</span>
                  <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">{productDetails.camera.cloudDays}</Badge>
                </div>
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Công nghệ AI</span>
                  <span className="font-bold text-slate-800 flex items-center">{productDetails.camera.aiEnabled ? <><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1"/> Có hỗ trợ</> : 'Không'}</span>
                </div>
                <div className="flex justify-between items-end pb-2">
                  <span className="text-sm text-slate-500">Lưu trữ an toàn</span>
                  <span className="font-bold text-slate-800 flex items-center">{productDetails.camera.safeStorage ? <><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1"/> Đã bật</> : 'Tắt'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thiết bị kèm theo (Giao diện Bảng) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Thiết bị kèm theo</h2>
              </div>
            </div>
            <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEdit('ThietBiKemTheo')}>Sửa thiết bị</Button>
          </div>
          <div className="p-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 font-semibold w-1/4">Phân loại</th>
                    <th className="px-6 py-3 font-semibold w-1/4">Loại thiết bị</th>
                    <th className="px-6 py-3 font-semibold">Tên thiết bị / Bộ</th>
                    <th className="px-6 py-3 font-semibold text-center w-24">Số lượng</th>
                    <th className="px-6 py-3 font-semibold text-center w-32">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {/* Thiết bị mặc định */}
                  {productDetails.devices.default.map((d, i) => (
                    <tr key={`default-${i}`} className="hover:bg-slate-50/50">
                      {i === 0 && (
                        <td rowSpan={productDetails.devices.default.length} className="px-6 py-4 align-top font-bold text-slate-700 bg-slate-50/30 border-r border-slate-100">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>Mặc định</span>
                        </td>
                      )}
                      <td className="px-6 py-4"><Badge variant="default" className="bg-slate-100 text-slate-600 shadow-sm">{d.type}</Badge></td>
                      <td className="px-6 py-4 font-medium text-slate-800">{d.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">{d.quantity}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">{d.contract}</Badge>
                      </td>
                    </tr>
                  ))}

                  {/* Bộ thay thế */}
                  {productDetails.devices.groups.map((g, i) => (
                    <tr key={`group-${i}`} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 align-top font-bold text-slate-700 bg-blue-50/30 border-r border-slate-100 border-t border-slate-200">
                        <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Thay thế tùy chọn</span>
                      </td>
                      <td className="px-6 py-4 border-t border-slate-200"><Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm">Nhóm thiết bị</Badge></td>
                      <td className="px-6 py-4 border-t border-slate-200">
                        <div className="font-bold text-slate-800 mb-2">{g.name}</div>
                        <div className="space-y-1">
                          {g.devices.map((d, j) => (
                            <div key={j} className="text-xs text-slate-600 flex items-center justify-between bg-slate-50 p-1.5 rounded">
                              <span><span className="text-slate-400 mr-1">-</span> {d.name}</span>
                              <span className="font-bold text-slate-700">x{d.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-400 border-t border-slate-200">-</td>
                      <td className="px-6 py-4 text-center border-t border-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Phí thu thêm</div>
                        <div className="font-bold text-blue-700 mt-1">{g.fee.toLocaleString()} đ</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cấu hình Giá & Phạm vi (Full Width) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Cấu hình Giá & Phạm vi</h2>
                <p className="text-xs text-slate-500 mt-0.5">Các mức giá áp dụng tương ứng với khu vực</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1">
                 {productDetails.priceConfigs.length} Cấu hình
               </Badge>
               <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEdit('Gia')}>Sửa giá</Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {productDetails.priceConfigs.map((config) => {
              const isExpanded = expandedConfigs[config.id];

              return (
                <div key={config.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div 
                    className="bg-slate-50 p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-100"
                    onClick={() => toggleConfig(config.id)}
                  >
                    <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex items-center space-x-3 md:w-1/4">
                         <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">{config.id.split('_')[1]}</span>
                         <span className="font-bold text-slate-800">{config.name}</span>
                      </div>

                      <div className="w-px h-8 bg-slate-200 hidden md:block"></div>

                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0 shadow-sm mt-0.5">
                          <Map className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phạm vi áp dụng</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {config.scopes.map(s => (
                              <span key={s} className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold shrink-0 self-start md:self-center shadow-sm">
                      {isExpanded ? (
                        <><ChevronUp className="w-4 h-4 mr-1.5" /> Thu gọn</>
                      ) : (
                        <><ChevronDown className="w-4 h-4 mr-1.5" /> Xem chi tiết</>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-6 space-y-6">
                      <div className="flex items-center space-x-2 mb-4 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-amber-800 text-sm">
                        <span className="font-semibold">Chính sách áp dụng:</span>
                        <span>{config.policy}</span>
                      </div>

                      {config.products.map(productName => {
                        const rows = config.tables[productName as keyof typeof config.tables];
                        if (!rows) return null;

                        return (
                          <div key={productName} className="space-y-3">
                            <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg bg-white shadow-sm">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                                  <tr>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Hình thức</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Chu kỳ</th>
                                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Kỳ</th>
                                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Đơn giá</th>
                                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap text-red-600">Tổng giảm</th>
                                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap text-red-600">Tháng AD giảm</th>
                                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap text-emerald-600">Tháng tặng</th>
                                    <th className="px-4 py-3 font-bold text-right whitespace-nowrap border-l border-slate-200">Giá sau giảm</th>
                                    <th className="px-4 py-3 font-bold text-center whitespace-nowrap border-l border-slate-200">Tháng SD</th>
                                    <th className="px-4 py-3 font-bold text-right whitespace-nowrap border-l border-slate-200 bg-amber-50 text-amber-700 uppercase">Tổng tiền</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                                  {rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-4 py-3 text-slate-800 font-semibold">{row.method}</td>
                                      <td className="px-4 py-3">{row.cycle}</td>
                                      <td className="px-4 py-3 text-center">{row.period}</td>
                                      <td className="px-4 py-3 text-right">{row.price.toLocaleString()}</td>
                                      <td className="px-4 py-3 text-right text-red-500">
                                        {row.discountAmt > 0 ? `-${row.discountAmt.toLocaleString()}` : '0'}
                                      </td>
                                      <td className="px-4 py-3 text-center">{row.discountMonths}</td>
                                      <td className="px-4 py-3 text-center text-emerald-600">
                                        {row.bonusMonths !== '-' ? `+${row.bonusMonths}` : '-'}
                                      </td>
                                      <td className="px-4 py-3 text-right border-l border-slate-200 text-slate-800 font-bold">{row.priceAfterDiscount.toLocaleString()}</td>
                                      <td className="px-4 py-3 text-center border-l border-slate-200 font-bold text-slate-800">{row.usageMonths}</td>
                                      <td className="px-4 py-3 text-right border-l border-slate-200 bg-amber-50/50 text-amber-600 font-bold text-sm">
                                        {row.total === '-' ? '-' : row.total.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
