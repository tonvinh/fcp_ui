import React, { useState } from 'react';
import { ArrowLeft, Edit, Copy, ChevronDown, ChevronUp, Map, DollarSign, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPricingPolicies } from '../mockData/pricingPolicies';
import { cn } from '../lib/utils';

export const PricingPolicyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [expandedConfigs, setExpandedConfigs] = useState<Record<string, boolean>>({
    'config_1': true,
    'config_2': true
  });

  const basicPolicy = mockPricingPolicies.find(p => p.id === id) || mockPricingPolicies[0];

  const policyDetails = {
    ...basicPolicy,
    description: 'Chính sách giá áp dụng cho khách hàng cá nhân đăng ký mới dịch vụ Internet trong tháng 5.',
    customerTypes: ['Cá nhân', 'Hộ gia đình', 'Sinh viên'],
    salesChannels: ['Tất cả các kênh'],
    paymentMethods: ['Một lần', 'Trả sau', 'Trả trước'],
    hasDevice: true,
    note: 'Không áp dụng chung với các chương trình khuyến mãi Tivi khác.',
    
    priceConfigs: [
      {
        id: 'config_1',
        scopes: ['Vùng lõi HCM', 'Vùng lõi HN', 'Đà Nẵng'],
        products: ['Giga', 'Sky'],
        tables: {
          'Giga': [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 300000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 300000, usageMonths: '-', total: 300000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 150000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 150000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 150000, discountAmt: 0, discountMonths: 0, bonusMonths: 1, priceAfterDiscount: 150000, usageMonths: 7, total: 900000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 150000, discountAmt: 0, discountMonths: 0, bonusMonths: 2, priceAfterDiscount: 150000, usageMonths: 14, total: 1800000 }
          ],
          'Sky': [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 450000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 450000, usageMonths: '-', total: 450000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 250000, discountAmt: 50000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 200000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 250000, discountAmt: 50000, discountMonths: 6, bonusMonths: 1, priceAfterDiscount: 200000, usageMonths: 7, total: 1200000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 250000, discountAmt: 50000, discountMonths: 12, bonusMonths: 2, priceAfterDiscount: 200000, usageMonths: 14, total: 2400000 }
          ]
        }
      },
      {
        id: 'config_2',
        scopes: ['Các tỉnh Miền Tây', 'Các tỉnh Miền Núi Phía Bắc'],
        products: ['Giga'],
        tables: {
          'Giga': [
            { method: 'Một lần', cycle: 'Tháng', period: '-', price: 200000, discountAmt: 0, discountMonths: '-', bonusMonths: '-', priceAfterDiscount: 200000, usageMonths: '-', total: 200000 },
            { method: 'Trả sau', cycle: 'Tháng', period: '-', price: 100000, discountAmt: 20000, discountMonths: 6, bonusMonths: '-', priceAfterDiscount: 80000, usageMonths: '-', total: '-' },
            { method: 'Trả trước', cycle: 'Tháng', period: 6, price: 100000, discountAmt: 20000, discountMonths: 6, bonusMonths: 2, priceAfterDiscount: 80000, usageMonths: 8, total: 480000 },
            { method: 'Trả trước', cycle: 'Tháng', period: 12, price: 100000, discountAmt: 20000, discountMonths: 12, bonusMonths: 3, priceAfterDiscount: 80000, usageMonths: 15, total: 960000 }
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

  return (
    <main className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/pricing-policies')}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{policyDetails.name}</h1>
              {getStatusBadge(policyDetails.status)}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">{policyDetails.code}</span>
              <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-slate-300 mr-2"></span>Ngày tạo: {policyDetails.proposerDate}</span>
              <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-slate-300 mr-2"></span>Hiệu lực: <strong className="text-slate-700 ml-1">{policyDetails.effectiveFrom} - {policyDetails.effectiveTo}</strong></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-14 md:ml-0">
          <Button variant="outline" icon={Copy}>Sao chép</Button>
          <Button variant="primary" icon={Edit}>Chỉnh sửa</Button>
        </div>
      </div>

      {/* Top Section: General Info (Full Width) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            <Package className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Thông tin chung</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Đề xuất bởi</span>
                <span className="text-sm font-medium text-slate-800">{policyDetails.proposerEmail}</span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mô tả chính sách</span>
                <span className="text-sm text-slate-700">{policyDetails.description}</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Đối tượng khách hàng</span>
              <div className="flex flex-wrap gap-2">
                {policyDetails.customerTypes.map(c => (
                  <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-medium flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mr-1.5" />{c}</span>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Kênh bán hàng</span>
              <div className="flex flex-wrap gap-2">
                {policyDetails.salesChannels.map(c => (
                  <span key={c} className="px-3 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 font-medium flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1.5" />{c}</span>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Phương thức thanh toán</span>
              <div className="flex flex-wrap gap-2">
                {policyDetails.paymentMethods.map(c => (
                  <span key={c} className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-md text-xs text-orange-700 font-medium flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mr-1.5" />{c}</span>
                ))}
              </div>
            </div>

            {policyDetails.note && (
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Ghi chú</span>
                <div className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                  {policyDetails.note}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price Matrix (Full Width) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Cấu trúc Giá & Phạm vi</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hiển thị chi tiết bảng tính toán cước phí cho từng cấu hình</p>
            </div>
          </div>
          <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1">
            {policyDetails.priceConfigs.length} Cấu hình giá
          </Badge>
        </div>

        <div className="p-6 space-y-6">
          {policyDetails.priceConfigs.map((config, index) => {
            const isExpanded = expandedConfigs[config.id];

            return (
              <div key={config.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Header: Scopes and Products Summary */}
                <div 
                  className="bg-slate-50 p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-100"
                  onClick={() => toggleConfig(config.id)}
                >
                  <div className="flex-1 flex flex-col md:flex-row gap-6">
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

                    <div className="w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0 shadow-sm mt-0.5">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm / Dịch vụ</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {config.products.map(p => (
                            <span key={p} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 shadow-sm font-bold">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold shrink-0 self-start md:self-center shadow-sm">
                    {isExpanded ? (
                      <><ChevronUp className="w-4 h-4 mr-1.5" /> Thu gọn</>
                    ) : (
                      <><ChevronDown className="w-4 h-4 mr-1.5" /> Xem bảng giá</>
                    )}
                  </div>
                </div>

                {/* Body: Price Details Tables (Light Theme, Split by Product) */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-6 space-y-8">
                    {config.products.map(productName => {
                      const rows = config.tables[productName as keyof typeof config.tables];
                      if (!rows) return null;

                      return (
                        <div key={productName} className="space-y-3">
                          <h3 className="font-bold text-sm text-slate-800 px-1 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-blue-600" />
                            BẢNG GIÁ SẢN PHẨM: <span className="text-blue-700 ml-1 uppercase">{productName}</span>
                            <span className="ml-2 text-xs font-normal text-slate-500">({rows.length} kịch bản thanh toán)</span>
                          </h3>
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
    </main>
  );
};
