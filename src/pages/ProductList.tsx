import React from 'react';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductTable } from '../components/product/ProductTable';
import { mockProducts } from '../mockData/products';
import { exportProductsToExcel } from '../utils/exportExcel';
import { FileUp, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  
  const handleExport = () => {
    exportProductsToExcel(mockProducts);
  };

  return (
    <main className="flex-1 p-6 z-10 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Danh sách Sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các mặt hàng thuộc FPT Telecom</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            icon={FileUp} 
            onClick={handleExport}
            className="group"
          >
            <span className="group-hover:text-green-700 transition-colors">Xuất Excel</span>
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/create')}>
            Tạo sản phẩm mới
          </Button>
        </div>
      </div>

      <ProductFilter />
      <ProductTable products={mockProducts} />
    </main>
  );
};
