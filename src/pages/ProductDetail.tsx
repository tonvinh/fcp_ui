import React, { useState } from 'react';
import { ArrowLeft, Edit, Copy, ChevronDown, ChevronUp, Map, DollarSign, Package, CheckCircle2, Info, Tags, Router, Box, FileText, MonitorPlay, Camera as CameraIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProducts } from '../mockData/products';
import { cn } from '../lib/utils';

export const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const foundProduct = mockProducts.find((p) => p.id === id);

  const [expandedConfigs, setExpandedConfigs] = useState<Record<string, boolean>>({
    config_1: true,
    config_2: false,
  });

  const productDetails = {
    id: id || 'PRD-001',
    code: foundProduct?.code || 'CB-INT-FPT-CAM-2026',
    name: foundProduct?.name || 'Combo Internet + FPT Play + Camera (Giga)',
    status: 'Ban hành',
    createdDate: '10/05/2026',
    createdBy: 'admin@fpt.vn',
    shortDescription: 'Gói Combo toàn diện: Internet tốc độ cao, truyền hình giải trí FPT Play và giải pháp an ninh Camera.',
    longDescription: 'Gói Combo cung cấp giải pháp toàn diện cho hộ gia đình hiện đại. Bao gồm đường truyền Internet cáp quang tốc độ cao (Giga), tài khoản truyền hình FPT Play gói MAX xem trên 3 thiết bị đồng thời, và 1 Camera trong nhà chuẩn hình ảnh 1080p, tích hợp AI nhận diện thông minh.',
    images: 3,
    videos: 1,
    metaTitle: 'Combo Internet Truyền Hình Camera FPT | Đăng ký ngay',
    metaKeywords: ['combo internet camera', 'fpt play', 'lắp mạng fpt'],
    slug: 'combo-internet-fpt-play-camera-giga',
    categories: ['Internet gia đình', 'Combo Internet FPT Play', 'Camera trong nhà'],
    internet: { download: 150, upload: 150, infrastructure: 'GPON' },
    fptPlay: { platforms: ['Website', 'Mobile', 'TV', 'FPT Play Box'], maxDevices: '3 thiết bị', quality: ['720p', '1080p'], concurrentDevices: '1 thiết bị', features: ['Bóng đá Việt', 'Phim bộ mới nhất'] },
    camera: { quality: 'Full HD (1080p)', cloudDays: '3 ngày', aiEnabled: true, safeStorage: true },
    devices: {
      default: [
        { type: 'Modem', name: 'Modem WiFi 6 AX3000GZ', quantity: 1, contract: 'Mượn' },
        { type: 'Camera', name: 'Camera IQ3', quantity: 1, contract: 'Bán' },
      ],
      groups: [{ name: 'Combo Router + 2 Mesh', fee: 500000, devices: [{ type: 'Modem', name: 'Modem WiFi 6 AX3000GZ', quantity: 1 }, { type: 'Access Point', name: 'Mesh WiFi 6 AX3000', quantity: 2 }] }],
    },
    priceConfigs: [
      {
        id: 'config_1', name: 'Cấu hình giá Vùng Lõi',
        scopes: ['Vùng lõi HCM', 'Vùng lõi HN', 'Đà Nẵng'],
        policy: 'CSG-2026-001 (Chính sách Internet T5)',
        products: ['Combo 3 Dịch Vụ'],
        tables: { 'Combo 3 Dịch Vụ': [
          { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 350000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 300000, usageMonths: '-', total: '-' },
          { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 350000, discountAmt: 50000, discountMonths: 6, bonusMonths: 1, priceAfterDiscount: 300000, usageMonths: 7, total: 1800000 },
          { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 350000, discountAmt: 50000, discountMonths: 12, bonusMonths: 2, priceAfterDiscount: 300000, usageMonths: 14, total: 3600000 },
        ]}
      },
      {
        id: 'config_2', name: 'Cấu hình giá Vùng Ven',
        scopes: ['Các tỉnh Miền Tây', 'Các tỉnh Miền Núi Phía Bắc'],
        policy: 'CSG-2026-002 (Khuyến mãi Hè)',
        products: ['Combo 3 Dịch Vụ'],
        tables: { 'Combo 3 Dịch Vụ': [
          { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 300000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 250000, usageMonths: '-', total: '-' },
          { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 300000, discountAmt: 50000, discountMonths: 6, bonusMonths: 2, priceAfterDiscount: 250000, usageMonths: 8, total: 1500000 },
          { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 300000, discountAmt: 50000, discountMonths: 12, bonusMonths: 3, priceAfterDiscount: 250000, usageMonths: 15, total: 3000000 },
        ]}
      },
    ],
  };

  const toggleConfig = (configId: string) => {
    setExpandedConfigs((prev) => ({ ...prev, [configId]: !prev[configId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ban hành': return <Badge variant="success">Ban hành</Badge>;
      case 'Chờ duyệt': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'Đề xuất': return <Badge variant="info">Đề xuất</Badge>;
      case 'Nháp': return <Badge variant="default">Nháp</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const sectionHeader = (icon: React.ReactNode, title: string, iconBg: string, action?: React.ReactNode) => (
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${iconBg}`}>
          {icon}
        </div>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      {action}
    </div>
  );

  return (
    <main className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Hero header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-fpt-orange via-[#F26D21]/70 to-transparent" />
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/')}
              className="mt-0.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl font-bold text-slate-800">{productDetails.name}</h1>
                {getStatusBadge(productDetails.status)}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {productDetails.code}
                </span>
                <span>Ngày tạo: <strong className="text-slate-700">{productDetails.createdDate}</strong></span>
                <span>Người tạo: <strong className="text-slate-700">{productDetails.createdBy}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            <Button variant="outline" icon={Copy} size="sm">Sao chép</Button>
            <Button variant="primary" icon={Edit} size="sm" onClick={() => navigate(`/edit/${productDetails.id}`)}>Chỉnh sửa</Button>
          </div>
        </div>
      </div>

      {/* Basic info & classification */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sectionHeader(<Info className="w-4 h-4 text-blue-600" />, 'Thông tin cơ bản & Phân loại', 'bg-blue-50',
          <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(`/edit/${productDetails.id}`)}>Sửa</Button>
        )}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả ngắn</span>
              <p className="text-sm font-medium text-slate-800">{productDetails.shortDescription}</p>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả chi tiết</span>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {productDetails.longDescription}
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-5 lg:border-l lg:border-slate-100 lg:pl-8">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tags className="w-3.5 h-3.5" /> Danh mục
              </span>
              <div className="flex flex-wrap gap-2">
                {productDetails.categories.map((c) => (
                  <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Meta Data (SEO)
              </span>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2.5">
                <div><span className="block text-xs text-slate-400 mb-0.5">Đường dẫn</span><span className="text-sm font-medium text-fpt-orange">/{productDetails.slug}</span></div>
                <div><span className="block text-xs text-slate-400 mb-0.5">Tiêu đề</span><span className="text-sm text-slate-800 font-medium">{productDetails.metaTitle}</span></div>
                <div>
                  <span className="block text-xs text-slate-400 mb-1">Từ khóa</span>
                  <div className="flex flex-wrap gap-1.5">
                    {productDetails.metaKeywords.map((k) => <Badge key={k} variant="default">{k}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'Hình ảnh', value: `${productDetails.images} files`, icon: FileText, bg: 'bg-blue-100 text-blue-600' }, { label: 'Video', value: `${productDetails.videos} files`, icon: MonitorPlay, bg: 'bg-amber-100 text-amber-600' }].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bg}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div><p className="text-xs text-slate-400">{item.label}</p><p className="text-sm font-bold text-slate-800">{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service specs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sectionHeader(<Box className="w-4 h-4 text-emerald-600" />, 'Đặc tả dịch vụ', 'bg-emerald-50',
          <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(`/edit/${productDetails.id}`)}>Sửa đặc tả</Button>
        )}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: 'Internet', Icon: Router, accent: 'border-t-emerald-500 text-emerald-600',
              rows: [
                { label: 'Download', value: `${productDetails.internet.download} Mbps` },
                { label: 'Upload', value: `${productDetails.internet.upload} Mbps` },
                { label: 'Hạ tầng', value: productDetails.internet.infrastructure, badge: true },
              ]
            },
            {
              title: 'FPT Play', Icon: MonitorPlay, accent: 'border-t-fpt-orange text-fpt-orange',
              rows: [
                { label: 'Đăng nhập tối đa', value: productDetails.fptPlay.maxDevices },
                { label: 'Chất lượng', value: productDetails.fptPlay.quality.join(', ') },
                { label: 'Tính năng', value: productDetails.fptPlay.features.join(' • ') },
                { label: 'Nền tảng', value: productDetails.fptPlay.platforms.join(', '), small: true },
              ]
            },
            {
              title: 'Camera', Icon: CameraIcon, accent: 'border-t-blue-500 text-blue-600',
              rows: [
                { label: 'Chất lượng', value: productDetails.camera.quality },
                { label: 'Lưu trữ Cloud', value: productDetails.camera.cloudDays, badge: true },
                { label: 'Công nghệ AI', value: productDetails.camera.aiEnabled ? 'Có hỗ trợ' : 'Không', check: productDetails.camera.aiEnabled },
                { label: 'Lưu trữ an toàn', value: productDetails.camera.safeStorage ? 'Đã bật' : 'Tắt', check: productDetails.camera.safeStorage },
              ]
            },
          ].map(({ title, Icon, accent, rows }) => (
            <div key={title} className={`bg-slate-50 rounded-xl p-5 border border-slate-200 border-t-2 ${accent.split(' ')[0]} relative overflow-hidden group hover:shadow-md transition-shadow`}>
              <h3 className={`font-bold text-slate-800 flex items-center gap-2 mb-4 ${accent.split(' ')[1]}`}>
                <Icon className="w-5 h-5" /> {title}
              </h3>
              <div className="space-y-3">
                {rows.map((row, i) => (
                  <div key={i} className={`flex justify-between items-end ${i < rows.length - 1 ? 'border-b border-slate-200 pb-3' : ''}`}>
                    <span className={`text-slate-500 ${row.small ? 'text-xs' : 'text-sm'}`}>{row.label}</span>
                    {row.check !== undefined ? (
                      <span className={`font-bold text-slate-800 flex items-center gap-1 text-sm ${row.check ? 'text-emerald-700' : 'text-red-500'}`}>
                        {row.check && <CheckCircle2 className="w-4 h-4 text-emerald-500" />} {row.value}
                      </span>
                    ) : row.badge ? (
                      <Badge variant="default" className="bg-white shadow-sm">{row.value}</Badge>
                    ) : (
                      <span className={`font-bold text-slate-800 ${row.small ? 'text-xs' : 'text-sm'}`}>{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Devices */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sectionHeader(<Package className="w-4 h-4 text-rose-600" />, 'Thiết bị kèm theo', 'bg-rose-50',
          <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(`/edit/${productDetails.id}`)}>Sửa thiết bị</Button>
        )}
        <div className="p-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Phân loại</th>
                  <th className="px-5 py-3">Loại thiết bị</th>
                  <th className="px-5 py-3">Tên thiết bị / Bộ</th>
                  <th className="px-5 py-3 text-center w-24">Số lượng</th>
                  <th className="px-5 py-3 text-center w-32">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {productDetails.devices.default.map((d, i) => (
                  <tr key={`default-${i}`} className="hover:bg-slate-50/50">
                    {i === 0 && (
                      <td rowSpan={productDetails.devices.default.length} className="px-5 py-4 align-top font-semibold text-slate-600 bg-slate-50/40 border-r border-slate-100 text-sm">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Mặc định</span>
                      </td>
                    )}
                    <td className="px-5 py-4"><Badge variant="default">{d.type}</Badge></td>
                    <td className="px-5 py-4 font-medium text-slate-800">{d.name}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{d.quantity}</td>
                    <td className="px-5 py-4 text-center"><Badge variant="success">{d.contract}</Badge></td>
                  </tr>
                ))}
                {productDetails.devices.groups.map((g, i) => (
                  <tr key={`group-${i}`} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 align-top font-semibold text-slate-600 bg-blue-50/20 border-r border-slate-100 border-t border-slate-200 text-sm">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Thay thế tùy chọn</span>
                    </td>
                    <td className="px-5 py-4 border-t border-slate-200"><Badge variant="info">Nhóm thiết bị</Badge></td>
                    <td className="px-5 py-4 border-t border-slate-200">
                      <div className="font-bold text-slate-800 mb-1.5">{g.name}</div>
                      <div className="space-y-1">
                        {g.devices.map((d, j) => (
                          <div key={j} className="text-xs text-slate-600 flex items-center justify-between bg-slate-50 px-2 py-1.5 rounded border border-slate-100">
                            <span className="text-slate-400 mr-1">–</span> {d.name}
                            <span className="font-bold text-slate-700 ml-2">×{d.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-400 border-t border-slate-200">—</td>
                    <td className="px-5 py-4 text-center border-t border-slate-200">
                      <p className="text-xs text-slate-400 font-medium">Phí thu thêm</p>
                      <p className="font-bold text-blue-700 mt-0.5">{g.fee.toLocaleString()} đ</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Price configs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sectionHeader(
          <DollarSign className="w-4 h-4 text-indigo-600" />,
          'Cấu hình Giá & Phạm vi',
          'bg-indigo-50',
          <div className="flex items-center gap-2">
            <Badge variant="info" className="px-3">{productDetails.priceConfigs.length} Cấu hình</Badge>
            <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(`/edit/${productDetails.id}`)}>Sửa giá</Button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {productDetails.priceConfigs.map((config) => {
            const isExpanded = expandedConfigs[config.id];
            return (
              <div key={config.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div
                  className="bg-slate-50 p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-100/70 transition-colors"
                  onClick={() => toggleConfig(config.id)}
                >
                  <div className="flex-1 flex flex-col md:flex-row gap-5 items-start md:items-center">
                    <div className="flex items-center gap-3 md:w-56">
                      <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shadow-sm shrink-0">
                        {config.id.split('_')[1]}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{config.name}</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-slate-200" />
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm mt-0.5 shrink-0">
                        <Map className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phạm vi áp dụng</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {config.scopes.map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium shadow-sm">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm shrink-0 self-start md:self-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/30 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-sm bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg text-amber-700">
                      <span className="font-semibold">Chính sách:</span>
                      <span>{config.policy}</span>
                    </div>
                    {config.products.map((productName) => {
                      const rows = config.tables[productName as keyof typeof config.tables];
                      if (!rows) return null;
                      return (
                        <div key={productName} className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg bg-white shadow-sm">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                              <tr>
                                {['Hình thức', 'Chu kỳ', 'Kỳ', 'Đơn giá', 'Tổng giảm', 'Số tháng giảm cước', 'Số tháng khuyến mãi', 'Giá sau giảm', 'Số tháng sử dụng', 'Tổng tiền'].map((h, i) => (
                                  <th key={h} className={cn('px-3 py-2.5 font-semibold whitespace-nowrap', i >= 7 && 'border-l border-slate-200', i === 4 || i === 5 ? 'text-red-500' : '', i === 6 ? 'text-emerald-600' : '', i === 9 ? 'text-right bg-amber-50 text-amber-700 uppercase' : i >= 7 ? 'text-right' : i === 2 ? 'text-center' : '')}>
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                              {rows.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-3 py-2.5 font-semibold text-slate-800">{row.method}</td>
                                  <td className="px-3 py-2.5">{row.cycle}</td>
                                  <td className="px-3 py-2.5 text-center">{row.period}</td>
                                  <td className="px-3 py-2.5 text-right">{row.price.toLocaleString()}</td>
                                  <td className="px-3 py-2.5 text-right text-red-500">{row.discountAmt > 0 ? `-${row.discountAmt.toLocaleString()}` : '0'}</td>
                                  <td className="px-3 py-2.5 text-center">{row.discountMonths}</td>
                                  <td className="px-3 py-2.5 text-center text-emerald-600">{row.bonusMonths === '-' ? '-' : Number(row.bonusMonths) > 0 ? `+${row.bonusMonths}` : '0'}</td>
                                  <td className="px-3 py-2.5 text-right border-l border-slate-200 font-bold text-slate-800">{row.priceAfterDiscount.toLocaleString()}</td>
                                  <td className="px-3 py-2.5 text-center border-l border-slate-200 font-bold text-slate-800">{row.usageMonths}</td>
                                  <td className="px-3 py-2.5 text-right border-l border-slate-200 bg-amber-50/50 text-amber-600 font-bold text-sm">{row.total === '-' ? '-' : typeof row.total === 'number' ? row.total.toLocaleString() : row.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
    </main>
  );
};
