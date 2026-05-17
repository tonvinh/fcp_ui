import React, { useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ArrowLeft, Save, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PricingPolicyThongTinChung } from '../components/pricing/PricingPolicyThongTinChung';
import { PricingPolicyPhamVi } from '../components/pricing/PricingPolicyPhamVi';
import { PricingPolicyGia } from '../components/pricing/PricingPolicyGia';

class TabErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tab Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="font-bold mb-2">Đã xảy ra lỗi khi tải nội dung:</h3>
          <pre className="text-xs whitespace-pre-wrap">{this.state.error?.message}</pre>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const handleSubmit = () => {
    setSubmitStatus('submitting');
    setTimeout(() => {
      setSubmitStatus('submitted');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 800);
  };

  return (
    <main className="flex-1 p-6 w-full overflow-x-hidden flex flex-col">
      {/* Toast */}
      {saveStatus === 'saved' && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">Lưu nháp thành công!</span>
        </div>
      )}
      {submitStatus === 'submitted' && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">Đã đệ trình chính sách thành công!</span>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pricing-policies')}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Tạo mới Chính sách giá</h1>
            <p className="text-sm text-slate-500 mt-0.5">Thiết lập thông tin, phạm vi và bảng giá</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Save} size="sm" onClick={handleSaveDraft} isLoading={saveStatus === 'saving'}>
            {saveStatus === 'saved' ? 'Đã lưu nháp' : 'Lưu nháp'}
          </Button>
          <Button variant="primary" icon={Send} size="sm" onClick={handleSubmit} isLoading={submitStatus === 'submitting'}>
            {submitStatus === 'submitted' ? 'Đã đệ trình' : 'Đệ trình'}
          </Button>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex flex-col space-y-5 max-w-[1400px] mx-auto w-full pb-16">
        <TabErrorBoundary>
          <section id="thong-tin-chung">
            <PricingPolicyThongTinChung />
          </section>
        </TabErrorBoundary>

        <TabErrorBoundary>
          <section id="pham-vi">
            <PricingPolicyPhamVi />
          </section>
        </TabErrorBoundary>

        <TabErrorBoundary>
          <section id="gia">
            <PricingPolicyGia />
          </section>
        </TabErrorBoundary>
      </div>
    </main>
  );
};
