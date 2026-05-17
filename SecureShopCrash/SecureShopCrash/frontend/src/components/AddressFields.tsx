import React, { useState, useEffect } from 'react';
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  type ProvinceCompat,
  type DistrictCompat,
  type WardCompat,
} from '../utils/vietnamProvinces';

interface AddressFieldsProps {
  province: string;         // tên tỉnh
  district?: string;        // tên huyện
  ward: string;             // tên xã/phường
  onProvinceChange: (name: string, id: string) => void;
  onDistrictChange: (name: string, id: string) => void;
  onWardChange: (name: string) => void;
  errorProvince?: string;
  errorDistrict?: string;
  errorWard?: string;
  className?: string;
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  province,
  district = '',
  ward,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  errorProvince,
  errorDistrict,
  errorWard,
  className = '',
}) => {
  const [provinces, setProvinces] = useState<ProvinceCompat[]>([]);
  const [districts, setDistricts] = useState<DistrictCompat[]>([]);
  const [wards, setWards]         = useState<WardCompat[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards]         = useState(false);

  // Load danh sách tỉnh khi mount
  useEffect(() => {
    fetchProvinces()
      .then(data => setProvinces(data))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Load huyện khi chọn tỉnh
  useEffect(() => {
    if (!selectedProvinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setLoadingDistricts(true);
    fetchDistricts(selectedProvinceId)
      .then(data => setDistricts(data))
      .finally(() => setLoadingDistricts(false));
  }, [selectedProvinceId]);

  // Load xã khi chọn huyện
  useEffect(() => {
    if (!selectedDistrictId) {
      setWards([]);
      return;
    }
    setLoadingWards(true);
    fetchWards(selectedDistrictId)
      .then(data => setWards(data))
      .finally(() => setLoadingWards(false));
  }, [selectedDistrictId]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id   = e.target.value;
    const name = provinces.find(p => p.province_id === id)?.province_name ?? '';
    setSelectedProvinceId(id);
    setSelectedDistrictId('');
    setDistricts([]);
    setWards([]);
    onProvinceChange(name, id);
    onDistrictChange('', '');
    onWardChange('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id   = e.target.value;
    const name = districts.find(d => d.district_id === id)?.district_name ?? '';
    setSelectedDistrictId(id);
    setWards([]);
    onDistrictChange(name, id);
    onWardChange('');
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = wards.find(w => w.ward_id === e.target.value)?.ward_name ?? '';
    onWardChange(name);
  };

  const selectClass = (hasError?: string) =>
    `w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Tỉnh / Thành phố */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh / Thành phố <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedProvinceId}
          onChange={handleProvinceChange}
          disabled={loadingProvinces}
          className={selectClass(errorProvince)}
        >
          <option value="">
            {loadingProvinces ? 'Đang tải...' : '-- Chọn tỉnh/TP --'}
          </option>
          {provinces.map(p => (
            <option key={p.province_id} value={p.province_id}>
              {p.province_name}
            </option>
          ))}
        </select>
        {errorProvince && <p className="text-red-500 text-xs mt-1">{errorProvince}</p>}
      </div>

      {/* Quận / Huyện */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận / Huyện <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedDistrictId}
          onChange={handleDistrictChange}
          disabled={!selectedProvinceId || loadingDistricts}
          className={selectClass(errorDistrict)}
        >
          <option value="">
            {loadingDistricts
              ? 'Đang tải...'
              : !selectedProvinceId
              ? 'Chọn tỉnh trước'
              : '-- Chọn quận/huyện --'}
          </option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name}
            </option>
          ))}
        </select>
        {errorDistrict && <p className="text-red-500 text-xs mt-1">{errorDistrict}</p>}
      </div>

      {/* Xã / Phường / Thị trấn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Xã / Phường / Thị trấn <span className="text-red-500">*</span>
        </label>
        <select
          value={wards.find(w => w.ward_name === ward)?.ward_id ?? ''}
          onChange={handleWardChange}
          disabled={!selectedDistrictId || loadingWards}
          className={selectClass(errorWard)}
        >
          <option value="">
            {loadingWards
              ? 'Đang tải...'
              : !selectedDistrictId
              ? 'Chọn quận/huyện trước'
              : '-- Chọn xã/phường --'}
          </option>
          {wards.map(w => (
            <option key={w.ward_id} value={w.ward_id}>
              {w.ward_name}
            </option>
          ))}
        </select>
        {errorWard && <p className="text-red-500 text-xs mt-1">{errorWard}</p>}
      </div>
    </div>
  );
};

export default AddressFields;
