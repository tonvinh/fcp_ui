import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingPolicyFilter } from '../components/pricing/PricingPolicyFilter';
import type { PricingPolicyFilterValues } from '../components/pricing/PricingPolicyFilter';
import { PricingPolicyTable } from '../components/pricing/PricingPolicyTable';
import { mockPricingPolicies } from '../mockData/pricingPolicies';
import type { PolicyStatus, PricingPolicy } from '../mockData/pricingPolicies';
import { Button } from '../components/ui/Button';
import { Plus, FileUp, FileText, CheckCircle2, Clock, FilePen } from 'lucide-react';
import { cn } from '../lib/utils';

export const PricingPolicyList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyStatus | 'Tất cả'>('Tất cả');
  const [filteredPolicies, setFilteredPolicies] = useState<PricingPolicy[]>(mockPricingPolicies);
  const navigate = useNavigate();

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
      <PricingPolicyTable policies={filteredPolicies} />
    </main>
  );
};
