import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Upload } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

import { ErrorState, LoadingState } from "../components/PageState";
import { useAuth } from "../features/auth/AuthProvider";
import { apiBaseUrl, apiRequest } from "../lib/api";
import type { PaymentSetting } from "../types/api";

type PaymentSettingData = {
  paymentSetting: PaymentSetting;
};

type PaymentSettingForm = {
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankTransferQrImageUrl: string;
  bankTransferNote: string;
};

const emptyForm: PaymentSettingForm = {
  codEnabled: true,
  bankTransferEnabled: true,
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankBranch: "",
  bankTransferQrImageUrl: "",
  bankTransferNote: "YOUniverse {orderCode}",
};

const toForm = (setting: PaymentSetting): PaymentSettingForm => ({
  codEnabled: setting.codEnabled,
  bankTransferEnabled: setting.bankTransferEnabled,
  bankName: setting.bankName ?? "",
  bankAccountName: setting.bankAccountName ?? "",
  bankAccountNumber: setting.bankAccountNumber ?? "",
  bankBranch: setting.bankBranch ?? "",
  bankTransferQrImageUrl: setting.bankTransferQrImageUrl ?? "",
  bankTransferNote: setting.bankTransferNote ?? "",
});

export default function SettingsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PaymentSettingForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  const query = useQuery({
    queryKey: ["payment-settings"],
    queryFn: () => apiRequest<PaymentSettingData>("/settings/payment", { token }),
  });

  useEffect(() => {
    if (query.data?.paymentSetting) {
      setForm(toForm(query.data.paymentSetting));
    }
  }, [query.data]);

  const update = <K extends keyof PaymentSettingForm>(key: K, value: PaymentSettingForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const payload = () => ({
    codEnabled: form.codEnabled,
    bankTransferEnabled: form.bankTransferEnabled,
    bankName: form.bankName || null,
    bankAccountName: form.bankAccountName || null,
    bankAccountNumber: form.bankAccountNumber || null,
    bankBranch: form.bankBranch || null,
    bankTransferQrImageUrl: form.bankTransferQrImageUrl || null,
    bankTransferNote: form.bankTransferNote || null,
  });

  const save = useMutation({
    mutationFn: () => apiRequest<PaymentSettingData>("/settings/payment", { method: "PATCH", token, body: payload() }),
    onSuccess: (data) => {
      setError(null);
      setForm(toForm(data.paymentSetting));
      queryClient.setQueryData(["payment-settings"], data);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không lưu được cấu hình thanh toán."),
  });

  const uploadQr = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh QR.");
      return;
    }

    setUploadingQr(true);
    setError(null);

    try {
      const body = new FormData();
      body.set("file", file);
      const uploaded = await apiRequest<{ url: string }>("/upload/image", {
        method: "POST",
        token,
        body,
      });

      update("bankTransferQrImageUrl", uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không upload được ảnh QR.");
    } finally {
      setUploadingQr(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    save.mutate();
  };

  if (query.isLoading) return <LoadingState />;

  if (query.isError) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }

  return (
    <form className="page" onSubmit={onSubmit}>
      <div className="page-header">
        <div>
          <h2>Cài đặt</h2>
          <p>Cấu hình phương thức thanh toán hiển thị trên giao diện khách hàng.</p>
        </div>
        <button className="button" type="submit" disabled={save.isPending || uploadingQr}>
          <Save size={16} />
          {save.isPending ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>

      {error && <ErrorState message={error} />}

      <div className="grid-2">
        <section className="card tai-tho-card">
          <h3>Kết nối hệ thống (API)</h3>
          <dl className="detail-list">
            <div><dt>Đường dẫn API (Base URL)</dt><dd className="mono">{apiBaseUrl}</dd></div>
            <div><dt>Biến môi trường (Env key)</dt><dd className="mono">VITE_API_URL</dd></div>
          </dl>
        </section>

        <section className="card tai-tho-card">
          <h3>Phương thức thanh toán</h3>
          <div className="detail-list">
            <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.codEnabled}
                onChange={(event) => update("codEnabled", event.target.checked)}
              />
              <span>Cho phép thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.bankTransferEnabled}
                onChange={(event) => update("bankTransferEnabled", event.target.checked)}
              />
              <span>Cho phép thanh toán chuyển khoản</span>
            </label>
          </div>
        </section>
      </div>

      <section className="card tai-tho-card">
        <h3>Cấu hình chuyển khoản ngân hàng</h3>
        <p className="muted">Thông tin này sẽ hiển thị ở bước thanh toán của khách hàng khi chọn chuyển khoản.</p>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Tên ngân hàng</label>
            <input className="input" value={form.bankName} onChange={(event) => update("bankName", event.target.value)} placeholder="VD: Vietcombank" />
          </div>
          <div className="field">
            <label>Chủ tài khoản</label>
            <input className="input" value={form.bankAccountName} onChange={(event) => update("bankAccountName", event.target.value)} placeholder="VD: YOUNIVERSE" />
          </div>
          <div className="field">
            <label>Số tài khoản</label>
            <input className="input" value={form.bankAccountNumber} onChange={(event) => update("bankAccountNumber", event.target.value)} placeholder="VD: 0123456789" />
          </div>
          <div className="field">
            <label>Chi nhánh</label>
            <input className="input" value={form.bankBranch} onChange={(event) => update("bankBranch", event.target.value)} placeholder="Không bắt buộc" />
          </div>
          <div className="field">
            <label>Nội dung chuyển khoản</label>
            <input className="input" value={form.bankTransferNote} onChange={(event) => update("bankTransferNote", event.target.value)} placeholder="YOUniverse {orderCode}" />
            <span className="muted">Dùng {"{orderCode}"} để tự thay bằng mã đơn hàng sau khi tạo đơn.</span>
          </div>
          <div className="field">
            <label>URL ảnh QR</label>
            <input className="input" value={form.bankTransferQrImageUrl} onChange={(event) => update("bankTransferQrImageUrl", event.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 18, alignItems: "start" }}>
          <div className="field">
            <label>Upload ảnh QR</label>
            <label className="button button--secondary" style={{ justifyContent: "center", cursor: uploadingQr ? "not-allowed" : "pointer" }}>
              <Upload size={16} />
              {uploadingQr ? "Đang upload..." : "Chọn ảnh QR"}
              <input type="file" accept="image/*" onChange={uploadQr} disabled={uploadingQr} style={{ display: "none" }} />
            </label>
          </div>

          <div className="field">
            <label>Xem trước QR</label>
            {form.bankTransferQrImageUrl ? (
              <div style={{ width: 180, height: 180, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <img src={form.bankTransferQrImageUrl} alt="QR chuyển khoản" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            ) : (
              <div className="muted">Chưa có ảnh QR.</div>
            )}
          </div>
        </div>
      </section>

      <section className="card tai-tho-card">
        <h3>Tài khoản Quản trị mặc định</h3>
        <p className="muted">Dữ liệu mẫu (Seed backend) mặc định tạo tài khoản quản trị:</p>
        <pre className="mono" style={{ background: "#f5f5f4", padding: 14, borderRadius: 12, overflow: "auto" }}>
{`Tên đăng nhập (email): admin@youniverse.local
Mật khẩu (password): Admin123456`}
        </pre>
      </section>
    </form>
  );
}
