import React, { useState } from 'react';
import { ProductFilter } from '../components/product/ProductFilter';
import type { ProductFilterValues } from '../components/product/ProductFilter';
import { ProductTable } from '../components/product/ProductTable';
import { mockProducts } from '../mockData/products';
import { exportProductsToExcel } from '../utils/exportExcel';
import { FileUp, Plus, Package, TrendingUp, PauseCircle, FileEdit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../mockData/products';

const statCards = [
  {
    label: 'Tổng sản phẩm',
    value: mockProducts.length,
    icon: Package,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-100',
  },
  {
    label: 'Đang kinh doanh',
    value: mockProducts.filter(p => p.status === 'active').length,
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'border-emerald-100',
  },
  {
    label: 'Bản nháp',
    value: mockProducts.filter(p => p.status === 'draft').length,
    icon: FileEdit,
    color: 'bg-amber-50 text-amber-600',
    borderColor: 'border-amber-100',
  },
  {
    label: 'Ngừng kinh doanh',
    value: mockProducts.filter(p => p.status === 'inactive').length,
    icon: PauseCircle,
    color: 'bg-red-50 text-red-500',
    borderColor: 'border-red-100',
  },
];

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  const handleFilter = (values: ProductFilterValues) => {
    const result = mockProducts.filter((p) => {
      const matchCode = !values.code || p.code.toLowerCase().includes(values.code.toLowerCase());
      const matchName = !values.name || p.name.toLowerCase().includes(values.name.toLowerCase());
      const matchService = !values.service || p.service === values.service;
      const matchSubService = !values.subService || p.subService.includes(values.subService);
      const matchStatus = !values.status || p.status === values.status;
      return matchCode && matchName && matchService && matchSubService && matchStatus;
    });
    setFilteredProducts(result);
  };

  return (
    <main className="flex-1 p-6 w-full overflow-x-hidden space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">Danh sách Sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các mặt hàng thuộc FPT Telecom</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            icon={FileUp}
            onClick={() => exportProductsToExcel(mockProducts)}
            className="group"
          >
            <span className="group-hover:text-emerald-700 transition-colors">Xuất Excel</span>
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/create')}>
            Tạo sản phẩm mới
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border ${card.borderColor} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
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
      <ProductFilter onFilter={handleFilter} />

      {/* Result count */}
      {filteredProducts.length !== mockProducts.length && (
        <p className="text-sm text-slate-500">
          Tìm thấy <span className="font-semibold text-slate-700">{filteredProducts.length}</span> kết quả
        </p>
      )}

      {/* Table */}
      <ProductTable products={filteredProducts} />
    </main>
  );
};
