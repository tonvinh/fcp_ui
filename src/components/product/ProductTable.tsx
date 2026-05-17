import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../mockData/products';

interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const navigate = useNavigate();

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">STT</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Mã SP</th>
              <th scope="col" className="px-4 py-3 min-w-[200px]">Tên / Hình</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Service / Sub Service</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Tạo bởi</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Cập nhật</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap text-right text-slate-900">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{idx + 1}</td>
                <td className="px-4 py-3 font-mono text-xs">{product.code}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img className="w-10 h-10 rounded shadow-sm border border-slate-200 object-cover" src={product.image} alt={product.name} />
                    <span className="font-semibold text-slate-800 line-clamp-2">{product.name}</span>
                  </div>
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
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="per-page" className="text-sm font-medium text-slate-600">Hiển thị</label>
              <select 
                id="per-page"
                className="h-8 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                defaultValue="10"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <p className="text-sm text-slate-700">
              Đang xem <span className="font-semibold">1</span> đến <span className="font-semibold">{products.length}</span> trong <span className="font-semibold">{products.length}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                <span className="sr-only">Previous</span>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                3
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
