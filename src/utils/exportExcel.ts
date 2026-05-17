import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { Product } from '../mockData/products';

export const exportProductsToExcel = (products: Product[], filename: string = 'danh_sach_san_pham.xlsx') => {
  const exportData = products.map((p, index) => ({
    'STT': index + 1,
    'Mã sản phẩm': p.code,
    'Tên sản phẩm': p.name,
    'Service': p.service,
    'Sub Service': p.subService.join(', '),
    'Trạng thái': p.status === 'active' ? 'Đang kinh doanh' : p.status === 'inactive' ? 'Ngừng kinh doanh' : 'Bản nháp',
    'Email người tạo': p.createdBy.email,
    'Thời gian tạo': format(new Date(p.createdBy.timestamp), 'dd/MM/yyyy HH:mm'),
    'Email cập nhật': p.updatedBy.email,
    'Thời gian cập nhật': format(new Date(p.updatedBy.timestamp), 'dd/MM/yyyy HH:mm'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // STT
    { wch: 15 }, // Code
    { wch: 30 }, // Name
    { wch: 15 }, // Type
    { wch: 30 }, // Sub Service
    { wch: 20 }, // Status
    { wch: 25 }, // Email Creator
    { wch: 20 }, // Time Created
    { wch: 25 }, // Email Updater
    { wch: 20 }, // Time Updated
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');
  XLSX.writeFile(workbook, filename);
};
