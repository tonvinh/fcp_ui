export type PolicyStatus = 'Ban hành' | 'Chờ duyệt' | 'Đề xuất' | 'Nháp';

export interface PricingPolicy {
  id: string;
  code: string;
  name: string;
  effectiveFrom: string;
  effectiveTo: string;
  scope: string;
  appliedProducts: string[];
  proposerEmail: string;
  proposerDate: string;
  status: PolicyStatus;
}

export const mockPricingPolicies: PricingPolicy[] = [
  {
    id: '1',
    code: 'CSG-2026-001',
    name: 'Chính sách giá Internet cá nhân Tháng 5',
    effectiveFrom: '01/05/2026',
    effectiveTo: '31/05/2026',
    scope: 'Toàn quốc',
    appliedProducts: ['Giga', 'Sky', 'Meta'],
    proposerEmail: 'nguyenvana@fpt.vn',
    proposerDate: '25/04/2026',
    status: 'Ban hành'
  },
  {
    id: '2',
    code: 'CSG-2026-002',
    name: 'Khuyến mãi Combo Internet FPT Play',
    effectiveFrom: '15/05/2026',
    effectiveTo: '15/06/2026',
    scope: 'Miền Bắc',
    appliedProducts: ['Combo Sky', 'Combo Meta'],
    proposerEmail: 'tranvanb@fpt.vn',
    proposerDate: '01/05/2026',
    status: 'Chờ duyệt'
  },
  {
    id: '3',
    code: 'CSG-2026-003',
    name: 'Chính sách Camera 2026',
    effectiveFrom: '01/06/2026',
    effectiveTo: '31/12/2026',
    scope: 'Toàn quốc',
    appliedProducts: ['Camera IQ3', 'Camera SE'],
    proposerEmail: 'lethic@fpt.vn',
    proposerDate: '10/05/2026',
    status: 'Đề xuất'
  },
  {
    id: '4',
    code: 'CSG-2026-004',
    name: 'Giảm giá thiết bị MESH tháng 6',
    effectiveFrom: '01/06/2026',
    effectiveTo: '30/06/2026',
    scope: 'Hà Nội, HCM',
    appliedProducts: ['Mesh WiFi 6'],
    proposerEmail: 'hoangvand@fpt.vn',
    proposerDate: '11/05/2026',
    status: 'Nháp'
  },
  {
    id: '5',
    code: 'CSG-2026-005',
    name: 'Chính sách nâng cấp băng thông',
    effectiveFrom: '01/01/2026',
    effectiveTo: '31/12/2026',
    scope: 'Toàn quốc',
    appliedProducts: ['Giga', 'Sky'],
    proposerEmail: 'phamthi@fpt.vn',
    proposerDate: '15/12/2025',
    status: 'Ban hành'
  },
  {
    id: '6',
    code: 'CSG-2026-006',
    name: 'Gói cước doanh nghiệp ưu đãi',
    effectiveFrom: '01/04/2026',
    effectiveTo: '30/09/2026',
    scope: 'Miền Nam',
    appliedProducts: ['Internet Doanh Nghiệp'],
    proposerEmail: 'vuvane@fpt.vn',
    proposerDate: '20/03/2026',
    status: 'Ban hành'
  }
];
