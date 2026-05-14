// Vietnam Provinces API - using provinces.open-api.vn
// This API is more reliable than vnappmob

export interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
}

export interface District {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface Ward {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  district_code: number;
}

// For compatibility with existing code
export interface ProvinceCompat {
  province_id: string;
  province_name: string;
}

export interface DistrictCompat {
  district_id: string;
  district_name: string;
  province_id: string;
}

export interface WardCompat {
  ward_id: string;
  ward_name: string;
  district_id: string;
}

const API_BASE = 'https://provinces.open-api.vn/api';
const API_TIMEOUT = 10000;

export async function fetchProvinces(): Promise<ProvinceCompat[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const res = await fetch(`${API_BASE}/p/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data: Province[] = await res.json();
    
    // Convert to compatible format
    return data.map(p => ({
      province_id: String(p.code),
      province_name: p.name
    }));
  } catch (err) {
    console.error('Province API failed:', err);
    return [];
  }
}

export async function fetchDistricts(provinceId: string): Promise<DistrictCompat[]> {
  const url = `${API_BASE}/p/${provinceId}?depth=2`;
  console.log('Fetching districts from:', url);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await res.json();
    console.log('District API response:', data);
    
    if (data.districts && Array.isArray(data.districts)) {
      const result = data.districts.map((d: District) => ({
        district_id: String(d.code),
        district_name: d.name,
        province_id: String(d.province_code)
      }));
      console.log('Mapped districts:', result);
      return result;
    }
    return [];
  } catch (err) {
    console.error('District API failed:', err);
    return [];
  }
}

export async function fetchWards(districtId: string): Promise<WardCompat[]> {
  const url = `${API_BASE}/d/${districtId}?depth=2`;
  console.log('Fetching wards from:', url);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await res.json();
    console.log('Ward API response:', data);
    
    if (data.wards && Array.isArray(data.wards)) {
      const result = data.wards.map((w: Ward) => ({
        ward_id: String(w.code),
        ward_name: w.name,
        district_id: String(w.district_code)
      }));
      console.log('Mapped wards:', result);
      return result;
    }
    return [];
  } catch (err) {
    console.error('Ward API failed:', err);
    return [];
  }
}
