export interface Product {
  id: string;
  code: string;
  name: string;
  image: string;
  service: string;
  subService: string[];
  status: 'active' | 'inactive' | 'draft';
  createdBy: {
    email: string;
    timestamp: string;
  };
  updatedBy: {
    email: string;
    timestamp: string;
  };
}

export const mockProducts: Product[] = [
  {
    id: '1',
    code: 'SP-INT-001',
    name: 'Internet FPT Gia Đình (Gói Giga)',
    image: 'https://fpt.vn/storage/upload/images/thumbs/product_image.png',
    service: 'Internet',
    subService: ['Giga', 'Sky', 'Meta'],
    status: 'active',
    createdBy: { email: 'admin@fpt.vn', timestamp: '2023-01-10T08:00:00Z' },
    updatedBy: { email: 'editor@fpt.vn', timestamp: '2023-05-15T10:30:00Z' }
  },
  {
    id: '2',
    code: 'SP-TV-002',
    name: 'Truyền hình FPT Play',
    image: 'https://fpt.vn/storage/upload/images/thumbs/product_image.png',
    service: 'FPT Play',
    subService: ['VIP', 'V.VIP'],
    status: 'active',
    createdBy: { email: 'admin@fpt.vn', timestamp: '2023-02-12T09:15:00Z' },
    updatedBy: { email: 'admin@fpt.vn', timestamp: '2023-02-12T09:15:00Z' }
  },
  {
    id: '3',
    code: 'SP-CAM-001',
    name: 'FPT Camera IQ',
    image: 'https://fpt.vn/storage/upload/images/thumbs/product_image.png',
    service: 'Camera',
    subService: ['IQ1', 'IQ3', 'IQ7'],
    status: 'active',
    createdBy: { email: 'admin@fpt.vn', timestamp: '2023-04-20T14:45:00Z' },
    updatedBy: { email: 'tech@fpt.vn', timestamp: '2023-06-01T11:20:00Z' }
  },
  {
    id: '4',
    code: 'SP-SM-001',
    name: 'FPT Smart Home - Gói Căn Hộ',
    image: 'https://fpt.vn/storage/upload/images/thumbs/product_image.png',
    service: 'Internet',
    subService: ['Sky', 'Meta'],
    status: 'draft',
    createdBy: { email: 'manager@fpt.vn', timestamp: '2023-08-05T16:00:00Z' },
    updatedBy: { email: 'manager@fpt.vn', timestamp: '2023-08-05T16:00:00Z' }
  },
  {
    id: '5',
    code: 'SP-INT-002',
    name: 'Internet FPT Doanh Nghiệp (Gói Lux)',
    image: 'https://fpt.vn/storage/upload/images/thumbs/product_image.png',
    service: 'Camera',
    subService: ['IQ7'],
    status: 'inactive',
    createdBy: { email: 'admin@fpt.vn', timestamp: '2022-11-10T10:00:00Z' },
    updatedBy: { email: 'editor@fpt.vn', timestamp: '2023-01-20T08:30:00Z' }
  }
];
