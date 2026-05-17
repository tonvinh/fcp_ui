import React, { useState } from 'react';
import { ArrowLeft, Save, Calculator, Info, CheckSquare, Square } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const ServicePriceAllocation: React.FC = () => {
  const navigate = useNavigate();

  // State for configured prices (null or undefined means 'không set' / blank)
  const [prices, setPrices] = useState<Record<string, number | null>>({
    'FPT Play_VIP': 55000,
    'FPT Play_VVIP': 110000,
    'Camera_IQ3+': null,
    'Camera_IQ7+': null,
    'Camera_3D - Max5': null,
    'Camera_7D - Max5': null,
  });

  const handlePriceChange = (key: string, value: string) => {
    if (value.trim() === '') {
      setPrices(prev => ({ ...prev, [key]: null }));
      return;
    }
    const num = parseInt(value.replace(/\D/g, ''));
    setPrices(prev => ({ ...prev, [key]: isNaN(num) ? null : num }));
  };

  // State for simulator
  const [simTotal, setSimTotal] = useState<string>('240000');
  
  // Toggle which services are in the simulated combo
  const [simIncludesFpt, setSimIncludesFpt] = useState(true);
  const [simIncludesCamera, setSimIncludesCamera] = useState(false);

  const [simFptPkg, setSimFptPkg] = useState('VIP');
  const [simCameraPkg, setSimCameraPkg] = useState('IQ3+');

  // Simulator calculations
  const simTotalNum = parseInt(simTotal.replace(/\D/g, '')) || 0;
  
  const simFptValue = simIncludesFpt ? (prices[`FPT Play_${simFptPkg}`] || 0) : 0;
  const simCameraValue = simIncludesCamera ? (prices[`Camera_${simCameraPkg}`] || 0) : 0;
  
  const simInternetValue = simTotalNum - simFptValue - simCameraValue;

  const renderConfigTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Rule phân bổ giá mặc định</h2>
        <p className="text-sm text-slate-500 mt-1">Thiết lập đơn giá gốc cho từng dịch vụ con (Bỏ trống nếu không set)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-6 py-3 font-semibold w-1/4 border-r border-slate-200">Dịch vụ</th>
              <th className="px-6 py-3 font-semibold w-1/3 border-r border-slate-200">Loại / Gói</th>
              <th className="px-6 py-3 font-semibold">Đơn giá phân bổ mặc định (VNĐ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {/* FPT Play */}
            <tr>
              <td rowSpan={2} className="px-6 py-4 align-top font-bold bg-slate-50/50 border-r border-slate-200">
                FPT Play
              </td>
              <td className="px-6 py-4 font-medium border-r border-slate-200">VIP</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['FPT Play_VIP'] !== null ? prices['FPT Play_VIP']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('FPT Play_VIP', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium border-r border-slate-200">VVIP</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['FPT Play_VVIP'] !== null ? prices['FPT Play_VVIP']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('FPT Play_VVIP', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>

            {/* Camera */}
            <tr className="border-t-2 border-slate-200">
              <td rowSpan={4} className="px-6 py-4 align-top font-bold bg-slate-50/50 border-r border-slate-200">
                Camera
              </td>
              <td className="px-6 py-4 font-medium border-r border-slate-200">IQ3+</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['Camera_IQ3+'] !== null ? prices['Camera_IQ3+']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('Camera_IQ3+', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium border-r border-slate-200">IQ7+</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['Camera_IQ7+'] !== null ? prices['Camera_IQ7+']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('Camera_IQ7+', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium border-r border-slate-200">3D - Max5</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['Camera_3D - Max5'] !== null ? prices['Camera_3D - Max5']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('Camera_3D - Max5', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium border-r border-slate-200">7D - Max5</td>
              <td className="px-6 py-4">
                <div className="relative max-w-[200px]">
                  <input 
                    type="text"
                    value={prices['Camera_7D - Max5'] !== null ? prices['Camera_7D - Max5']?.toLocaleString() : ''}
                    onChange={(e) => handlePriceChange('Camera_7D - Max5', e.target.value)}
                    placeholder="Không set"
                    className="w-full h-9 rounded-md border border-slate-300 px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </td>
            </tr>

            {/* Internet */}
            <tr className="border-t-2 border-slate-200 bg-slate-50/50">
              <td className="px-6 py-5 font-bold text-slate-700 border-r border-slate-200">
                Internet
              </td>
              <td className="px-6 py-5 font-medium border-r border-slate-200 text-slate-600">All gói</td>
              <td className="px-6 py-5">
                <div className="text-sm font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 inline-block">
                  Hệ thống tự tính = Tổng tiền Combo - Tổng tiền các DV còn lại trong Combo
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main className="flex-1 p-6 z-10 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Phân bổ giá Dịch vụ con</h1>
            <p className="text-sm text-slate-500 mt-1">Cấu hình đơn giá phân bổ gốc để hệ thống tự động tính giá Internet</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="primary" icon={Save}>
            Lưu Cấu Hình
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1400px]">
        
        {/* Left Panel: Table Form */}
        <div className="xl:col-span-2 space-y-6">
          {renderConfigTable()}
        </div>

        {/* Right Panel: Simulator */}
        <div className="xl:col-span-1">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-xl overflow-hidden sticky top-24 border border-slate-700">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-400"/> Mô phỏng Combo
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">1. Nhập Tổng tiền Combo giả định</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
                  <input 
                    type="text"
                    className="w-full bg-slate-950/50 border border-slate-600 rounded-lg py-3 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-bold text-xl text-right transition-colors"
                    value={simTotalNum.toLocaleString()}
                    onChange={(e) => setSimTotal(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-slate-300 mb-2">2. Cấu trúc Combo (Chọn DV đi kèm)</label>
                
                {/* Toggle FPT Play */}
                <div className={cn("p-4 rounded-lg border transition-colors", simIncludesFpt ? "bg-slate-800/80 border-blue-500/30" : "bg-slate-800/30 border-slate-700")}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setSimIncludesFpt(!simIncludesFpt)}>
                    <div className="flex items-center space-x-3">
                      {simIncludesFpt ? <CheckSquare className="w-5 h-5 text-blue-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                      <span className={cn("font-semibold", simIncludesFpt ? "text-white" : "text-slate-400")}>Có FPT Play</span>
                    </div>
                  </div>
                  
                  {simIncludesFpt && (
                    <div className="mt-4 pl-8 space-y-2">
                      <select 
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                        value={simFptPkg}
                        onChange={(e) => setSimFptPkg(e.target.value)}
                      >
                        <option value="VIP">Gói VIP</option>
                        <option value="VVIP">Gói VVIP</option>
                      </select>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-slate-400">Giá phân bổ:</span>
                        <span className="text-sm font-bold text-orange-400">-{simFptValue.toLocaleString()} đ</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle Camera */}
                <div className={cn("p-4 rounded-lg border transition-colors", simIncludesCamera ? "bg-slate-800/80 border-blue-500/30" : "bg-slate-800/30 border-slate-700")}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setSimIncludesCamera(!simIncludesCamera)}>
                    <div className="flex items-center space-x-3">
                      {simIncludesCamera ? <CheckSquare className="w-5 h-5 text-blue-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                      <span className={cn("font-semibold", simIncludesCamera ? "text-white" : "text-slate-400")}>Có Camera</span>
                    </div>
                  </div>
                  
                  {simIncludesCamera && (
                    <div className="mt-4 pl-8 space-y-2">
                      <select 
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                        value={simCameraPkg}
                        onChange={(e) => setSimCameraPkg(e.target.value)}
                      >
                        <option value="IQ3+">IQ3+</option>
                        <option value="IQ7+">IQ7+</option>
                        <option value="3D - Max5">3D - Max5</option>
                        <option value="7D - Max5">7D - Max5</option>
                      </select>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-slate-400">Giá phân bổ:</span>
                        <span className="text-sm font-bold text-orange-400">-{simCameraValue.toLocaleString()} đ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-green-400" />
                    <p className="text-sm text-slate-300 font-medium">Giá Internet được tính ra:</p>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight flex items-baseline space-x-2">
                    <span>{simInternetValue.toLocaleString()}</span>
                    <span className="text-lg text-slate-400 font-semibold">VNĐ</span>
                  </div>
                  {simInternetValue < 0 && (
                    <p className="text-xs text-red-400 mt-3 font-medium">⚠️ Tổng giá trị Combo nhỏ hơn tổng giá các dịch vụ con!</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
