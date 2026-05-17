import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ScopeConfig {
  id: string;
  name: string;
}

export const PricingPolicyPhamVi: React.FC = () => {
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [scopes, setScopes] = useState<ScopeConfig[]>([
    { id: 'scope_1', name: 'Phạm vi: Toàn quốc' }
  ]);
  const [activeScopeId, setActiveScopeId] = useState<string>('scope_1');

  const addScope = () => {
    const newId = `scope_${Date.now()}`;
    setScopes([...scopes, { id: newId, name: `Phạm vi ${scopes.length + 1}` }]);
    setActiveScopeId(newId);
  };

  const removeScope = (id: string) => {
    if (scopes.length === 1) {
      alert('Phải có ít nhất 1 phạm vi áp dụng.');
      return;
    }
    const newScopes = scopes.filter(s => s.id !== id);
    setScopes(newScopes);
    if (activeScopeId === id) {
      setActiveScopeId(newScopes[0].id);
    }
  };

  const updateScopeName = (id: string, newName: string) => {
    setScopes(scopes.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const activeScope = scopes.find(s => s.id === activeScopeId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cấu hình Phạm vi áp dụng</h2>
          <p className="text-sm text-slate-500">Tạo một hoặc nhiều nhóm khu vực để áp dụng giá khác nhau</p>
        </div>
        
        <Button variant="primary" icon={Plus} onClick={addScope}>
          Thêm phạm vi mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left Sidebar - List of Scopes */}
        <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh sách phạm vi ({scopes.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {scopes.map(scope => (
              <div 
                key={scope.id}
                onClick={() => setActiveScopeId(scope.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border",
                  activeScopeId === scope.id 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                )}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    activeScopeId === scope.id ? "bg-blue-600" : "bg-slate-300 group-hover:bg-slate-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium truncate",
                    activeScopeId === scope.id ? "text-blue-800" : "text-slate-700"
                  )}>
                    {scope.name}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeScope(scope.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-50"
                  title="Xóa phạm vi này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Scope Editor */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {activeScope ? (
            <>
              {/* Scope Editor Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <span className="text-sm font-medium text-slate-500">Tên phạm vi:</span>
                  <input 
                    type="text"
                    value={activeScope.name}
                    onChange={(e) => updateScopeName(activeScope.id, e.target.value)}
                    className="flex-1 h-9 px-3 text-sm font-semibold text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <div className="p-1.5 text-slate-400"><Edit2 className="w-4 h-4" /></div>
                </div>

                <div className="flex items-center space-x-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <label className="flex items-center space-x-2 cursor-pointer px-2">
                    <input 
                      type="checkbox" 
                      checked={saveAsTemplate}
                      onChange={(e) => setSaveAsTemplate(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                    />
                    <span className="text-sm font-medium text-slate-700">Lưu mẫu</span>
                  </label>
                  {saveAsTemplate && (
                    <div className="flex items-center space-x-2 border-l border-slate-300 pl-3">
                      <Button variant="primary" className="h-7 py-0 px-3 text-xs" icon={Save}>Lưu phạm vi mẫu</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Region Selector Engine */}
              <div className="p-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center space-x-4 mb-4 shrink-0">
                  <div className="w-1/3">
                      <Input label="Tải từ phạm vi mẫu" placeholder="-- Chọn mẫu có sẵn --" />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nhóm khu vực</label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Nhóm 1: Tòa nhà không cung cấp thiết bị</option>
                        <option>Nhóm 2: Dự án đặc biệt</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Regions */}
                <div className="flex overflow-x-auto pb-4 pt-4 border-t border-slate-200 gap-4 custom-scrollbar snap-x flex-1">
                  {/* Khu vực */}
                  <div className="snap-start border border-slate-200 rounded-lg bg-white overflow-hidden flex flex-col min-w-[200px] shadow-sm">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-sm font-bold text-slate-800">Khu vực</span>
                      </div>
                      <div className="px-4 py-2 border-b border-slate-100 flex text-xs font-semibold text-slate-500">
                        <span className="w-8 flex justify-center">All</span>
                        <span className="w-8 flex justify-center">Edit</span>
                        <span className="ml-2"></span>
                      </div>
                      <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                        {['Vùng 1', 'Vùng 2', 'Vùng 3', 'Vùng 4', 'Vùng 5', 'Vùng 6'].map(v => (
                          <div key={v} className="flex items-center text-sm">
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <span className="ml-2 text-slate-700 font-medium whitespace-nowrap">{v}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Tỉnh thành */}
                  <div className="snap-start border border-slate-200 rounded-lg bg-white overflow-hidden flex flex-col min-w-[220px] shadow-sm">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-sm font-bold text-slate-800">Tỉnh thành</span>
                      </div>
                      <div className="px-4 py-2 border-b border-slate-100 flex text-xs font-semibold text-slate-500">
                        <span className="w-8 flex justify-center">All</span>
                        <span className="w-8 flex justify-center">Edit</span>
                        <span className="ml-2"></span>
                      </div>
                      <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                        {['Hồ Chí Minh', 'Đồng Nai', 'Bình Dương', 'Cần Thơ', 'Vũng Tàu', 'Tây Ninh'].map(v => (
                          <div key={v} className="flex items-center text-sm">
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <span className="ml-2 text-slate-700 font-medium whitespace-nowrap">{v}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Chi nhánh */}
                  <div className="snap-start border border-slate-200 rounded-lg bg-white overflow-hidden flex flex-col min-w-[180px] shadow-sm">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-sm font-bold text-slate-800">Chi nhánh</span>
                      </div>
                      <div className="px-4 py-2 border-b border-slate-100 flex text-xs font-semibold text-slate-500">
                        <span className="w-8 flex justify-center">All</span>
                        <span className="ml-2"></span>
                      </div>
                      <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                        {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map(v => (
                          <div key={v} className="flex items-center text-sm">
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <span className="ml-2 text-slate-700 font-medium whitespace-nowrap">{v}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Phường xã */}
                  <div className="snap-start border border-slate-200 rounded-lg bg-white overflow-hidden flex flex-col min-w-[180px] shadow-sm">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-sm font-bold text-slate-800">Phường xã</span>
                      </div>
                      <div className="px-4 py-2 border-b border-slate-100 flex text-xs font-semibold text-slate-500">
                        <span className="w-8 flex justify-center">All</span>
                        <span className="ml-2"></span>
                      </div>
                      <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                        {['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6'].map(v => (
                          <div key={v} className="flex items-center text-sm">
                            <div className="w-8 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></div>
                            <span className="ml-2 text-slate-700 font-medium whitespace-nowrap">{v}</span>
                          </div>
                        ))}
                      </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p>Vui lòng chọn hoặc thêm một phạm vi để cấu hình</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
