/**
 * 34 tỉnh/thành phố Việt Nam sau sáp nhập 2025
 * Theo Nghị quyết 76/2025/QH15 (hiệu lực 01/07/2025)
 * oldCodes: mã tỉnh cũ trên provinces.open-api.vn để fetch phường/xã
 */
export interface NewProvince {
  id: string;
  name: string;
  oldCodes: number[]; // mã tỉnh cũ để fetch ward
}

export const VIETNAM_NEW_PROVINCES: NewProvince[] = [
  // 5 Thành phố trực thuộc Trung ương
  { id: '01', name: 'Hà Nội',           oldCodes: [1, 17, 35] },   // Hà Nội + Hòa Bình + Hà Nam
  { id: '79', name: 'TP. Hồ Chí Minh', oldCodes: [79, 74, 80] },  // HCM + Bình Dương + Long An
  { id: '31', name: 'Hải Phòng',        oldCodes: [31, 33] },       // Hải Phòng + Hưng Yên
  { id: '48', name: 'Đà Nẵng',          oldCodes: [48, 49] },       // Đà Nẵng + Quảng Nam
  { id: '92', name: 'Cần Thơ',          oldCodes: [92, 93, 94] },   // Cần Thơ + Hậu Giang + Sóc Trăng

  // 29 Tỉnh
  { id: '14', name: 'Sơn La',           oldCodes: [14, 11, 12] },   // Sơn La + Điện Biên + Lai Châu
  { id: '10', name: 'Lào Cai',          oldCodes: [10, 15] },       // Lào Cai + Yên Bái
  { id: '08', name: 'Tuyên Quang',      oldCodes: [8, 2] },         // Tuyên Quang + Hà Giang
  { id: '04', name: 'Cao Bằng',         oldCodes: [4, 6] },         // Cao Bằng + Bắc Kạn
  { id: '20', name: 'Lạng Sơn',         oldCodes: [20, 19] },       // Lạng Sơn + Thái Nguyên
  { id: '22', name: 'Quảng Ninh',       oldCodes: [22, 30] },       // Quảng Ninh + Hải Dương
  { id: '24', name: 'Bắc Giang',        oldCodes: [24, 27] },       // Bắc Giang + Bắc Ninh
  { id: '25', name: 'Phú Thọ',          oldCodes: [25, 26] },       // Phú Thọ + Vĩnh Phúc
  { id: '34', name: 'Thái Bình',        oldCodes: [34, 36] },       // Thái Bình + Nam Định
  { id: '38', name: 'Thanh Hóa',        oldCodes: [38, 37] },       // Thanh Hóa + Ninh Bình
  { id: '40', name: 'Nghệ An',          oldCodes: [40, 42] },       // Nghệ An + Hà Tĩnh
  { id: '46', name: 'Huế',              oldCodes: [46, 44, 45] },   // Thừa Thiên Huế + Quảng Bình + Quảng Trị
  { id: '52', name: 'Bình Định',        oldCodes: [52, 51] },       // Bình Định + Quảng Ngãi
  { id: '64', name: 'Gia Lai',          oldCodes: [64, 62] },       // Gia Lai + Kon Tum
  { id: '66', name: 'Đắk Lắk',         oldCodes: [66, 54] },       // Đắk Lắk + Phú Yên
  { id: '56', name: 'Khánh Hòa',        oldCodes: [56, 67] },       // Khánh Hòa + Đắk Nông
  { id: '68', name: 'Lâm Đồng',         oldCodes: [68, 58, 60] },   // Lâm Đồng + Ninh Thuận + Bình Thuận
  { id: '75', name: 'Đồng Nai',         oldCodes: [75, 77] },       // Đồng Nai + Bà Rịa - Vũng Tàu
  { id: '72', name: 'Tây Ninh',         oldCodes: [72, 70] },       // Tây Ninh + Bình Phước
  { id: '89', name: 'An Giang',         oldCodes: [89, 91] },       // An Giang + Kiên Giang
  { id: '87', name: 'Đồng Tháp',        oldCodes: [87, 82, 83] },   // Đồng Tháp + Tiền Giang + Bến Tre
  { id: '86', name: 'Vĩnh Long',        oldCodes: [86, 84] },       // Vĩnh Long + Trà Vinh
  { id: '95', name: 'Bạc Liêu',         oldCodes: [95, 96] },       // Bạc Liêu + Cà Mau
  { id: '96', name: 'Cà Mau',           oldCodes: [96] },           // standalone nếu chưa sáp nhập
];

// ── Fetch wards từ API theo mã tỉnh cũ ─────────────────────────────────────

const API_BASE = 'https://provinces.open-api.vn/api';

export interface WardOption {
  code: number;
  name: string;
  districtName: string;
}

// Cache để tránh gọi lại API
const wardCache = new Map<string, WardOption[]>();

export async function fetchWardsForProvince(province: NewProvince): Promise<WardOption[]> {
  const cacheKey = province.id;
  if (wardCache.has(cacheKey)) return wardCache.get(cacheKey)!;

  const allWards: WardOption[] = [];

  for (const code of province.oldCodes) {
    try {
      const res = await fetch(`${API_BASE}/p/${code}?depth=3`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.districts) {
        for (const district of data.districts) {
          if (district.wards) {
            for (const ward of district.wards) {
              allWards.push({
                code: ward.code,
                name: ward.name,
                districtName: district.name,
              });
            }
          }
        }
      }
    } catch {
      // skip on error
    }
  }

  wardCache.set(cacheKey, allWards);
  return allWards;
}
