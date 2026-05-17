import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingPolicyFilter } from '../components/pricing/PricingPolicyFilter';
import { PricingPolicyTable } from '../components/pricing/PricingPolicyTable';
import { mockPricingPolicies } from '../mockData/pricingPolicies';
import type { PolicyStatus } from '../mockData/pricingPolicies';
import { Button } from '../components/ui/Button';
import { Plus, FileUp } from 'lucide-react';
import { cn } from '../lib/utils';

export const PricingPolicyList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyStatus | 'Tất cả'>('Tất cả');
  const navigate = useNavigate();

  // Count by status
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

  const filteredPolicies = activeTab === 'Tất cả' 
    ? mockPricingPolicies 
    : mockPricingPolicies.filter(p => p.status === activeTab);

  return (
    <main className="flex-1 p-6 z-10 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Chính sách giá</h1>
          <p className="text-sm text-slate-500 mt-1">Tra cứu, tạo mới và phê duyệt các chính sách giá</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            icon={FileUp} 
            className="group"
          >
            <span className="group-hover:text-green-700 transition-colors">Xuất Excel</span>
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/pricing-policies/create')}>
            Tạo chính sách
          </Button>
        </div>
      </div>

      <PricingPolicyFilter />

      {/* Quick Access Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              activeTab === tab.label
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {tab.label} <span className={cn("ml-1.5 px-2 py-0.5 rounded-full text-xs", activeTab === tab.label ? "bg-white/20" : "bg-slate-100 text-slate-500")}>{tab.count}</span>
          </button>
        ))}
      </div>

      <PricingPolicyTable policies={filteredPolicies} />
    </main>
  );
};
