import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Trash2, Plus, ChevronDown, ChevronUp, Map, FileText, FileBadge } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface TabGiaConfigProps {
  serviceOption: string;
  basePrice: number;
  subPrices: Record<string, number>;
  billingCycle: string;
}

const TabGiaConfig: React.FC<TabGiaConfigProps> = ({ serviceOption, basePrice, subPrices, billingCycle }) => {
  const services = useMemo(() => {
    const s: string[] = [];
    if (serviceOption.includes('Internet')) s.push('Internet');
    if (serviceOption.includes('FPT Play')) s.push('FPT Play');
    if (serviceOption.includes('Camera') || serviceOption === 'Camera') s.push('Camera');
    if (s.length === 0) s.push('Dịch vụ chính');
    return s;
  }, [serviceOption]);
  const isCombo = services.length >= 2;

  const isOneTimeAllowed = serviceOption === 'FPT Play Only' || serviceOption === 'Camera';

  const [paymentMethods, setPaymentMethods] = useState<string[]>(isOneTimeAllowed ? ['Một lần'] : ['Trả sau']);

  useEffect(() => {
    if (!isOneTimeAllowed) {
      setPaymentMethods(prev => prev.filter(m => m !== 'Một lần'));
    }
  }, [isOneTimeAllowed]);

  // Postpaid state
  const [postpaidUseBasePrice, setPostpaidUseBasePrice] = useState(true);
  const [postpaidCustomPrice, setPostpaidCustomPrice] = useState<number>(0);
  const [postpaidSubPrices, setPostpaidSubPrices] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (isCombo && !postpaidUseBasePrice) {
      const sum = services.reduce((acc, s) => acc + (postpaidSubPrices[s] || 0), 0);
      setPostpaidCustomPrice(sum);
    }
  }, [postpaidSubPrices, isCombo, postpaidUseBasePrice, services]);

  const [postpaidPromos, setPostpaidPromos] = useState([{ discountAmount: 0, subDiscounts: {} as Record<string, number>, discountMonths: 0 }]);

  // Prepaid state
  const [prepaidUseBasePrice, setPrepaidUseBasePrice] = useState(true);
  const [prepaidCustomPrice, setPrepaidCustomPrice] = useState<number>(0);
  const [prepaidSubPrices, setPrepaidSubPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isCombo && !prepaidUseBasePrice) {
      const sum = services.reduce((acc, s) => acc + (prepaidSubPrices[s] || 0), 0);
      setPrepaidCustomPrice(sum);
    }
  }, [prepaidSubPrices, isCombo, prepaidUseBasePrice, services]);

  const [prepaidMinPeriod, setPrepaidMinPeriod] = useState<number>(6);
  const [prepaidMaxPeriod, setPrepaidMaxPeriod] = useState<number>(12);
  const [prepaidPromos, setPrepaidPromos] = useState([{ periodTarget: 'All', discountAmount: 0, subDiscounts: {} as Record<string, number>, discountMonths: 0, bonusMonths: 0 }]);

  const handleTogglePaymentMethod = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const getActivePostpaidPrice = () => postpaidUseBasePrice ? basePrice : postpaidCustomPrice;
  const getActivePrepaidPrice = () => prepaidUseBasePrice ? basePrice : prepaidCustomPrice;

  const generateTableRows = () => {
    const rows = [];
    
    if (paymentMethods.includes('Một lần')) {
       rows.push({
         method: 'Một lần',
         cycle: billingCycle,
         period: '-',
         price: basePrice,
         discountAmt: 0,
         subDiscounts: {},
         discountMonths: '-',
         bonusMonths: '-',
         priceAfterDiscount: basePrice,
         usageMonths: '-',
         total: basePrice
       });
    }

    if (paymentMethods.includes('Trả sau')) {
       const pPrice = getActivePostpaidPrice();
       if (postpaidPromos.length === 0) {
         rows.push({
           method: 'Trả sau',
           cycle: billingCycle,
           period: '-',
           price: pPrice,
           discountAmt: 0,
           subDiscounts: {},
           discountMonths: '-',
           bonusMonths: '-',
           priceAfterDiscount: pPrice,
           usageMonths: '-',
           total: '-'
         });
       } else {
         postpaidPromos.forEach(promo => {
           rows.push({
             method: 'Trả sau',
             cycle: billingCycle,
             period: '-',
             price: pPrice,
             discountAmt: promo.discountAmount || 0,
             subDiscounts: promo.subDiscounts || {},
             discountMonths: promo.discountMonths,
             bonusMonths: '-',
             priceAfterDiscount: pPrice - (promo.discountAmount || 0),
             usageMonths: '-',
             total: '-'
           });
         });
       }
    }

    if (paymentMethods.includes('Trả trước')) {
       const pPrice = getActivePrepaidPrice();
       const min = Number(prepaidMinPeriod) || 0;
       const max = Number(prepaidMaxPeriod) || 0;

       if (min > 0 && max >= min) {
         for (let i = min; i <= max; i++) {
           const promo = prepaidPromos.find(p => p.periodTarget === String(i)) || 
                         prepaidPromos.find(p => p.periodTarget === 'All') || 
                         { discountAmount: 0, subDiscounts: {}, discountMonths: 0, bonusMonths: 0 };
           
           const priceAfter = Math.max(0, pPrice - (promo.discountAmount || 0));
           let total = 0;
           const effectiveDiscountMonths = Number(promo.discountMonths) || 0;
           
           if (effectiveDiscountMonths >= i) {
             total = i * priceAfter;
           } else {
             total = (effectiveDiscountMonths * priceAfter) + ((i - effectiveDiscountMonths) * pPrice);
           }

           rows.push({
             method: 'Trả trước',
             cycle: billingCycle,
             period: i,
             price: pPrice,
             discountAmt: promo.discountAmount || 0,
             subDiscounts: promo.subDiscounts || {},
             discountMonths: promo.discountMonths,
             bonusMonths: promo.bonusMonths,
             priceAfterDiscount: priceAfter,
             usageMonths: i + (Number(promo.bonusMonths) || 0),
             total: total
           });
         }
       }
    }

    return rows;
  };

  const calculatedRows = generateTableRows();

  return (
    <div className="space-y-6 max-w-[1200px] text-sm">
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Bật Hình thức thanh toán áp dụng</label>
        <div className="flex flex-wrap gap-3 mt-3">
          {['Một lần', 'Trả sau', 'Trả trước'].map(method => {
            const isDisabled = method === 'Một lần' && !isOneTimeAllowed;
            return (
            <label key={method} title={isDisabled ? "Chỉ áp dụng cho FPT Play Only hoặc Camera" : ""} className={cn("flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-all", isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-slate-100 shadow-sm hover:border-blue-300")}>
              <input type="checkbox" checked={paymentMethods.includes(method)} disabled={isDisabled} onChange={() => handleTogglePaymentMethod(method)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50" />
              <span className="text-sm font-bold text-slate-700">{method}</span>
            </label>
          )})}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {paymentMethods.includes('Một lần') && (
          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-green-500 rounded-xl shadow-sm space-y-3">
             <h4 className="font-bold text-slate-800 text-sm">Cấu hình Một lần</h4>
             <div className="max-w-sm">
                <Input label={`Giá bán ${isCombo ? '(Tổng)' : ''}`} value={basePrice} readOnly className="bg-slate-50 text-slate-500 cursor-not-allowed font-semibold text-sm" />
             </div>
          </div>
        )}

        {paymentMethods.includes('Trả sau') && (
          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-amber-500 rounded-xl shadow-sm space-y-3">
             <h4 className="font-bold text-slate-800 text-sm">Cấu hình Trả sau</h4>
             <div className="flex gap-4 items-start max-w-xl mb-2">
                <div className="flex-1 space-y-2">
                  <Input 
                    label={`Giá bán trả sau ${isCombo && !postpaidUseBasePrice ? '(Tổng)' : ''}`}
                    type="number" 
                    value={getActivePostpaidPrice()} 
                    onChange={e => !isCombo && setPostpaidCustomPrice(Number(e.target.value))} 
                    readOnly={postpaidUseBasePrice || isCombo}
                    className={postpaidUseBasePrice || isCombo ? "bg-slate-50 text-slate-700 font-bold" : ""}
                  />
                  {isCombo && !postpaidUseBasePrice && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                       <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">Cấu thành đơn giá trả sau</p>
                       {services.map(s => (
                         <div key={s} className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-slate-700 w-20 truncate">{s}</label>
                            <input type="number" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-amber-500 focus:border-amber-500" value={postpaidSubPrices[s] || ''} onChange={(e) => setPostpaidSubPrices({...postpaidSubPrices, [s]: Number(e.target.value)})} placeholder="VNĐ" />
                         </div>
                       ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center space-x-2 mt-7 cursor-pointer">
                  <input type="checkbox" checked={postpaidUseBasePrice} onChange={(e) => setPostpaidUseBasePrice(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">Lấy theo đơn giá cơ bản</span>
                </label>
             </div>
             <div>
                <div className="flex justify-between items-center mb-2 mt-4">
                   <label className="block text-xs font-bold text-slate-700 uppercase">Khuyến mãi trả sau</label>
                   <Button variant="outline" size="sm" onClick={() => setPostpaidPromos([...postpaidPromos, {discountAmount: 0, subDiscounts: {}, discountMonths: 0}])}>Thêm dòng</Button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                   <table className="w-full text-xs text-left">
                     <thead className="bg-slate-50 text-slate-600 border-b">
                       <tr>
                         {isCombo ? services.map(s => <th key={s} className="px-3 py-2 font-medium">Giảm ({s})</th>) : <th className="px-3 py-2 font-medium">Số tiền giảm</th>}
                         {isCombo && <th className="px-3 py-2 font-bold text-blue-600">Tổng giảm</th>}
                         <th className="px-3 py-2 font-medium">Số tháng áp dụng</th>
                         <th className="px-3 py-2 w-10"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {postpaidPromos.map((p, idx) => (
                         <tr key={idx} className="bg-white">
                            {isCombo ? services.map(s => (
                              <td key={s} className="px-2 py-1.5">
                                <input type="number" className="w-24 border rounded px-2 py-1 text-xs" value={p.subDiscounts[s] || ''} 
                                  onChange={e => {
                                    const n = [...postpaidPromos]; 
                                    if(!n[idx].subDiscounts) n[idx].subDiscounts = {};
                                    n[idx].subDiscounts[s] = Number(e.target.value);
                                    n[idx].discountAmount = Object.values(n[idx].subDiscounts).reduce((a,b)=>a+b,0);
                                    setPostpaidPromos(n);
                                  }} 
                                />
                              </td>
                            )) : (
                              <td className="px-2 py-1.5"><input type="number" className="w-32 border rounded px-2 py-1 text-xs" value={p.discountAmount || ''} onChange={(e) => { const n = [...postpaidPromos]; n[idx].discountAmount = Number(e.target.value); setPostpaidPromos(n); }} /></td>
                            )}
                            {isCombo && <td className="px-3 py-1.5 font-bold text-blue-600 bg-slate-50 text-center">{p.discountAmount}</td>}
                            <td className="px-2 py-1.5"><input type="number" className="w-24 border rounded px-2 py-1 text-xs" value={p.discountMonths || ''} onChange={(e) => { const n = [...postpaidPromos]; n[idx].discountMonths = Number(e.target.value); setPostpaidPromos(n); }} /></td>
                            <td className="px-2 py-1.5 text-center text-red-500 cursor-pointer hover:bg-slate-50" onClick={() => setPostpaidPromos(postpaidPromos.filter((_, i) => i !== idx))}><Trash2 className="w-3.5 h-3.5 mx-auto" /></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {paymentMethods.includes('Trả trước') && (
          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-blue-500 rounded-xl shadow-sm space-y-3">
             <h4 className="font-bold text-slate-800 text-sm">Cấu hình Trả trước</h4>
             
             <div className="flex gap-4 items-start max-w-xl mb-2">
                <div className="flex-1 space-y-2">
                  <Input 
                    label={`Giá bán trả trước ${isCombo && !prepaidUseBasePrice ? '(Tổng)' : ''}`}
                    type="number" 
                    value={getActivePrepaidPrice()} 
                    onChange={e => !isCombo && setPrepaidCustomPrice(Number(e.target.value))} 
                    readOnly={prepaidUseBasePrice || isCombo}
                    className={prepaidUseBasePrice || isCombo ? "bg-slate-50 text-slate-700 font-bold" : ""}
                  />
                  {isCombo && !prepaidUseBasePrice && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                       <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">Cấu thành đơn giá trả trước</p>
                       {services.map(s => (
                         <div key={s} className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-slate-700 w-20 truncate">{s}</label>
                            <input type="number" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500" value={prepaidSubPrices[s] || ''} onChange={(e) => setPrepaidSubPrices({...prepaidSubPrices, [s]: Number(e.target.value)})} placeholder="VNĐ" />
                         </div>
                       ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center space-x-2 mt-7 cursor-pointer">
                  <input type="checkbox" checked={prepaidUseBasePrice} onChange={(e) => setPrepaidUseBasePrice(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">Lấy theo đơn giá cơ bản</span>
                </label>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 max-w-lg">
                <div className="flex space-x-2 items-center">
                   <div className="flex-1">
                     <Input label="Số kỳ tối thiểu" type="number" value={prepaidMinPeriod} onChange={e=>setPrepaidMinPeriod(Number(e.target.value))} />
                   </div>
                   <span className="text-slate-500 mt-6 text-xs">/ {billingCycle.toLowerCase()}</span>
                </div>
                <div className="flex space-x-2 items-center">
                   <div className="flex-1">
                     <Input label="Số kỳ tối đa" type="number" value={prepaidMaxPeriod} onChange={e=>setPrepaidMaxPeriod(Number(e.target.value))} />
                   </div>
                   <span className="text-slate-500 mt-6 text-xs">/ {billingCycle.toLowerCase()}</span>
                </div>
             </div>

             <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-xs font-bold text-slate-700 uppercase">Khuyến mãi linh hoạt từng kỳ</label>
                   <Button variant="outline" size="sm" onClick={() => setPrepaidPromos([...prepaidPromos, {periodTarget: 'All', discountAmount: 0, subDiscounts: {}, discountMonths: 0, bonusMonths: 0}])}>Thêm dòng</Button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                   <table className="w-full text-xs text-left whitespace-nowrap">
                     <thead className="bg-slate-50 text-slate-600 border-b">
                       <tr>
                         <th className="px-3 py-2 font-medium">Kỳ áp dụng</th>
                         {isCombo ? services.map(s => <th key={s} className="px-3 py-2 font-medium">Giảm ({s})</th>) : <th className="px-3 py-2 font-medium">Cước phí giảm</th>}
                         {isCombo && <th className="px-3 py-2 font-bold text-blue-600">Tổng giảm</th>}
                         <th className="px-3 py-2 font-medium">Tháng AD</th>
                         <th className="px-3 py-2 font-medium">Tháng tặng</th>
                         <th className="px-3 py-2 w-10"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {prepaidPromos.map((p, idx) => (
                         <tr key={idx} className="bg-white">
                            <td className="px-2 py-1.5">
                               <input type="text" placeholder="VD: 6, All" className="w-16 border rounded px-2 py-1 text-xs text-center" value={p.periodTarget} onChange={(e) => { const n = [...prepaidPromos]; n[idx].periodTarget = e.target.value; setPrepaidPromos(n); }} />
                            </td>
                            {isCombo ? services.map(s => (
                              <td key={s} className="px-2 py-1.5">
                                <input type="number" className="w-20 border rounded px-2 py-1 text-xs" value={p.subDiscounts[s] || ''} 
                                  onChange={e => {
                                    const n = [...prepaidPromos]; 
                                    if(!n[idx].subDiscounts) n[idx].subDiscounts = {};
                                    n[idx].subDiscounts[s] = Number(e.target.value);
                                    n[idx].discountAmount = Object.values(n[idx].subDiscounts).reduce((a,b)=>a+b,0);
                                    setPrepaidPromos(n);
                                  }} 
                                />
                              </td>
                            )) : (
                              <td className="px-2 py-1.5"><input type="number" className="w-24 border rounded px-2 py-1 text-xs" value={p.discountAmount || ''} onChange={(e) => { const n = [...prepaidPromos]; n[idx].discountAmount = Number(e.target.value); setPrepaidPromos(n); }} /></td>
                            )}
                            {isCombo && <td className="px-3 py-1.5 font-bold text-blue-600 bg-slate-50 text-center">{p.discountAmount}</td>}
                            
                            <td className="px-2 py-1.5"><input type="number" className="w-16 border rounded px-2 py-1 text-xs text-center" value={p.discountMonths || ''} onChange={(e) => { const n = [...prepaidPromos]; n[idx].discountMonths = Number(e.target.value); setPrepaidPromos(n); }} /></td>
                            <td className="px-2 py-1.5"><input type="number" className="w-16 border rounded px-2 py-1 text-xs text-center" value={p.bonusMonths || ''} onChange={(e) => { const n = [...prepaidPromos]; n[idx].bonusMonths = Number(e.target.value); setPrepaidPromos(n); }} /></td>
                            <td className="px-2 py-1.5 text-center text-red-500 cursor-pointer hover:bg-slate-50" onClick={() => setPrepaidPromos(prepaidPromos.filter((_, i) => i !== idx))}><Trash2 className="w-3.5 h-3.5 mx-auto" /></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>

      {paymentMethods.length > 0 && (
         <div className="bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700 overflow-hidden mt-6">
           <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
             <h3 className="font-bold text-sm text-slate-100">BẢNG TÍNH TOÁN KẾT QUẢ</h3>
           </div>
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-xs text-left">
               <thead className="bg-slate-900 border-b border-slate-700">
                 <tr>
                   <th className="px-3 py-2 font-medium whitespace-nowrap">Hình thức</th>
                   <th className="px-3 py-2 font-medium whitespace-nowrap">Chu kỳ</th>
                   <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Kỳ</th>
                   <th className="px-3 py-2 font-medium text-right whitespace-nowrap">Đơn giá</th>
                   {isCombo && services.map(s => <th key={s} className="px-3 py-2 font-medium text-right whitespace-nowrap text-red-300">Giảm ({s})</th>)}
                   <th className="px-3 py-2 font-medium text-right whitespace-nowrap text-red-400">Tổng giảm</th>
                   <th className="px-3 py-2 font-medium text-center whitespace-nowrap text-red-400">Tháng AD giảm</th>
                   <th className="px-3 py-2 font-medium text-center whitespace-nowrap text-emerald-400">Tháng tặng</th>
                   <th className="px-3 py-2 font-medium text-right whitespace-nowrap border-l border-slate-700">Giá sau giảm</th>
                   <th className="px-3 py-2 font-medium text-center whitespace-nowrap border-l border-slate-700">Tháng SD</th>
                   <th className="px-3 py-2 font-medium text-right whitespace-nowrap border-l border-slate-700 bg-amber-500/10 text-amber-300 uppercase">Tổng tiền</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/50 text-slate-300 font-medium">
                 {calculatedRows.map((row, i) => (
                   <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                     <td className="px-3 py-2 text-white">{row.method}</td>
                     <td className="px-3 py-2">{row.cycle}</td>
                     <td className="px-3 py-2 text-center">{row.period}</td>
                     <td className="px-3 py-2 text-right">{row.price.toLocaleString()}</td>
                     {isCombo && services.map(s => <td key={s} className="px-3 py-2 text-right text-red-300">{(row.subDiscounts[s] || 0) > 0 ? `-${(row.subDiscounts[s] || 0).toLocaleString()}` : '0'}</td>)}
                     <td className="px-3 py-2 text-right text-red-400">-{row.discountAmt.toLocaleString()}</td>
                     <td className="px-3 py-2 text-center">{row.discountMonths}</td>
                     <td className="px-3 py-2 text-center text-emerald-400">{row.bonusMonths !== '-' ? `+${row.bonusMonths}` : '-'}</td>
                     <td className="px-3 py-2 text-right border-l border-slate-700 text-white">{row.priceAfterDiscount.toLocaleString()}</td>
                     <td className="px-3 py-2 text-center border-l border-slate-700 font-bold">{row.usageMonths}</td>
                     <td className="px-3 py-2 text-right border-l border-slate-700 bg-amber-500/5 text-amber-400 font-bold text-sm">
                       {row.total === '-' ? '-' : row.total.toLocaleString()}
                     </td>
                   </tr>
                 ))}
                 {calculatedRows.length === 0 && (
                   <tr><td colSpan={isCombo ? 11 + services.length : 11} className="px-4 py-6 text-center text-slate-500 italic">Chưa có thông tin</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
      )}
    </div>
  );
};

interface ConfigState {
  id: string;
  name: string;
}

export const TabGia: React.FC<{ serviceOption?: string }> = ({ serviceOption = '' }) => {
  const [configs, setConfigs] = useState<ConfigState[]>([{ id: 'config_1', name: 'Cấu hình giá mặc định' }]);
  const [expandedConfigs, setExpandedConfigs] = useState<Record<string, boolean>>({ 'config_1': true });

  // Global Basic Parameters
  const [displayPrice, setDisplayPrice] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [subPrices, setSubPrices] = useState<Record<string, number>>({});
  const [billingCycle, setBillingCycle] = useState<string>('Tháng');

  const services = useMemo(() => {
    const s: string[] = [];
    if (serviceOption.includes('Internet')) s.push('Internet');
    if (serviceOption.includes('FPT Play')) s.push('FPT Play');
    if (serviceOption.includes('Camera') || serviceOption === 'Camera') s.push('Camera');
    if (s.length === 0) s.push('Dịch vụ chính');
    return s;
  }, [serviceOption]);
  const isCombo = services.length >= 2;

  useEffect(() => {
    if (isCombo) {
      const sum = services.reduce((acc, s) => acc + (subPrices[s] || 0), 0);
      setBasePrice(sum);
    }
  }, [subPrices, isCombo, services]);

  const addConfig = () => {
    const newId = `config_${Date.now()}`;
    setConfigs([...configs, { id: newId, name: `Cấu hình giá #${configs.length + 1}` }]);
    setExpandedConfigs({ ...expandedConfigs, [newId]: true });
  };

  const removeConfig = (id: string) => {
    if (configs.length === 1) {
      alert('Phải có ít nhất 1 cấu hình giá.');
      return;
    }
    setConfigs(configs.filter(c => c.id !== id));
  };

  const toggleConfig = (id: string) => {
    setExpandedConfigs({ ...expandedConfigs, [id]: !expandedConfigs[id] });
  };

  const updateConfigName = (id: string, name: string) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, name } : c));
  };

  return (
    <div className="space-y-6">
      {/* Thông số cơ bản (Global for Product) */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base border-b pb-2">Thông số cơ bản</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            label="Giá hiển thị" 
            placeholder="Khoảng giá..." 
            value={displayPrice}
            onChange={e => setDisplayPrice(e.target.value)}
          />
          
          <div className="space-y-2 col-span-2 lg:col-span-1">
             {isCombo ? (
                <div className="space-y-2">
                  <Input label="Đơn giá cơ bản (Tổng)" type="number" value={basePrice} readOnly className="bg-slate-50 border-slate-300 font-bold text-blue-700" />
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                     <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">Cấu thành đơn giá</p>
                     {services.map(s => (
                       <div key={s} className="flex items-center space-x-2">
                          <label className="text-xs font-medium text-slate-700 w-20 truncate" title={s}>{s}</label>
                          <input type="number" className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" value={subPrices[s] || ''} onChange={(e) => setSubPrices({...subPrices, [s]: Number(e.target.value)})} placeholder="VNĐ" />
                       </div>
                     ))}
                  </div>
                </div>
             ) : (
                <Input label="Đơn giá cơ bản" type="number" value={basePrice || ''} onChange={(e) => setBasePrice(Number(e.target.value))} placeholder="VNĐ" />
             )}
          </div>

          <div className="space-y-1.5 col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium text-slate-700">Chu kỳ thanh toán</label>
            <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 h-9 items-center max-w-[200px]">
               {['Tháng'].map((c) => (
                  <label key={c} className={cn("flex-1 text-center py-1 rounded text-xs cursor-pointer transition-colors", billingCycle === c ? "bg-white shadow-sm font-bold text-blue-700" : "text-slate-600 hover:text-slate-900")}>
                    <input type="radio" name="cycle" className="sr-only" checked={billingCycle === c} onChange={() => setBillingCycle(c)} />
                    {c}
                  </label>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Cấu hình Bảng giá</h2>
            <p className="text-sm text-slate-500">Thiết lập các mức giá khác nhau tương ứng với từng phạm vi áp dụng</p>
          </div>
          
          <Button variant="primary" icon={Plus} onClick={addConfig}>
            Thêm cấu hình giá
          </Button>
        </div>

        <div className="p-6 flex flex-col space-y-6">
          {configs.map((config, index) => {
            const isExpanded = expandedConfigs[config.id];

            return (
              <div key={config.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-visible">
                {/* Header */}
                <div 
                  className={cn(
                    "px-5 py-4 flex items-center justify-between cursor-pointer transition-colors",
                    isExpanded ? "bg-slate-50 border-b border-slate-200" : "hover:bg-slate-50"
                  )}
                  onClick={() => toggleConfig(config.id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 max-w-sm" onClick={e => e.stopPropagation()}>
                       <input 
                         type="text" 
                         value={config.name}
                         onChange={(e) => updateConfigName(config.id, e.target.value)}
                         className="w-full bg-transparent font-bold text-slate-800 text-base focus:outline-none focus:border-b-2 focus:border-blue-500 pb-0.5"
                         placeholder="Nhập tên cấu hình giá..."
                       />
                       {!isExpanded && <p className="text-xs text-slate-500 mt-1">Click để xem hoặc chỉnh sửa chi tiết</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeConfig(config.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa cấu hình"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-slate-300 mx-1"></div>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50/50">
                    <div className="mb-6 pb-6 border-b border-slate-200 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                            <Map className="w-4 h-4 inline mr-1.5 text-indigo-500" />
                            Phạm vi áp dụng <span className="text-red-500">*</span>
                          </label>
                          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Chọn phạm vi áp dụng --</option>
                            <option value="1">Phạm vi: Toàn quốc</option>
                            <option value="2">Phạm vi 2</option>
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1.5">Chọn phạm vi đã được định nghĩa ở Tab "Phạm vi áp dụng"</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                            <FileBadge className="w-4 h-4 inline mr-1.5 text-amber-500" />
                            Chính sách giá áp dụng <span className="text-red-500">*</span>
                          </label>
                          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="">-- Chọn chính sách --</option>
                            <option value="1">CSG-2026-001 (Chính sách Internet T5)</option>
                            <option value="2">CSG-2026-002 (Khuyến mãi Combo)</option>
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1.5">Sản phẩm/dịch vụ này nằm trong chính sách nào?</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                          <FileText className="w-4 h-4 inline mr-1.5 text-green-500" />
                          Mô tả nhanh
                        </label>
                        <textarea 
                          placeholder="Mô tả cấu hình, điều kiện áp dụng hoặc tóm tắt thông tin chính sách (nếu có)..." 
                          className="w-full flex min-h-[60px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>

                    <TabGiaConfig 
                      serviceOption={serviceOption} 
                      basePrice={basePrice}
                      subPrices={subPrices}
                      billingCycle={billingCycle}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
