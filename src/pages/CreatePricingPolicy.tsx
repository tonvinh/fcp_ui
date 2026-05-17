import React, { useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ArrowLeft, Save, Send, Info, Map, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PricingPolicyThongTinChung } from '../components/pricing/PricingPolicyThongTinChung';
import { PricingPolicyPhamVi } from '../components/pricing/PricingPolicyPhamVi';
import { PricingPolicyGia } from '../components/pricing/PricingPolicyGia';

type TabId = 'thong-tin-chung' | 'pham-vi' | 'gia';

class TabErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tab Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="font-bold mb-2">Đã xảy ra lỗi khi tải Tab này:</h3>
          <pre className="text-xs whitespace-pre-wrap">{this.state.error?.message}</pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CreatePricingPolicy: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('thong-tin-chung');

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'thong-tin-chung', label: 'Thông tin chung', icon: Info },
    { id: 'pham-vi', label: 'Phạm vi áp dụng', icon: Map },
    { id: 'gia', label: 'Cấu hình giá', icon: DollarSign },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'thong-tin-chung':
        return <PricingPolicyThongTinChung />;
      case 'pham-vi':
        return <PricingPolicyPhamVi />;
      case 'gia':
        return <PricingPolicyGia />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-6 z-10 w-full overflow-x-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/pricing-policies')}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tạo mới Chính sách giá</h1>
            <p className="text-sm text-slate-500 mt-1">Thiết lập cấu hình thông tin, phạm vi và bảng giá</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" icon={Save}>
            Lưu nháp
          </Button>
          <Button variant="primary" icon={Send}>
            Đệ trình
          </Button>
        </div>
      </div>

      {/* Main Content Layout - Stacked (Single Page) */}
      <div className="flex flex-col space-y-6 max-w-[1400px] mx-auto pb-20">
        {/* Block 1: Thông tin chung */}
        <section id="thong-tin-chung" className="scroll-mt-6">
           <PricingPolicyThongTinChung />
        </section>

        {/* Block 2: Phạm vi áp dụng */}
        <section id="pham-vi" className="scroll-mt-6">
           <PricingPolicyPhamVi />
        </section>

        {/* Block 3: Cấu hình giá */}
        <section id="gia" className="scroll-mt-6">
           <PricingPolicyGia />
        </section>
      </div>
    </main>
  );
};
