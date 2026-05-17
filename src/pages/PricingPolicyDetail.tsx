import React, { useState } from 'react';
import { ArrowLeft, Edit, Copy, ChevronDown, ChevronUp, Map, DollarSign, Package, CheckCircle2, LayoutGrid, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPricingPolicies } from '../mockData/pricingPolicies';
import { cn } from '../lib/utils';

export const PricingPolicyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [expandedConfigs, setExpandedConfigs] = useState<Record<string, boolean>>({
    config_1: true,
    config_2: false,
  });

  const basicPolicy = mockPricingPolicies.find((p) => p.id === id) || mockPricingPolicies[0];

  const policyDetails = {
    ...basicPolicy,
    description: 'Chính sách giá áp dụng cho khách hàng cá nhân đăng ký mới dịch vụ Internet trong tháng 5.',
    customerTypes: ['Cá nhân', 'Hộ gia đình', 'Sinh viên'],
    salesChannels: ['Tất cả các kênh'],
    paymentMethods: ['Một lần', 'Trả sau', 'Trả trước'],
    note: 'Không áp dụng chung với các chương trình khuyến mãi Tivi khác.',
    priceConfigs: [
      {
        id: 'config_1', scopes: ['Vùng lõi HCM', 'Vùng lõi HN', 'Đà Nẵng'],
        products: ['Giga', 'Sky'],
        tables: {
          Giga: [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 300000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 300000, usageMonths: '-', total: 300000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 150000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 150000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 150000, discountAmt: 0, discountMonths: 0, bonusMonths: 1, priceAfterDiscount: 150000, usageMonths: 7, total: 900000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 150000, discountAmt: 0, discountMonths: 0, bonusMonths: 2, priceAfterDiscount: 150000, usageMonths: 14, total: 1800000 },
          ],
          Sky: [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 450000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 450000, usageMonths: '-', total: 450000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 250000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 200000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 250000, discountAmt: 50000, discountMonths: 6, bonusMonths: 1, priceAfterDiscount: 200000, usageMonths: 7, total: 1200000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 250000, discountAmt: 50000, discountMonths: 12, bonusMonths: 2, priceAfterDiscount: 200000, usageMonths: 14, total: 2400000 },
          ],
        },
      },
      {
        id: 'config_2', scopes: ['Các tỉnh Miền Tây', 'Các tỉnh Miền Núi Phía Bắc'],
        products: ['Giga'],
        tables: {
          Giga: [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 200000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 200000, usageMonths: '-', total: 200000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 100000, discountAmt: 20000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 80000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 100000, discountAmt: 20000, discountMonths: 6, bonusMonths: 2, priceAfterDiscount: 80000, usageMonths: 8, total: 480000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 100000, discountAmt: 20000, discountMonths: 12, bonusMonths: 3, priceAfterDiscount: 80000, usageMonths: 15, total: 960000 },
          ],
        },
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

  const pill = (text: string, color: string) => (
    <span className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border ${color}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />{text}
    </span>
  );

  return (
    <main className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Hero header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-fpt-orange via-[#F26D21]/70 to-transparent" />
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button onClick={() => navigate('/pricing-policies')} className="mt-0.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl font-bold text-slate-800">{policyDetails.name}</h1>
                {getStatusBadge(policyDetails.status)}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{policyDetails.code}</span>
                <span>Ngày tạo: <strong className="text-slate-700">{policyDetails.proposerDate}</strong></span>
                <span>Hiệu lực: <strong className="text-slate-700">{policyDetails.effectiveFrom} → {policyDetails.effectiveTo}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            <Button variant="outline" icon={Copy} size="sm">Sao chép</Button>
            <Button variant="primary" icon={Edit} size="sm" onClick={() => navigate(`/pricing-policies/edit/${policyDetails.id}`)}>Chỉnh sửa</Button>
          </div>
        </div>
      </div>

      {/* General info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shadow-sm">
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Thông tin chung</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-5 border-b border-slate-100 mb-5">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đề xuất bởi</span>
              <span className="text-sm font-semibold text-slate-800">{policyDetails.proposerEmail}</span>
            </div>
            <div className="md:col-span-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả chính sách</span>
              <span className="text-sm text-slate-700">{policyDetails.description}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Đối tượng khách hàng</span>
              <div className="flex flex-wrap gap-1.5">{policyDetails.customerTypes.map(c => pill(c, 'bg-slate-50 border-slate-200 text-slate-700'))}</div>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kênh bán hàng</span>
              <div className="flex flex-wrap gap-1.5">{policyDetails.salesChannels.map(c => pill(c, 'bg-emerald-50 border-emerald-200 text-emerald-700'))}</div>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phương thức thanh toán</span>
              <div className="flex flex-wrap gap-1.5">{policyDetails.paymentMethods.map(c => pill(c, 'bg-orange-50 border-orange-200 text-orange-700'))}</div>
            </div>
            {policyDetails.note && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ghi chú</span>
                <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">{policyDetails.note}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price configs — same layout as ProductDetail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Cấu hình Giá &amp; Phạm vi</h2>
              <p className="text-xs text-slate-400 mt-0.5">Chi tiết bảng tính toán cước phí cho từng cấu hình</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Lựa chọn xem selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-inner">
              <button
                onClick={() => setViewMode('unified')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                  viewMode === 'unified'
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                Xem bảng gộp
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                  viewMode === 'split'
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Xem bảng riêng
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info" className="px-3">{policyDetails.priceConfigs.length} Cấu hình</Badge>
              <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(`/pricing-policies/edit/${policyDetails.id}`)}>Sửa giá</Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {policyDetails.priceConfigs.map((config, index) => {
            const isExpanded = expandedConfigs[config.id];
            return (
              <div key={config.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Config header row */}
                <div
                  className="bg-slate-50 p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-100/70 transition-colors"
                  onClick={() => toggleConfig(config.id)}
                >
                  <div className="flex-1 flex flex-col md:flex-row gap-5 items-start md:items-center">
                    {/* Numbered circle + config name */}
                    <div className="flex items-center gap-3 md:w-56">
                      <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shadow-sm shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">Cấu hình {index + 1}</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-slate-200" />
                    {/* Scope tags */}
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

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/30 p-5 space-y-4">
                    {/* Products applied row */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Sản phẩm áp dụng:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {config.products.map((p) => (
                          <span key={p} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-bold shadow-sm">{p}</span>
                        ))}
                      </div>
                    </div>

                    {/* Price tables */}
                    {viewMode === 'unified' ? (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 px-1">
                          <Package className="w-4 h-4 text-blue-600" />
                          BẢNG GIÁ GỘP CÁC SẢN PHẨM
                          <span className="font-normal text-slate-400">
                            ({config.products.reduce((acc, p) => acc + (config.tables[p as keyof typeof config.tables]?.length || 0), 0)} kịch bản)
                          </span>
                        </h3>
                        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg bg-white shadow-sm">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                              <tr>
                                {['Sản phẩm', 'Hình thức', 'Chu kỳ', 'Kỳ', 'Đơn giá', 'Tổng giảm', 'Số tháng giảm cước', 'Số tháng khuyến mãi', 'Giá sau giảm', 'Số tháng sử dụng', 'Tổng tiền'].map((h, i) => (
                                  <th key={h} className={cn('px-3 py-2.5 font-semibold whitespace-nowrap', i >= 8 && 'border-l border-slate-200', i === 5 || i === 6 ? 'text-red-500' : '', i === 7 ? 'text-emerald-600' : '', i === 10 ? 'text-right bg-amber-50 text-amber-700 font-bold uppercase' : i >= 8 ? 'text-right' : i === 3 ? 'text-center' : '')}>
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                              {config.products.flatMap((productName) => {
                                const rows = config.tables[productName as keyof typeof config.tables] || [];
                                return rows.map((row, i) => (
                                  <tr key={`${productName}-${i}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5">
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold shadow-sm uppercase border",
                                        productName === 'Giga'
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-purple-50 text-purple-700 border-purple-200"
                                      )}>
                                        {productName}
                                      </span>
                                    </td>
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
                                ));
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      config.products.map((productName) => {
                        const rows = config.tables[productName as keyof typeof config.tables];
                        if (!rows) return null;
                        return (
                          <div key={productName} className="space-y-2.5">
                            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 px-1">
                              <Package className="w-4 h-4 text-blue-600" />
                              BẢNG GIÁ: <span className="text-blue-700 uppercase">{productName}</span>
                              <span className="font-normal text-slate-400">({rows.length} kịch bản)</span>
                            </h3>
                            <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg bg-white shadow-sm">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                  <tr>
                                    {['Hình thức', 'Chu kỳ', 'Kỳ', 'Đơn giá', 'Tổng giảm', 'Số tháng giảm cước', 'Số tháng khuyến mãi', 'Giá sau giảm', 'Số tháng sử dụng', 'Tổng tiền'].map((h, i) => (
                                      <th key={h} className={cn('px-3 py-2.5 font-semibold whitespace-nowrap', i >= 7 && 'border-l border-slate-200', i === 4 || i === 5 ? 'text-red-500' : '', i === 6 ? 'text-emerald-600' : '', i === 9 ? 'text-right bg-amber-50 text-amber-700 font-bold uppercase' : i >= 7 ? 'text-right' : i === 2 ? 'text-center' : '')}>
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
                          </div>
                        );
                      })
                    )}
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
