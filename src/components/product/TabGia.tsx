import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Trash2, Plus, Minus, ChevronDown, ChevronUp, Map, FileText, FileBadge, Tag, StickyNote, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

interface TabGiaConfigProps {
  serviceOption: string;
  basePrice: number;
  subPrices: Record<string, number>;
  billingCycle: string;
}

const parsePeriods = (input: string): number[] => {
  const periods = new Set<number>();
  let normalized = input.toLowerCase()
    .replace(/từ\s+/g, '')
    .replace(/\s+đến\s+/g, '-');
  
  const parts = normalized.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes('-')) {
      const rangeParts = trimmed.split('-');
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0].trim(), 10);
        const end = parseInt(rangeParts[1].trim(), 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            periods.add(i);
          }
        }
      }
    } else {
      const val = parseInt(trimmed, 10);
      if (!isNaN(val)) {
        periods.add(val);
      }
    }
  }
  return Array.from(periods).sort((a, b) => a - b);
};

export const TabGiaConfig: React.FC<TabGiaConfigProps> = ({ serviceOption, basePrice, subPrices, billingCycle }) => {
  const services = useMemo(() => {
    const s: string[] = [];
    if (serviceOption.includes('Internet')) s.push('Internet');
    if (serviceOption.includes('FPT Play')) s.push('FPT Play');
    if (serviceOption.includes('Camera') || serviceOption === 'Camera') s.push('Camera');
    if (s.length === 0) s.push('Dịch vụ chính');
    return s;
  }, [serviceOption]);
  const isCombo = services.length >= 2;
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const isOneTimeAllowed = serviceOption === 'FPT Play Only' || serviceOption === 'Camera';
  
  // Trả sau is mandatory for Internet or Combo Internet services
  const isPostpaidMandatory = serviceOption.includes('Internet');

  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    const defaultMethods = ['Trả sau'];
    if (isOneTimeAllowed) defaultMethods.push('Một lần');
    return defaultMethods;
  });

  useEffect(() => {
    if (isPostpaidMandatory && !paymentMethods.includes('Trả sau')) {
      setPaymentMethods(prev => [...prev, 'Trả sau']);
    }
  }, [isPostpaidMandatory]);

  useEffect(() => {
    if (!isOneTimeAllowed) {
      setPaymentMethods(prev => prev.filter(m => m !== 'Một lần'));
    }
  }, [isOneTimeAllowed]);

  // Postpaid state — price is always directly editable
  const [postpaidCustomPrice, setPostpaidCustomPrice] = useState<number>(0);
  const [postpaidSubPrices, setPostpaidSubPrices] = useState<Record<string, number>>({});


  
  useEffect(() => {
    if (isCombo) {
      const sum = services.reduce((acc, s) => acc + (postpaidSubPrices[s] || 0), 0);
      setPostpaidCustomPrice(sum);
    }
  }, [postpaidSubPrices, isCombo, services]);

  const [postpaidPromos, setPostpaidPromos] = useState([{ discountAmount: 0, subDiscounts: {} as Record<string, number>, discountMonths: 0 }]);

  // Prepaid state
  const [prepaidUseBasePrice, setPrepaidUseBasePrice] = useState(true);
  const [prepaidCustomPrice, setPrepaidCustomPrice] = useState<number>(0);
  const [prepaidSubPrices, setPrepaidSubPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (prepaidUseBasePrice) {
      setPrepaidSubPrices(postpaidSubPrices);
    }
  }, [prepaidUseBasePrice, postpaidSubPrices]);

  useEffect(() => {
    if (isCombo && !prepaidUseBasePrice) {
      const sum = services.reduce((acc, s) => acc + (prepaidSubPrices[s] || 0), 0);
      setPrepaidCustomPrice(sum);
    }
  }, [prepaidSubPrices, isCombo, prepaidUseBasePrice, services]);

  const [prepaidPeriodInput, setPrepaidPeriodInput] = useState<string>('1-12');
  const [prepaidPromos, setPrepaidPromos] = useState([{ periodTarget: 'All', discountAmount: 0, subDiscounts: {} as Record<string, number>, discountMonths: 0, bonusMonths: 0, validityPeriod: '' as number | '' }]);

  const { duplicates, duplicateRows } = useMemo(() => {
    const monthToRows: Record<number, number[]> = {};
    const periods = parsePeriods(prepaidPeriodInput);
    
    prepaidPromos.forEach((p, idx) => {
      const target = p.periodTarget.toLowerCase().trim();
      if (!target) return;
      if (target === 'all') {
        periods.forEach(m => {
          if (!monthToRows[m]) monthToRows[m] = [];
          monthToRows[m].push(idx);
        });
      } else {
        const ms = parsePeriods(p.periodTarget);
        ms.forEach(m => {
          if (!monthToRows[m]) monthToRows[m] = [];
          monthToRows[m].push(idx);
        });
      }
    });
    
    const duplicates: Record<number, number[]> = {};
    const duplicateRows = new Set<number>();
    
    Object.entries(monthToRows).forEach(([monthStr, rowIndices]) => {
      if (rowIndices.length > 1) {
        const m = Number(monthStr);
        duplicates[m] = rowIndices;
        rowIndices.forEach(r => duplicateRows.add(r));
      }
    });
    
    return { duplicates, duplicateRows };
  }, [prepaidPromos, prepaidPeriodInput]);

  const handleTogglePaymentMethod = (method: string) => {
    if (method === 'Trả sau' && isPostpaidMandatory) return; // cannot toggle off if mandatory
    setPaymentMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const getActivePostpaidPrice = () => postpaidCustomPrice;
  const getActivePrepaidPrice = () => prepaidUseBasePrice ? getActivePostpaidPrice() : prepaidCustomPrice;

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
         total: basePrice,
         validityPeriod: '-'
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
           total: '-',
           validityPeriod: '-'
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
             total: '-',
             validityPeriod: '-'
           });
         });
       }
    }

    if (paymentMethods.includes('Trả trước')) {
       const pPrice = getActivePrepaidPrice();
       const periods = parsePeriods(prepaidPeriodInput);

       for (const i of periods) {
         const promo = prepaidPromos.find(p => {
           const targetLower = p.periodTarget.toLowerCase().trim();
           if (targetLower === 'all') return true;
           return parsePeriods(p.periodTarget).includes(i);
         }) || { discountAmount: 0, subDiscounts: {}, discountMonths: 0, bonusMonths: 0, validityPeriod: '' as number | '' };
         
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
           total: total,
           validityPeriod: (promo as any).validityPeriod || ''
         });
       }
    }

    return rows;
  };

  const formatK = (val: number) => {
    if (val === 0) return '0';
    const kVal = Math.abs(val) > 1000 ? val / 1000 : val;
    return Math.round(kVal).toString();
  };

  const getPriceStatement = (row: any) => {
    const activeSubPrices = prepaidUseBasePrice ? postpaidSubPrices : prepaidSubPrices;
    const serviceStatements = services.map(s => {
      const sOriginal = (services.length === 1) 
        ? (row.method === 'Trả trước' ? getActivePrepaidPrice() : getActivePostpaidPrice()) 
        : (activeSubPrices[s] || postpaidSubPrices[s] || 0);
        
      const sDiscount = (services.length === 1) 
        ? row.discountAmt 
        : (row.subDiscounts?.[s] || 0);
        
      const sAfter = Math.max(0, sOriginal - sDiscount);
      
      if (row.method === 'Trả trước') {
        const bonus = Number(row.bonusMonths) || 0;
        const periodVal = Number(row.period) || 0;
        const discMonths = Number(row.discountMonths) || 0;
        const sTotal = (discMonths * sAfter) + ((periodVal - discMonths) * sOriginal);
        
        return `Dịch vụ ${s} trả trước ${row.period} tháng khuyến mãi ${bonus} tháng có tổng tiền phải trả là ${formatK(sTotal)}k được sử dụng ${row.usageMonths} tháng`;
      } else if (row.method === 'Trả sau') {
        const discMonths = Number(row.discountMonths) || 0;
        if (discMonths > 0) {
          return `Dịch vụ ${s} trả sau có giá cước là ${formatK(sOriginal)}k/tháng, giảm cước ${formatK(sDiscount)}k/tháng trong ${row.discountMonths} tháng, giá sau giảm là ${formatK(sAfter)}k/tháng`;
        } else {
          return `Dịch vụ ${s} trả sau có giá cước là ${formatK(sOriginal)}k/tháng`;
        }
      } else {
        return `Dịch vụ ${s} thanh toán một lần với tổng số tiền là ${formatK(sOriginal)}k`;
      }
    });

    let statement = serviceStatements.join(', ');

    if (row.method === 'Trả trước') {
      const primaryService = services[0] || 'Internet';
      const regularPostpaidPrice = (services.length === 1) ? getActivePostpaidPrice() : (postpaidSubPrices[primaryService] || 0);
      const validityVal = row.validityPeriod && row.validityPeriod !== '-' ? row.validityPeriod : row.usageMonths;
      
      statement += `, thời hạn áp dụng giảm là ${validityVal} Tháng, sau thời hạn giảm cước là ${formatK(regularPostpaidPrice)}k/tháng`;
    }

    return statement;
  };

  const getSubProductNames = () => {
    return services.map(s => {
      if (s === 'Internet') {
        if (serviceOption.toLowerCase().includes('sky')) return 'Sky';
        if (serviceOption.toLowerCase().includes('meta')) return 'Meta';
        return 'Giga';
      }
      if (s === 'FPT Play') {
        if (serviceOption.toLowerCase().includes('vip')) return 'VIP';
        if (serviceOption.toLowerCase().includes('max')) return 'MAX';
        return 'VIP';
      }
      if (s === 'Camera') return 'Camera';
      return s;
    });
  };

  const getSingleServiceSummary = (row: any, s: string) => {
    const activeSubPrices = prepaidUseBasePrice ? postpaidSubPrices : prepaidSubPrices;
    const sOriginal = (services.length === 1) 
      ? (row.method === 'Trả trước' ? getActivePrepaidPrice() : getActivePostpaidPrice()) 
      : (activeSubPrices[s] || postpaidSubPrices[s] || 0);
      
    const sDiscount = (services.length === 1) 
      ? row.discountAmt 
      : (row.subDiscounts?.[s] || 0);
      
    const sAfter = Math.max(0, sOriginal - sDiscount);
    const shortName = s === 'Internet' ? 'Basic Net' : s === 'FPT Play' ? 'Basic FPT Play' : s === 'Camera' ? 'Basic Camera' : s;

    if (row.method === 'Trả trước') {
      const periodVal = Number(row.period) || 0;
      const discMonths = Number(row.discountMonths) || 0;
      const sTotal = (discMonths * sAfter) + ((periodVal - discMonths) * sOriginal);
      
      return `${shortName} ${row.usageMonths}T ${formatK(sTotal)}k/${row.usageMonths}T`;
    } else if (row.method === 'Trả sau') {
      return `${shortName} Trả sau ${formatK(sOriginal)}k/T`;
    } else {
      return `${shortName} Một lần ${formatK(sOriginal)}k`;
    }
  };

  const getPriceSummary = (row: any) => {
    const activeSubPrices = prepaidUseBasePrice ? postpaidSubPrices : prepaidSubPrices;
    const serviceSummaries = services.map(s => {
      const sOriginal = (services.length === 1) 
        ? (row.method === 'Trả trước' ? getActivePrepaidPrice() : getActivePostpaidPrice()) 
        : (activeSubPrices[s] || postpaidSubPrices[s] || 0);
        
      const sDiscount = (services.length === 1) 
        ? row.discountAmt 
        : (row.subDiscounts?.[s] || 0);
        
      const sAfter = Math.max(0, sOriginal - sDiscount);
      
      const shortName = s === 'Internet' ? 'Basic Net' : s === 'FPT Play' ? 'Basic FPT Play' : s === 'Camera' ? 'Basic Camera' : s;

      if (row.method === 'Trả trước') {
        const periodVal = Number(row.period) || 0;
        const discMonths = Number(row.discountMonths) || 0;
        const sTotal = (discMonths * sAfter) + ((periodVal - discMonths) * sOriginal);
        
        return `${shortName} ${row.usageMonths}T ${formatK(sTotal)}k/${row.usageMonths}T`;
      } else if (row.method === 'Trả sau') {
        return `${shortName} Trả sau ${formatK(sOriginal)}k/T`;
      } else {
        return `${shortName} Một lần ${formatK(sOriginal)}k`;
      }
    });

    let summary = serviceSummaries.join(', ');

    if (row.method === 'Trả trước') {
      const primaryService = services[0] || 'Internet';
      const regularPostpaidPrice = (services.length === 1) ? getActivePostpaidPrice() : (postpaidSubPrices[primaryService] || 0);
      const hanVal = row.validityPeriod && row.validityPeriod !== '-' ? row.validityPeriod : row.usageMonths;
      
      summary += `/Han${hanVal}T cuoc ${formatK(regularPostpaidPrice)}k/1T`;
    }

    return summary;
  };

  const calculatedRows = generateTableRows();

  return (
    <div className="space-y-6 max-w-[1200px] text-sm">
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Bật Hình thức thanh toán áp dụng</label>
        <div className="flex flex-wrap gap-3 mt-3">
          {['Một lần', 'Trả sau', 'Trả trước'].map(method => {
            const isDisabledOneTime = method === 'Một lần' && !isOneTimeAllowed;
            const isDisabledPostpaid = method === 'Trả sau' && isPostpaidMandatory;
            const isDisabled = isDisabledOneTime;
            const isMandatory = isDisabledPostpaid;
            const title = isDisabledOneTime
              ? 'Chỉ áp dụng cho FPT Play Only hoặc Camera'
              : isMandatory
              ? 'Bắt buộc đối với dịch vụ Internet'
              : '';
            return (
              <label key={method} title={title} className={cn(
                'flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-all',
                isDisabled ? 'opacity-50 cursor-not-allowed' :
                isMandatory ? 'cursor-not-allowed border-amber-300 bg-amber-50' :
                'cursor-pointer hover:bg-slate-100 shadow-sm hover:border-blue-300'
              )}>
                <input type="checkbox" checked={paymentMethods.includes(method)} disabled={isDisabled || isMandatory} onChange={() => handleTogglePaymentMethod(method)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50" />
                <span className={cn('text-sm font-bold', isMandatory ? 'text-amber-700' : 'text-slate-700')}>{method}</span>
                {isMandatory && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">Bắt buộc</span>}
              </label>
            );
          })}
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
              <div className="max-w-xl mb-2 space-y-2">
                <div className="w-full space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Giá bán trả sau {isCombo ? '(Tổng)' : ''}
                  </label>
                  <FormattedNumberInput
                    value={postpaidCustomPrice || 0}
                    onChange={val => !isCombo && setPostpaidCustomPrice(val)}
                    readOnly={isCombo}
                    className={cn(
                      "flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm !text-left placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-all font-semibold",
                      isCombo ? "bg-slate-50 text-slate-700 font-bold" : "text-slate-900"
                    )}
                    placeholder="Nhập giá bán trả sau..."
                  />
                </div>
                {isCombo && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">Cấu thành đơn giá trả sau</p>
                    {services.map(s => (
                      <div key={s} className="flex items-center space-x-2">
                        <label className="text-xs font-medium text-slate-700 w-20 truncate">{s}</label>
                        <FormattedNumberInput className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-amber-500 focus:border-amber-500 !text-left font-semibold" value={postpaidSubPrices[s] || 0} onChange={(val) => setPostpaidSubPrices({...postpaidSubPrices, [s]: val})} placeholder="VNĐ" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 mt-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Khuyến mãi trả sau</label>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Số tiền giảm</th>
                        {isCombo && <th className="px-3 py-2 font-bold text-blue-600 bg-slate-50/50 w-28 text-center">Tổng giảm</th>}
                        <th className="px-3 py-2 font-semibold w-36 text-center">Số tháng giảm cước</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {postpaidPromos.map((p, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-3 py-2">
                            {isCombo ? (
                              <div className="flex flex-wrap gap-4 py-1">
                                {services.map(s => (
                                  <div key={s} className="flex items-center space-x-2">
                                    <span className="text-[11px] font-semibold text-slate-500">{s}:</span>
                                    <FormattedNumberInput 
                                      className="w-24 border rounded px-2 py-1 text-xs !text-left font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                      value={p.subDiscounts[s] || 0}
                                      onChange={val => {
                                        const n = [...postpaidPromos];
                                        if(!n[idx].subDiscounts) n[idx].subDiscounts = {};
                                        n[idx].subDiscounts[s] = val;
                                        n[idx].discountAmount = Object.values(n[idx].subDiscounts).reduce((a,b)=>a+b,0);
                                        setPostpaidPromos(n);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <FormattedNumberInput 
                                className="w-32 border rounded px-2 py-1 text-xs !text-left font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                value={p.discountAmount || 0} 
                                onChange={(val) => { 
                                  const n = [...postpaidPromos]; 
                                  n[idx].discountAmount = val; 
                                  setPostpaidPromos(n); 
                                }} 
                              />
                            )}
                          </td>
                          {isCombo && <td className="px-3 py-2 font-bold text-blue-600 bg-slate-50/50 text-center text-sm">{p.discountAmount ? p.discountAmount.toLocaleString() : '0'}</td>}
                          <td className="px-3 py-2 text-center">
                            <input 
                              type="number" 
                              className="w-24 border rounded px-2 py-1 text-xs text-center" 
                              value={p.discountMonths || ''} 
                              onChange={(e) => { 
                                const n = [...postpaidPromos]; 
                                n[idx].discountMonths = Number(e.target.value); 
                                setPostpaidPromos(n); 
                              }} 
                            />
                          </td>
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
                  <div className="w-full space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Giá bán trả trước {isCombo && !prepaidUseBasePrice ? '(Tổng)' : ''}
                    </label>
                    <FormattedNumberInput
                      value={getActivePrepaidPrice()}
                      onChange={val => !isCombo && setPrepaidCustomPrice(val)}
                      readOnly={prepaidUseBasePrice || isCombo}
                      className={cn(
                        "flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm !text-left placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fpt-orange/30 focus:border-fpt-orange disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-all font-semibold",
                        prepaidUseBasePrice || isCombo ? "bg-slate-50 text-slate-700 font-bold" : "text-slate-900"
                      )}
                    />
                  </div>
                  {isCombo && !prepaidUseBasePrice && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                       <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">Cấu thành đơn giá trả trước</p>
                       {services.map(s => (
                         <div key={s} className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-slate-700 w-20 truncate">{s}</label>
                            <FormattedNumberInput className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500 !text-left font-semibold" value={prepaidSubPrices[s] || 0} onChange={(val) => setPrepaidSubPrices({...prepaidSubPrices, [s]: val})} placeholder="VNĐ" />
                         </div>
                       ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center space-x-2 mt-7 cursor-pointer">
                  <input type="checkbox" checked={prepaidUseBasePrice} onChange={(e) => setPrepaidUseBasePrice(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">Lấy theo giá trả sau</span>
                </label>
             </div>

             <div className="pt-3 border-t border-slate-100 max-w-xl">
               <Input 
                 label="Chu kỳ trả trước áp dụng (tháng)" 
                 value={prepaidPeriodInput} 
                 onChange={e => setPrepaidPeriodInput(e.target.value)} 
                 placeholder="VD: 1-12 (từ tháng 1 đến 12), 6 (tháng 6), 6,7,8 (tháng 6,7,8)..."
               />
               <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                 Hỗ trợ cấu hình linh động: Khoảng tháng (ví dụ: <strong className="text-slate-700">1-12</strong> hoặc <strong className="text-slate-700">Từ 1 đến 12</strong>) hoặc các tháng cụ thể (ví dụ: <strong className="text-slate-700">6,7,8</strong>). Hệ thống sẽ tự động gộp các tháng trùng lặp và sắp xếp theo thứ tự tăng dần.
               </p>
             </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Khuyến mãi linh hoạt theo tháng trả trước</label>
                    <Button variant="outline" size="sm" onClick={() => setPrepaidPromos([...prepaidPromos, {periodTarget: 'All', discountAmount: 0, subDiscounts: {}, discountMonths: 0, bonusMonths: 0, validityPeriod: ''}])}>Thêm dòng</Button>
                 </div>
                 <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                   💡 <strong>Hướng dẫn nhập Tháng trả trước:</strong> Nhập tháng lẻ (VD: <strong className="text-slate-700">6</strong>), danh sách tháng (VD: <strong className="text-slate-700">6,7,8</strong>), dải tháng (VD: <strong className="text-slate-700">1-12</strong> hoặc <strong className="text-slate-700">Từ 1 đến 12</strong>) hoặc <strong className="text-slate-700">All</strong>.
                 </p>
                 {Object.keys(duplicates).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                      <span className="text-sm select-none">⚠️</span>
                      <div>
                        <strong className="text-red-800">Trùng lặp cấu hình:</strong> Tháng <strong className="text-red-900 bg-red-100 px-1 py-0.5 rounded">{Object.keys(duplicates).join(', ')}</strong> bị cấu hình trùng ở nhiều dòng. Vui lòng kiểm tra lại!
                      </div>
                    </div>
                 )}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                     <table className="w-full text-xs text-left">
                       <thead className="bg-slate-50 text-slate-600 border-b">
                         <tr>
                           <th className="px-3 py-2 font-semibold w-36">Tháng trả trước</th>
                           <th className="px-3 py-2 font-semibold">Số tiền giảm</th>
                           {isCombo && <th className="px-3 py-2 font-bold text-blue-600 bg-slate-50/50 w-28 text-center">Tổng giảm</th>}
                           <th className="px-3 py-2 font-semibold w-32 text-center">Số tháng giảm cước</th>
                           <th className="px-3 py-2 font-semibold w-36 text-center">Số tháng khuyến mãi</th>
                           <th className="px-3 py-2 font-semibold w-40 text-center">Thời hạn giá</th>
                           <th className="px-3 py-2 w-10"></th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {prepaidPromos.map((p, idx) => (
                           <tr key={idx} className="bg-white">
                              <td className="px-3 py-2">
                                 <input 
                                   type="text" 
                                   placeholder="VD: 1-12, 6, All" 
                                   className={cn(
                                     "w-28 border rounded px-2 py-1 text-xs text-center font-semibold transition-all",
                                     duplicateRows.has(idx) 
                                       ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50 text-red-950 font-bold shadow-sm" 
                                       : "border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                   )} 
                                   value={p.periodTarget} 
                                   onChange={(e) => { 
                                     const n = [...prepaidPromos]; 
                                     n[idx].periodTarget = e.target.value; 
                                     setPrepaidPromos(n); 
                                   }} 
                                 />
                              </td>
                              <td className="px-3 py-2">
                                {isCombo ? (
                                  <div className="flex flex-wrap gap-4 py-1">
                                    {services.map(s => (
                                      <div key={s} className="flex items-center space-x-2">
                                        <span className="text-[11px] font-semibold text-slate-500">{s}:</span>
                                        <FormattedNumberInput className="w-20 border rounded px-2 py-1 text-xs !text-left font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={p.subDiscounts[s] || 0} 
                                          onChange={val => {
                                            const n = [...prepaidPromos]; 
                                            if(!n[idx].subDiscounts) n[idx].subDiscounts = {};
                                            n[idx].subDiscounts[s] = val;
                                            n[idx].discountAmount = Object.values(n[idx].subDiscounts).reduce((a,b)=>a+b,0);
                                            setPrepaidPromos(n);
                                          }} 
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <FormattedNumberInput className="w-32 border rounded px-2 py-1 text-xs !text-left font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={p.discountAmount || 0} onChange={(val) => { const n = [...prepaidPromos]; n[idx].discountAmount = val; setPrepaidPromos(n); }} />
                                )}
                              </td>
                              {isCombo && <td className="px-3 py-2 font-bold text-blue-600 bg-slate-50/50 text-center text-sm">{p.discountAmount ? p.discountAmount.toLocaleString() : '0'}</td>}
                              <td className="px-3 py-2 text-center">
                                <input type="number" className="w-24 border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={p.discountMonths || ''} onChange={(e) => { const n = [...prepaidPromos]; n[idx].discountMonths = Number(e.target.value); setPrepaidPromos(n); }} />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input type="number" className="w-24 border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={p.bonusMonths || ''} onChange={(e) => { const n = [...prepaidPromos]; n[idx].bonusMonths = Number(e.target.value); setPrepaidPromos(n); }} />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input 
                                  type="number" 
                                  className="w-32 border border-slate-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium" 
                                  placeholder="Số tháng (VD: 24)"
                                  value={p.validityPeriod || ''} 
                                  onChange={(e) => { 
                                    const n = [...prepaidPromos]; 
                                    n[idx].validityPeriod = e.target.value ? Number(e.target.value) : ''; 
                                    setPrepaidPromos(n); 
                                  }} 
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button 
                                  type="button"
                                  onClick={() => setPrepaidPromos(prepaidPromos.filter((_, i) => i !== idx))}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Xóa dòng"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                </button>
                              </td>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide">Bảng tính toán kết quả</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap w-44">Sản phẩm</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap w-24">Hình thức TT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap w-20">Chu kỳ tính</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap w-16">Kỳ</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap text-red-600 w-36">Số tháng khuyến mãi</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap text-emerald-600 w-28">Số tháng SD</th>
                  <th className="px-3 py-2.5 font-semibold text-right whitespace-nowrap w-28">Đơn giá</th>
                  <th className="px-3 py-2.5 font-semibold text-right whitespace-nowrap text-red-600 w-32">Tổng tiền giảm</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap text-red-600 w-36">Số tháng giảm cước</th>
                  <th className="px-3 py-2.5 font-semibold text-right whitespace-nowrap border-l border-slate-200 w-32">Giá 1T sau giảm</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap border-l border-slate-200 w-36">Thời hạn giá</th>
                  <th className="px-3 py-2.5 font-semibold text-right whitespace-nowrap border-l border-slate-200 bg-amber-50/50 text-amber-700 uppercase w-36">TỔNG TIỀN (sau giảm)</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap border-l border-slate-200 min-w-[280px]">Câu lệnh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {calculatedRows.map((row, i) => {
                  const hasChildren = isCombo;
                  const isExpanded = !!expandedRows[i];
                  
                  return (
                    <React.Fragment key={i}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => setExpandedRows(prev => ({ ...prev, [i]: !prev[i] }))}
                                className={cn(
                                  "w-5 h-5 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 transition-all text-slate-500 hover:text-slate-800"
                                )}
                              >
                                {isExpanded ? (
                                  <Minus className="w-3 h-3 stroke-[2.5]" />
                                ) : (
                                  <Plus className="w-3 h-3 stroke-[2.5]" />
                                )}
                              </button>
                            )}
                            <div className="flex flex-col text-slate-800">
                              <span className="font-bold text-slate-850 leading-tight">
                                {services.join(', ')}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {getSubProductNames().join(', ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-bold text-slate-800">{row.method}</td>
                        <td className="px-3 py-2.5">{row.cycle}</td>
                        <td className="px-3 py-2.5 text-center">{row.period}</td>
                        <td className="px-3 py-2.5 text-center text-red-500 font-bold">
                          {row.bonusMonths === '-' ? '-' : Number(row.bonusMonths) > 0 ? `+${row.bonusMonths}` : '0'}
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold text-slate-800">{row.usageMonths}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{row.price.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-red-500 font-bold">
                          {row.discountAmt > 0 ? (
                            <span className="font-semibold text-red-600">
                              -{row.discountAmt.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center text-red-500 font-bold">{row.discountMonths}</td>
                        <td className="px-3 py-2.5 text-right border-l border-slate-200 font-bold text-slate-800 bg-slate-50/20">{row.priceAfterDiscount.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-center border-l border-slate-200 font-semibold text-slate-600">
                          {row.validityPeriod && row.validityPeriod !== '-' ? `${row.validityPeriod} tháng` : '-'}
                        </td>
                        <td className="px-3 py-2.5 text-right border-l border-slate-200 bg-amber-50/50 text-amber-600 font-bold text-sm">
                          {row.total === '-' ? '-' : row.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 border-l border-slate-200">
                          <div className="font-bold text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded inline-block font-mono select-all whitespace-normal break-words max-w-sm">
                            {getPriceSummary(row)}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Sub-rows */}
                      {isExpanded && services.map((s, sIdx) => {
                        const activeSubPrices = prepaidUseBasePrice ? postpaidSubPrices : prepaidSubPrices;
                        const sOriginal = activeSubPrices[s] || postpaidSubPrices[s] || 0;
                        const sDiscount = row.subDiscounts?.[s] || 0;
                        const sAfter = Math.max(0, sOriginal - sDiscount);
                        
                        let sTotal: any = '-';
                        if (row.method === 'Trả trước') {
                          const periodVal = Number(row.period) || 0;
                          const discMonths = Number(row.discountMonths) || 0;
                          sTotal = (discMonths * sAfter) + ((periodVal - discMonths) * sOriginal);
                        } else if (row.method === 'Một lần') {
                          sTotal = sOriginal;
                        }

                        const subProdName = getSubProductNames()[sIdx] || s;

                        return (
                          <tr key={`${i}_sub_${s}`} className="bg-slate-50/40 hover:bg-slate-100/40 transition-colors text-slate-500 font-medium border-l-2 border-indigo-500/40">
                            <td className="px-3 py-2 pl-9 font-semibold text-slate-600 flex items-center gap-1.5">
                              <span className="text-slate-400">↳</span>
                              <span>{subProdName}</span>
                            </td>
                            <td className="px-3 py-2 opacity-80">{row.method}</td>
                            <td className="px-3 py-2 opacity-80">{row.cycle}</td>
                            <td className="px-3 py-2 text-center opacity-80">{row.period}</td>
                            <td className="px-3 py-2 text-center text-emerald-600/80">{row.bonusMonths === '-' ? '-' : Number(row.bonusMonths) > 0 ? `+${row.bonusMonths}` : '0'}</td>
                            <td className="px-3 py-2 text-center opacity-80">{row.usageMonths}</td>
                            <td className="px-3 py-2 text-right opacity-90">{sOriginal.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-red-500/80">
                              {sDiscount > 0 ? `-${sDiscount.toLocaleString()}` : '-'}
                            </td>
                            <td className="px-3 py-2 text-center opacity-80">{row.discountMonths}</td>
                            <td className="px-3 py-2 text-right border-l border-slate-200 opacity-90">{sAfter.toLocaleString()}</td>
                            <td className="px-3 py-2 text-center border-l border-slate-200 opacity-80">
                              {row.validityPeriod && row.validityPeriod !== '-' ? `${row.validityPeriod} tháng` : '-'}
                            </td>
                            <td className="px-3 py-2 text-right border-l border-slate-200 bg-amber-50/10 text-amber-600/90 font-semibold">
                              {sTotal === '-' ? '-' : sTotal.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 border-l border-slate-200">
                              <div className="text-[10px] text-indigo-600/90 bg-indigo-50/50 border border-indigo-100/40 px-2 py-0.5 rounded inline-block font-mono select-all">
                                {getSingleServiceSummary(row, s)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
                {calculatedRows.length === 0 && (
                  <tr><td colSpan={13} className="px-4 py-8 text-center text-slate-400 italic">Chưa có thông tin — hãy cấu hình các thông số bên trên</td></tr>
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

export const TabGia: React.FC<{ serviceOption?: string; hideBasicParams?: boolean }> = ({ serviceOption = '', hideBasicParams = false }) => {
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
      {!hideBasicParams && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b pb-2">Thông số cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input
              label="Giá hiển thị"
              placeholder="Khoảng giá..."
              value={displayPrice}
              onChange={e => setDisplayPrice(e.target.value)}
            />

            <div className="space-y-1.5">
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
      )}

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
