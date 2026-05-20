import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:12345/api";

// 1. Axios cho AUTH (có token)
export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 2. Axios cho PUBLIC (không gửi token)
export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// === DANH SÁCH PUBLIC ENDPOINTS ===
// Các endpoint này không cần token
const PUBLIC_PATHS = [
  "/categories",
  "/brands",
  "/products",
  "/articles",
  "/reviews",
  "/media",
  "/inventories",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/verify-token",
  "/auth/reset-password",
  "/auth/login",
  "/auth/register",
];

// === REQUEST INTERCEPTOR: THÊM TOKEN CHO MỌI REQUEST (trừ public endpoints) ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const method = config.method?.toLowerCase();
    const url = config.url || "";

    // Kiểm tra nếu là public endpoint
    const isPublicPath = PUBLIC_PATHS.some((path) => url.startsWith(path));

    // LUÔN gửi token nếu có (ngoại trừ public endpoints)
    if (token && !isPublicPath) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // Vẫn gửi token nếu có (để backend biết user đã login)
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublicPath && method !== "get") {
      // Nếu không có token, GET không yêu cầu, nhưng POST/PUT/DELETE/PATCH cần cảnh báo
      console.warn(`No token available for ${method?.toUpperCase()} ${url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
const RETRY_FLAG = "_axiosRetry";

function rewriteUrls(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    const match = obj.match(/^(?:https?:\/\/[^\/]+)?(\/api\/files\/.*)$/);
    if (match) {
      const path = match[1];
      const apiOrigin = API_URL.replace(/\/api\/?$/, "");
      return `${apiOrigin}${path}`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => rewriteUrls(item));
  }
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = rewriteUrls(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

const urlRewriter = (response: any) => {
  if (response && response.data) {
    response.data = rewriteUrls(response.data);
  }
  return response;
};

publicApi.interceptors.response.use(urlRewriter, (error) => Promise.reject(error));


api.interceptors.response.use(
  urlRewriter,
  async (error) => {
    const originalRequest = error.config;

    const isPublicAuthEndpoint = 
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-registration") ||
      originalRequest.url?.includes("/auth/verify-email") ||
      originalRequest.url?.includes("/auth/resend-verification") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/verify-token") ||
      originalRequest.url?.includes("/auth/reset-password");

    // Handle 401 errors (Unauthorized)
    if (
      error.response?.status === 401 &&
      !originalRequest[RETRY_FLAG] &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !isPublicAuthEndpoint
    ) {
      originalRequest[RETRY_FLAG] = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, expiresIn } = refreshResponse.data;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        localStorage.setItem("accessToken", accessToken);
        if (expiresIn) {
          localStorage.setItem(
            "tokenExpiresAt",
            (Date.now() + expiresIn * 1000).toString()
          );
        }

        // Ensure headers object exists and update Authorization
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }

        // Remove the old Authorization header if it exists
        delete originalRequest.headers.Authorization;

        // Add the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Also update axios default headers for this instance
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Create a fresh request with the new token to avoid interceptor loop
        const retryConfig = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };

        // Use axios directly to avoid going through interceptors again
        return axios(retryConfig);
      } catch (refreshError: any) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiresAt");

        // Don't redirect if already on login or register page
        if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors with toast messages
    if (axios.isAxiosError(error)) {
      const { response } = error;
      const errorData = response?.data;

      // Don't show toast for 401 on login/auth endpoints (handled by component)
      if (
        response?.status === 401 &&
        (isPublicAuthEndpoint || originalRequest.url?.includes("/auth/refresh"))
      ) {
        return Promise.reject(error);
      }

      switch (response?.status) {
        case 400:
          if (errorData?.details) {
            Object.values(errorData.details).forEach((msg) =>
              toast.error(String(msg))
            );
          } else {
            toast.error(errorData?.message || "Dữ liệu không hợp lệ!");
          }
          break;
        case 401:
          // Already handled above
          break;
        case 403:
          toast.error(
            errorData?.message ||
              "Tài khoản bị khóa hoặc không có quyền truy cập!"
          );
          break;
        case 404:
          toast.error(errorData?.message || "Không tìm thấy tài nguyên!");
          break;
        case 409:
          toast.error(errorData?.message || "Email đã được sử dụng!");
          break;
        case 500:
          toast.error(
            errorData?.message || "Lỗi máy chủ. Vui lòng thử lại sau!"
          );
          break;
        default:
          toast.error(errorData?.message || "Đã xảy ra lỗi không xác định!");
      }
    } else {
      toast.error("Không thể kết nối đến server. Vui lòng thử lại!");
    }

    return Promise.reject(error);
  }
);

// Export mặc định
export default api;
