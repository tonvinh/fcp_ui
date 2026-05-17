import React, { useState } from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import type { PricingPolicy, PolicyStatus } from '../../mockData/pricingPolicies';

interface PricingPolicyTableProps {
  policies: PricingPolicy[];
}

export const PricingPolicyTable: React.FC<PricingPolicyTableProps> = ({ policies }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(policies.length / itemsPerPage);

  const paginatedPolicies = policies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case 'Ban hành': return <Badge variant="success">Ban hành</Badge>;
      case 'Chờ duyệt': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'Đề xuất': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đề xuất</Badge>;
      case 'Nháp': return <Badge variant="default">Nháp</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-16">STT</th>
              <th className="px-6 py-4 font-semibold">Mã chính sách</th>
              <th className="px-6 py-4 font-semibold">Tên chính sách</th>
              <th className="px-6 py-4 font-semibold">Ngày hiệu lực</th>
              <th className="px-6 py-4 font-semibold">Phạm vi áp dụng</th>
              <th className="px-6 py-4 font-semibold">Sản phẩm / Dịch vụ</th>
              <th className="px-6 py-4 font-semibold">Đề xuất bởi</th>
              <th className="px-6 py-4 font-semibold text-center">Tình trạng</th>
              <th className="px-6 py-4 font-semibold text-center w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedPolicies.map((policy, idx) => (
              <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-500">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 font-medium text-blue-600">
                  {policy.code}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {policy.name}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {policy.effectiveFrom} <br/><span className="text-slate-400 text-xs">đến</span> {policy.effectiveTo}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {policy.scope}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {policy.appliedProducts.map(product => (
                      <span key={product} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-700 border border-slate-200">
                        {product}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-800 font-medium">{policy.proposerEmail}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{policy.proposerDate}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(policy.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => navigate(`/pricing-policies/${policy.id}`)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                  Không tìm thấy chính sách giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium text-slate-800">{Math.min(currentPage * itemsPerPage, policies.length)}</span> trong số <span className="font-medium text-slate-800">{policies.length}</span> chính sách
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === idx + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {idx + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
