import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-screen">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-slate-300" />
        </div>

        {/* Error code */}
        <p className="text-8xl font-black text-slate-200 leading-none mb-2 tracking-tight">404</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Trang không tồn tại</h1>
        <p className="text-slate-500 text-sm mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang địa chỉ khác.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </main>
  );
};
