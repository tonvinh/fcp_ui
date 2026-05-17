import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';
import { cn } from '../../lib/utils';

interface Device {
  id: string;
  type: string;
  name: string;
  isRecalled: boolean;
  contractType: 'Bán' | 'Thuê' | 'Mượn';
  deploymentBy: 'TINPNC' | 'Sale';
  quantity: number;
  fee?: number;
}

interface GroupDevice {
  id: string;
  type: string;
  name: string;
  quantity: number;
}

interface DeviceGroup {
  id: string;
  name: string;
  devices: GroupDevice[];
}

const MOCK_DEVICE_OPTIONS: Record<string, string[]> = {
  'Modem': ['Modem 2 băng tần AC1000F', 'Modem WiFi 6 AX3000GZ', 'Modem Vigor 2927', 'Modem ZTE F670Y'],
  'Access Point': ['AP WiFi 6 AX3000C', 'AP WiFi 5 AC1200Z', 'Mesh WiFi 6 AX3000', 'Mesh WiFi 5 AC1200'],
  'FPT Play Box': ['FPT Play Box T590', 'FPT Play Box T550', 'FPT Play Box 650', 'FPT Play Box S'],
  'Camera': ['Camera IQ3', 'Camera IQ2', 'Camera SE', 'Camera Play', 'Camera IQ3S']
};

interface ReplacementSet {
  id: string;
  name: string;
  fee: number;
  devices: Device[];
}

export const TabThietBiKemTheo: React.FC = () => {
  // Device Groups State
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([
    {
      id: 'g1',
      name: 'Combo Router + 2 Mesh',
      devices: [
        { id: 'g1_d1', type: 'Modem', name: 'Modem WiFi 6 AX3000GZ', quantity: 1 },
        { id: 'g1_d2', type: 'Access Point', name: 'Mesh WiFi 6 AX3000', quantity: 2 }
      ]
    }
  ]);

  const [defaultDevices, setDefaultDevices] = useState<Device[]>([
    { id: '1', type: 'Modem', name: 'Modem 2 băng tần AC1000F', isRecalled: true, contractType: 'Mượn', deploymentBy: 'TINPNC', quantity: 1 }
  ]);

  const [replacementSets, setReplacementSets] = useState<ReplacementSet[]>([]);

  const deviceTypes = ['Nhóm thiết bị', 'Modem', 'Access Point', 'FPT Play Box', 'Camera'];
  const baseDeviceTypes = ['Modem', 'Access Point', 'FPT Play Box', 'Camera'];

  // Group Handlers
  const handleAddGroup = () => {
    setDeviceGroups([...deviceGroups, { id: `g_${Date.now()}`, name: `Nhóm ${deviceGroups.length + 1}`, devices: [] }]);
  };
  const handleUpdateGroupName = (id: string, name: string) => {
    setDeviceGroups(deviceGroups.map(g => g.id === id ? { ...g, name } : g));
  };
  const handleRemoveGroup = (id: string) => {
    setDeviceGroups(deviceGroups.filter(g => g.id !== id));
  };
  const handleAddDeviceToGroup = (groupId: string) => {
    setDeviceGroups(deviceGroups.map(g => g.id === groupId ? { ...g, devices: [...g.devices, { id: `gd_${Date.now()}`, type: 'Modem', name: '', quantity: 1 }] } : g));
  };
  const handleUpdateGroupDevice = (groupId: string, deviceId: string, field: keyof GroupDevice, value: any) => {
    setDeviceGroups(deviceGroups.map(g => g.id === groupId ? { ...g, devices: g.devices.map(d => d.id === deviceId ? { ...d, [field]: value } : d) } : g));
  };
  const handleRemoveGroupDevice = (groupId: string, deviceId: string) => {
    setDeviceGroups(deviceGroups.map(g => g.id === groupId ? { ...g, devices: g.devices.filter(d => d.id !== deviceId) } : g));
  };

  // Default Device Handlers
  const handleAddDefaultDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      type: 'Nhóm thiết bị',
      name: '',
      isRecalled: true,
      contractType: 'Mượn',
      deploymentBy: 'TINPNC',
      quantity: 1
    };
    setDefaultDevices([...defaultDevices, newDevice]);
  };

  const handleUpdateDefaultDevice = (id: string, field: keyof Device, value: any) => {
    setDefaultDevices(defaultDevices.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleRemoveDefaultDevice = (id: string) => {
    setDefaultDevices(defaultDevices.filter(d => d.id !== id));
  };

  // Replacement Set Handlers
  const handleAddReplacementSet = () => {
    const newSet: ReplacementSet = {
      id: Date.now().toString(),
      name: `Bộ thay thế ${replacementSets.length + 1}`,
      fee: 0,
      devices: [
        {
          id: Date.now().toString() + '-dev',
          type: 'Modem',
          name: '',
          isRecalled: true,
          contractType: 'Bán',
          deploymentBy: 'TINPNC',
          quantity: 1,
          fee: 0
        }
      ]
    };
    setReplacementSets([...replacementSets, newSet]);
  };

  const handleUpdateReplacementSet = (setId: string, field: keyof ReplacementSet, value: any) => {
    setReplacementSets(replacementSets.map(s => s.id === setId ? { ...s, [field]: value } : s));
  };

  const handleRemoveReplacementSet = (setId: string) => {
    setReplacementSets(replacementSets.filter(s => s.id !== setId));
  };

  const handleAddDeviceToSet = (setId: string) => {
    setReplacementSets(replacementSets.map(s => {
      if (s.id === setId) {
        return {
          ...s,
          devices: [...s.devices, {
            id: Date.now().toString(),
            type: 'Nhóm thiết bị',
            name: '',
            isRecalled: true,
            contractType: 'Mượn',
            deploymentBy: 'TINPNC',
            quantity: 1,
            fee: 0
          }]
        };
      }
      return s;
    }));
  };

  const handleUpdateDeviceInSet = (setId: string, deviceId: string, field: keyof Device, value: any) => {
    setReplacementSets(replacementSets.map(s => {
      if (s.id === setId) {
        return {
          ...s,
          devices: s.devices.map(d => d.id === deviceId ? { ...d, [field]: value } : d)
        };
      }
      return s;
    }));
  };

  const handleRemoveDeviceFromSet = (setId: string, deviceId: string) => {
    setReplacementSets(replacementSets.map(s => {
      if (s.id === setId) {
        return {
          ...s,
          devices: s.devices.filter(d => d.id !== deviceId)
        };
      }
      return s;
    }));
  };

  const renderDeviceTable = (devices: Device[], onUpdate: (id: string, field: keyof Device, val: any) => void, onRemove: (id: string) => void, isReplacementSet: boolean = false) => (
    <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 border-b">
          <tr>
            <th className="px-4 py-3 font-medium w-40">Loại thiết bị</th>
            <th className="px-4 py-3 font-medium">Tên thiết bị / Tên Nhóm</th>
            <th className="px-4 py-3 font-medium text-center w-20">Thu hồi</th>
            <th className="px-4 py-3 font-medium w-32">Loại hình</th>
            <th className="px-4 py-3 font-medium w-32">Triển khai</th>
            <th className="px-4 py-3 font-medium w-24">Số lượng</th>
            {isReplacementSet && <th className="px-4 py-3 font-medium w-32">Phí (VNĐ)</th>}
            <th className="px-4 py-3 w-12 text-center">Xóa</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {devices.map((device) => (
            <tr key={device.id} className={cn("hover:bg-slate-50/50 transition-colors", device.type === 'Nhóm thiết bị' ? 'bg-indigo-50/20' : '')}>
              <td className="px-4 py-2">
                <select 
                  value={device.type} 
                  onChange={(e) => {
                    onUpdate(device.id, 'type', e.target.value);
                    onUpdate(device.id, 'name', '');
                  }}
                  className={cn("w-full h-9 rounded-md border px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500", device.type === 'Nhóm thiết bị' ? 'border-indigo-300 font-semibold text-indigo-700 bg-indigo-50' : 'border-slate-300')}
                >
                  {deviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
              <td className="px-4 py-2 relative">
                <input 
                  type="text" 
                  value={device.name} 
                  onChange={(e) => onUpdate(device.id, 'name', e.target.value)}
                  list={`devices-${device.id}`}
                  placeholder={device.type === 'Nhóm thiết bị' ? "Chọn nhóm thiết bị..." : "Chọn hoặc nhập tên..."}
                  className={cn("w-full h-9 rounded-md border px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500", device.type === 'Nhóm thiết bị' ? 'border-indigo-300 font-semibold text-indigo-800 bg-white' : 'border-slate-300')}
                />
                <datalist id={`devices-${device.id}`}>
                  {device.type === 'Nhóm thiết bị' 
                    ? deviceGroups.map(g => <option key={g.name} value={g.name} />)
                    : (MOCK_DEVICE_OPTIONS[device.type] || []).map(opt => <option key={opt} value={opt} />)
                  }
                </datalist>
              </td>
              <td className="px-4 py-2 text-center">
                <button 
                  onClick={() => onUpdate(device.id, 'isRecalled', !device.isRecalled)}
                  className={cn("w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors border", device.isRecalled ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100")}
                >
                  {device.isRecalled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </td>
              <td className="px-4 py-2">
                <select 
                  value={device.contractType} 
                  onChange={(e) => onUpdate(device.id, 'contractType', e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Bán">Bán</option>
                  <option value="Thuê">Thuê</option>
                  <option value="Mượn">Mượn</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <select 
                  value={device.deploymentBy} 
                  onChange={(e) => onUpdate(device.id, 'deploymentBy', e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="TINPNC">TINPNC</option>
                  <option value="Sale">Sale</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <FormattedNumberInput 
                  min={1}
                  value={device.quantity} 
                  onChange={(val) => onUpdate(device.id, 'quantity', val)}
                  className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {isReplacementSet && (
                <td className="px-4 py-2">
                  <FormattedNumberInput 
                    min={0}
                    value={device.fee || 0} 
                    onChange={(val) => onUpdate(device.id, 'fee', val)}
                    className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
              <td className="px-4 py-2 text-center">
                <button onClick={() => onRemove(device.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {devices.length === 0 && (
            <tr>
              <td colSpan={isReplacementSet ? 8 : 7} className="px-4 py-8 text-center text-slate-500">Chưa có thiết bị nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsGroupModalOpen(true)}>
          Tạo nhóm thiết bị
        </Button>
      </div>

      {/* Group Management Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Quản lý Nhóm thiết bị</h3>
                <p className="text-sm text-slate-500">Tạo các nhóm thiết bị để dùng lại nhanh chóng</p>
              </div>
              <button onClick={() => setIsGroupModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="flex justify-end mb-4">
                 <Button variant="primary" size="sm" icon={Plus} onClick={handleAddGroup}>Thêm nhóm mới</Button>
              </div>

              {deviceGroups.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 mb-2">Chưa có nhóm thiết bị nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deviceGroups.map((group) => (
                    <div key={group.id} className="border border-indigo-200 rounded-lg p-5 bg-white shadow-sm relative">
                      <div className="absolute top-4 right-4">
                        <button onClick={() => handleRemoveGroup(group.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="max-w-md mb-4 pr-12">
                        <label className="text-xs font-bold text-indigo-800 uppercase mb-1 block">Tên nhóm thiết bị</label>
                        <input 
                          type="text" 
                          value={group.name} 
                          onChange={(e) => handleUpdateGroupName(group.id, e.target.value)} 
                          className="w-full h-9 rounded-md border border-indigo-300 px-3 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="VD: Combo Router + Camera"
                        />
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-slate-50">
                        <table className="w-full text-sm text-left">
                          <thead className="text-slate-600 border-b">
                            <tr>
                              <th className="px-4 py-2 font-medium w-48">Loại thiết bị</th>
                              <th className="px-4 py-2 font-medium">Tên thiết bị</th>
                              <th className="px-4 py-2 w-12 text-center">
                                <button onClick={() => handleAddDeviceToGroup(group.id)} title="Thêm thiết bị con" className="p-1 hover:bg-slate-200 rounded text-blue-600"><Plus className="w-4 h-4 mx-auto" /></button>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {group.devices.map(d => (
                               <tr key={d.id} className="hover:bg-slate-50/50">
                                 <td className="px-4 py-1.5">
                                   <select value={d.type} onChange={e => handleUpdateGroupDevice(group.id, d.id, 'type', e.target.value)} className="w-full h-8 rounded border border-slate-300 px-2 text-sm focus:border-blue-500">
                                     {baseDeviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                   </select>
                                 </td>
                                 <td className="px-4 py-1.5 relative">
                                    <input type="text" value={d.name} onChange={e => handleUpdateGroupDevice(group.id, d.id, 'name', e.target.value)} list={`g-devices-${d.id}`} className="w-full h-8 rounded border border-slate-300 px-2 text-sm focus:border-blue-500" placeholder="Chọn hoặc nhập tên thiết bị..." />
                                    <datalist id={`g-devices-${d.id}`}>
                                      {(MOCK_DEVICE_OPTIONS[d.type] || []).map(opt => <option key={opt} value={opt} />)}
                                    </datalist>
                                 </td>
                                 <td className="px-4 py-1.5 text-center">
                                    <button onClick={() => handleRemoveGroupDevice(group.id, d.id)} className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4 mx-auto" /></button>
                                 </td>
                               </tr>
                            ))}
                            {group.devices.length === 0 && <tr><td colSpan={3} className="text-center py-4 text-slate-500 italic">Chưa có thiết bị con. Hãy bấm + để thêm.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end">
              <Button variant="primary" onClick={() => setIsGroupModalOpen(false)}>Hoàn tất</Button>
            </div>
          </div>
        </div>
      )}

      {/* Thiết bị mặc định */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Thiết bị mặc định</h3>
            <p className="text-sm text-slate-500 mt-1">Danh sách thiết bị hoặc nhóm thiết bị được cung cấp mặc định kèm theo sản phẩm</p>
          </div>
          <Button variant="outline" icon={Plus} onClick={handleAddDefaultDevice}>Thêm thiết bị</Button>
        </div>
        
        {renderDeviceTable(defaultDevices, handleUpdateDefaultDevice, handleRemoveDefaultDevice)}
      </div>

      {/* Thiết bị thay thế */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Bộ thiết bị thay thế</h3>
            <p className="text-sm text-slate-500 mt-1">Các bộ thiết bị thay thế toàn bộ thiết bị mặc định (có thể áp dụng phí)</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddReplacementSet}>Thêm bộ thay thế</Button>
        </div>

        {replacementSets.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-2">Chưa có bộ thiết bị thay thế nào</p>
            <Button variant="outline" size="sm" onClick={handleAddReplacementSet}>Tạo bộ đầu tiên</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {replacementSets.map((set, index) => (
              <div key={set.id} className="border border-blue-200 bg-blue-50/30 rounded-xl overflow-hidden shadow-sm relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => handleRemoveReplacementSet(set.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors bg-white shadow-sm border border-slate-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 border-b border-blue-100 bg-blue-50/50">
                  <div className="flex flex-col md:flex-row gap-4 md:items-end max-w-2xl pr-12">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Tên bộ thay thế</label>
                      <input 
                        type="text" 
                        value={set.name} 
                        onChange={(e) => handleUpdateReplacementSet(set.id, 'name', e.target.value)}
                        className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div className="w-48 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Phí thay thế (VNĐ)</label>
                      <input 
                        type="text" 
                        value={(set.devices.reduce((acc, d) => acc + (d.fee || 0) * d.quantity, 0)).toLocaleString()} 
                        readOnly
                        className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm font-bold text-blue-700 bg-slate-50 focus:outline-none cursor-default"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-slate-800">Danh sách thiết bị trong bộ này</h4>
                    <Button variant="outline" size="sm" icon={Plus} onClick={() => handleAddDeviceToSet(set.id)}>Thêm thiết bị</Button>
                  </div>
                  
                  {renderDeviceTable(
                    set.devices, 
                    (deviceId, field, val) => handleUpdateDeviceInSet(set.id, deviceId, field, val),
                    (deviceId) => handleRemoveDeviceFromSet(set.id, deviceId),
                    true
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
