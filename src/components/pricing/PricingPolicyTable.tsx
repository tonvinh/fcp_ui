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
  const totalPages = Math.max(1, Math.ceil(policies.length / itemsPerPage));

  const paginatedPolicies = policies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case 'Ban hành': return <Badge variant="success">Ban hành</Badge>;
      case 'Chờ duyệt': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'Đề xuất': return <Badge variant="info">Đề xuất</Badge>;
      case 'Nháp': return <Badge variant="default">Nháp</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 w-12">STT</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Mã chính sách</th>
              <th className="px-5 py-3.5 min-w-[220px]">Tên chính sách</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Ngày hiệu lực</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Phạm vi</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Sản phẩm / Dịch vụ</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Đề xuất bởi</th>
              <th className="px-5 py-3.5 text-center whitespace-nowrap">Tình trạng</th>
              <th className="px-5 py-3.5 text-center w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedPolicies.map((policy, idx) => (
              <tr key={policy.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-5 py-4 text-slate-400 font-medium text-xs">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    {policy.code}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800 leading-snug">
                  {policy.name}
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">
                  <span className="font-medium">{policy.effectiveFrom}</span>
                  <br />
                  <span className="text-slate-400">→ {policy.effectiveTo}</span>
                </td>
                <td className="px-5 py-4 text-slate-600 text-sm">{policy.scope}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {policy.appliedProducts.map((product) => (
                      <span
                        key={product}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-medium"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-slate-700 font-medium text-xs">{policy.proposerEmail}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{policy.proposerDate}</p>
                </td>
                <td className="px-5 py-4 text-center">{getStatusBadge(policy.status)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => navigate(`/pricing-policies/${policy.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-slate-400 hover:text-fpt-orange hover:bg-orange-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                  Không tìm thấy chính sách giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span>–
            <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, policies.length)}</span>
            {' '}/ {policies.length} chính sách
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
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
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
