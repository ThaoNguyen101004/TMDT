import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Copy, CheckCircle, QrCode, Building2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { orderApi } from "../utils/api";
import { toast } from "react-toastify";

export interface BankTransferQrInfo {
  orderId: string;
  amount: number;
  transferContent: string;
  qrImageUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BankTransferPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = (location.state as { orderId?: string })?.orderId;

  const [qrInfo, setQrInfo] = useState<BankTransferQrInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!orderId) {
      navigate("/cart");
      return;
    }

    const load = async () => {
      try {
        const data = await orderApi.getBankTransferQr(orderId);
        setQrInfo(data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Không thể tạo mã QR thanh toán"
        );
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId, navigate]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Đang tạo mã QR thanh toán...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!qrInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-lg mx-auto w-full px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
            <QrCode className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-bold">Quét mã để thanh toán</h1>
            <p className="text-blue-100 text-sm mt-2">
              Số tiền đã bao gồm sản phẩm + phí vận chuyển − giảm giá (nếu có)
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <img
                src={qrInfo.qrImageUrl}
                alt="Mã QR chuyển khoản"
                className="w-64 h-64 object-contain border rounded-xl bg-white p-2"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Số tiền cần chuyển</p>
              <p className="text-3xl font-bold text-rose-600">
                {formatPrice(Number(qrInfo.amount))}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500">Ngân hàng</p>
                  <p className="font-semibold text-gray-900">{qrInfo.bankName}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Số tài khoản</p>
                  <p className="font-semibold text-gray-900">{qrInfo.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(qrInfo.accountNumber, "số tài khoản")}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-gray-500">Chủ tài khoản</p>
                <p className="font-semibold text-gray-900">{qrInfo.accountName}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="text-gray-500">Nội dung chuyển khoản (bắt buộc)</p>
                  <p className="font-bold text-purple-700">{qrInfo.transferContent}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(qrInfo.transferContent, "nội dung CK")}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Vui lòng chuyển <strong>đúng số tiền</strong> và ghi <strong>đúng nội dung</strong> để
              shop xác nhận đơn nhanh hơn. Đơn hàng sẽ được xử lý sau khi nhận được tiền.
            </p>

            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              <CheckCircle className="w-5 h-5" />
              Đã chuyển khoản — Xem đơn hàng
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BankTransferPayment;
