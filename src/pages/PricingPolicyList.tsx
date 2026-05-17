import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingPolicyFilter } from '../components/pricing/PricingPolicyFilter';
import type { PricingPolicyFilterValues } from '../components/pricing/PricingPolicyFilter';
import { PricingPolicyTable } from '../components/pricing/PricingPolicyTable';
import { mockPricingPolicies } from '../mockData/pricingPolicies';
import type { PolicyStatus, PricingPolicy } from '../mockData/pricingPolicies';
import { Button } from '../components/ui/Button';
import { Plus, FileUp, FileText, CheckCircle2, Clock, FilePen, X, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const PricingPolicyList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyStatus | 'Tất cả'>('Tất cả');
  const [filteredPolicies, setFilteredPolicies] = useState<PricingPolicy[]>(mockPricingPolicies);
  const navigate = useNavigate();

  // Quick Update States
  const [selectedPolicy, setSelectedPolicy] = useState<PricingPolicy | null>(null);
  const [quickMethod, setQuickMethod] = useState<'all' | 'prepaid' | 'postpaid'>('all');
  const [quickDiscountType, setQuickDiscountType] = useState<'percent' | 'amount'>('percent');
  const [quickDiscountValue, setQuickDiscountValue] = useState<number>(0);
  const [quickDiscountMonths, setQuickDiscountMonths] = useState<number | ''>('');
  const [quickBonusMonths, setQuickBonusMonths] = useState<number | ''>('');
  const [quickSelectedProducts, setQuickSelectedProducts] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleQuickUpdateClick = (policy: PricingPolicy) => {
    setSelectedPolicy(policy);
    setQuickSelectedProducts([...policy.appliedProducts]);
    setQuickMethod('all');
    setQuickDiscountType('percent');
    setQuickDiscountValue(0);
    setQuickDiscountMonths('');
    setQuickBonusMonths('');
  };

  const handleConfirmQuickUpdate = () => {
    if (!selectedPolicy) return;
    setShowToast(`Cập nhật khuyến mại hàng loạt cho chính sách ${selectedPolicy.code} thành công!`);
    setTimeout(() => setShowToast(null), 4000);
    setSelectedPolicy(null);
  };

  const statusCounts = mockPricingPolicies.reduce((acc, policy) => {
    acc[policy.status] = (acc[policy.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tabs: { label: PolicyStatus | 'Tất cả'; count: number }[] = [
    { label: 'Tất cả', count: mockPricingPolicies.length },
    { label: 'Ban hành', count: statusCounts['Ban hành'] || 0 },
    { label: 'Chờ duyệt', count: statusCounts['Chờ duyệt'] || 0 },
    { label: 'Đề xuất', count: statusCounts['Đề xuất'] || 0 },
    { label: 'Nháp', count: statusCounts['Nháp'] || 0 },
  ];

  const [filterValues, setFilterValues] = useState<PricingPolicyFilterValues>({
    code: '', name: '', proposer: '', scope: '', product: ''
  });

  const applyFilters = (policies: PricingPolicy[], values: PricingPolicyFilterValues, tab: PolicyStatus | 'Tất cả') => {
    return policies.filter((p) => {
      const matchTab = tab === 'Tất cả' || p.status === tab;
      const matchCode = !values.code || p.code.toLowerCase().includes(values.code.toLowerCase());
      const matchName = !values.name || p.name.toLowerCase().includes(values.name.toLowerCase());
      const matchProposer = !values.proposer || p.proposerEmail.toLowerCase().includes(values.proposer.toLowerCase());
      const matchScope = !values.scope || p.scope.includes(values.scope);
      const matchProduct = !values.product || p.appliedProducts.some(pr => pr.toLowerCase().includes(values.product.toLowerCase()));
      return matchTab && matchCode && matchName && matchProposer && matchScope && matchProduct;
    });
  };

  const handleFilter = (values: PricingPolicyFilterValues) => {
    setFilterValues(values);
    setFilteredPolicies(applyFilters(mockPricingPolicies, values, activeTab));
  };

  const handleTabChange = (tab: PolicyStatus | 'Tất cả') => {
    setActiveTab(tab);
    setFilteredPolicies(applyFilters(mockPricingPolicies, filterValues, tab));
  };

  const statCards = [
    {
      label: 'Tổng chính sách',
      value: mockPricingPolicies.length,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Đã ban hành',
      value: statusCounts['Ban hành'] || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Chờ duyệt',
      value: statusCounts['Chờ duyệt'] || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Đề xuất / Nháp',
      value: (statusCounts['Đề xuất'] || 0) + (statusCounts['Nháp'] || 0),
      icon: FilePen,
      color: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
    },
  ];

  return (
    <main className="flex-1 p-6 w-full overflow-x-hidden space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">Quản lý Chính sách giá</h1>
          <p className="text-sm text-slate-500 mt-1">Tra cứu, tạo mới và phê duyệt các chính sách giá</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" icon={FileUp} className="group">
            <span className="group-hover:text-emerald-700 transition-colors">Xuất Excel</span>
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/pricing-policies/create')}>
            Tạo chính sách
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border ${card.border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <PricingPolicyFilter onFilter={handleFilter} />

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.label)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border',
              activeTab === tab.label
                ? 'bg-[#0D214F] text-white border-[#0D214F] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-xs font-bold',
                activeTab === tab.label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Result note */}
      {filteredPolicies.length !== mockPricingPolicies.length && (
        <p className="text-sm text-slate-500">
          Tìm thấy <span className="font-semibold text-slate-700">{filteredPolicies.length}</span> kết quả
        </p>
      )}

      {/* Table */}
      <PricingPolicyTable 
        policies={filteredPolicies} 
        onQuickUpdate={handleQuickUpdateClick}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 border border-emerald-500 max-w-md">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{showToast}</span>
        </div>
      )}

      {/* Quick Promotion Update Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0D214F] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5">
                    Cập nhật nhanh Khuyến mại
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    Mã chính sách: <span className="font-mono text-yellow-400">{selectedPolicy.code}</span> — {selectedPolicy.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Product Checklist */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Chọn Sản phẩm trong chính sách muốn cập nhật
                </label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-2.5">
                  {selectedPolicy.appliedProducts.map(prod => {
                    const isSelected = quickSelectedProducts.includes(prod);
                    return (
                      <button
                        key={prod}
                        type="button"
                        onClick={() => {
                          setQuickSelectedProducts(prev => 
                            prev.includes(prod) ? prev.filter(p => p !== prod) : [...prev, prod]
                          );
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm",
                          isSelected
                            ? "bg-fpt-orange text-white border-fpt-orange"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        {prod}
                      </button>
                    );
                  })}
                  {selectedPolicy.appliedProducts.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Không có sản phẩm nào áp dụng</span>
                  )}
                </div>
              </div>

              {/* Bulk Form Config */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Thiết lập Khuyến mại áp dụng
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">Hình thức áp dụng</label>
                    <select
                      value={quickMethod}
                      onChange={e => setQuickMethod(e.target.value as any)}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="all">Tất cả (Trả trước &amp; Trả sau)</option>
                      <option value="postpaid">Trả sau</option>
                      <option value="prepaid">Trả trước</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">Cách giảm cước</label>
                    <select
                      value={quickDiscountType}
                      onChange={e => setQuickDiscountType(e.target.value as any)}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="percent">% Cước giảm</option>
                      <option value="amount">Số tiền giảm (đ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">
                      Mức giảm {quickDiscountType === 'percent' ? '(%)' : '(đ)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quickDiscountValue || ''}
                      onChange={e => setQuickDiscountValue(Number(e.target.value))}
                      placeholder={quickDiscountType === 'percent' ? 'VD: 10 (%)' : 'VD: 50,000'}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-fpt-orange/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">Số tháng giảm cước</label>
                    <input
                      type="number"
                      min="0"
                      value={quickDiscountMonths}
                      onChange={e => setQuickDiscountMonths(e.target.value ? Number(e.target.value) : '')}
                      placeholder="VD: 6 (tháng)"
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-fpt-orange/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">Tháng KM tặng thêm</label>
                    <input
                      type="number"
                      min="0"
                      value={quickBonusMonths}
                      onChange={e => setQuickBonusMonths(e.target.value ? Number(e.target.value) : '')}
                      placeholder="VD: 1, 2"
                      disabled={quickMethod === 'postpaid'}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Informative Help Text */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-xs text-amber-800 leading-relaxed font-medium">
                <span className="text-base select-none">💡</span>
                <div>
                  <p className="font-bold text-amber-900 mb-0.5">Lưu ý nghiệp vụ:</p>
                  Hệ thống sẽ thực hiện cập nhật hàng loạt cho toàn bộ các kịch bản tương ứng của các sản phẩm được chọn (<strong className="text-amber-950">{quickSelectedProducts.join(', ')}</strong>) trong chính sách này. Kết quả giá sau giảm sẽ được tự động đồng bộ hóa trên mọi kênh bán hàng.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPolicy(null)}
                className="font-semibold text-slate-700"
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirmQuickUpdate}
                disabled={quickSelectedProducts.length === 0}
                className="bg-[#F26D21] hover:bg-[#D85711] text-white shadow-md font-bold px-6 cursor-pointer"
              >
                Xác nhận cập nhật
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
