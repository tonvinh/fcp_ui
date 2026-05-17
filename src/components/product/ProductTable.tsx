import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../mockData/products';

interface ProductTableProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 10;

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when products list changes (filter applied)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Đang kinh doanh</Badge>;
      case 'inactive': return <Badge variant="danger">Ngừng kinh doanh</Badge>;
      case 'draft': return <Badge variant="warning">Bản nháp</Badge>;
      default: return <Badge>Khác</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">STT</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Mã SP</th>
              <th scope="col" className="px-4 py-3 min-w-[200px]">Tên sản phẩm</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Service / Sub Service</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Tạo bởi</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Cập nhật</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap text-right text-slate-900">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                  <p className="font-medium text-slate-500">Không tìm thấy sản phẩm phù hợp</p>
                  <p className="text-sm mt-1">Thử thay đổi điều kiện tìm kiếm</p>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product, idx) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{product.code}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 line-clamp-2">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium text-blue-700 bg-blue-50 w-fit px-2 py-0.5 rounded text-xs">{product.service}</span>
                      <p className="text-xs text-slate-500 line-clamp-1" title={product.subService.join(', ')}>
                        {product.subService.join(', ')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium">{product.createdBy.email}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{format(new Date(product.createdBy.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium">{product.updatedBy.email}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{format(new Date(product.updatedBy.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => navigate(`/detail/${product.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Xem">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6">
        <p className="text-sm text-slate-700">
          {products.length === 0 ? (
            <span>Không có kết quả</span>
          ) : (
            <>
              Đang xem <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–
              <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, products.length)}</span>
              {' '}trong <span className="font-semibold">{products.length}</span> kết quả
            </>
          )}
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === n
                    ? 'bg-[#0D214F] text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
