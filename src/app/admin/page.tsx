"use client";
import { useEffect, useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import { getProduct } from "@/lib/products";
import { ORDER_STATUS_LABEL, type OrderRow, type OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "free_done",
  "payment_pending",
  "paid",
  "paid_form_done",
  "report_sent",
];

const STATUS_COLOR: Record<OrderStatus, string> = {
  free_done: "bg-app-bg text-muted",
  payment_pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  paid_form_done: "bg-purple/15 text-purple",
  report_sent: "bg-green-100 text-green-700",
};

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (password: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { "x-admin-password": password },
        });
        if (res.status === 401) {
          setError("비밀번호가 틀렸습니다.");
          setAuthed(false);
          return;
        }
        const data = await res.json();
        setOrders(data.orders ?? []);
        setAuthed(true);
        sessionStorage.setItem("admin_pw", password);
      } catch {
        setError("불러오기 실패. 환경변수(Supabase/ADMIN_PASSWORD)를 확인하세요.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setPw(saved);
      load(saved);
    }
  }, [load]);

  async function changeStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ id, status }),
    });
  }

  if (!authed) {
    return (
      <>
        <AppHeader title="관리자" showBack />
        <div className="flex flex-1 flex-col justify-center px-6">
          <h1 className="text-[20px] font-extrabold text-ink">관리자 로그인</h1>
          <p className="mt-1 text-[13px] text-muted">ADMIN_PASSWORD 를 입력하세요.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(pw)}
            placeholder="비밀번호"
            className="mt-4 w-full rounded-xl border border-line bg-app-bg px-4 py-3 text-[15px] outline-none focus:border-pink"
          />
          {error && <p className="mt-2 text-[13px] text-pink">{error}</p>}
          <button
            onClick={() => load(pw)}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-navy py-3.5 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "확인 중…" : "로그인"}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="주문 관리" showBack />
      <main className="flex-1 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-[15px] font-extrabold text-ink">주문/신청 {orders.length}건</h1>
          <button onClick={() => load(pw)} className="text-[13px] font-bold text-pink">
            새로고침
          </button>
        </div>

        {orders.length === 0 && (
          <p className="py-16 text-center text-[14px] text-muted">아직 주문이 없습니다.</p>
        )}

        <div className="space-y-3">
          {orders.map((o) => {
            const product = getProduct(o.product_slug);
            return (
              <div key={o.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-extrabold text-ink">
                      {product?.title ?? o.product_slug}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {new Date(o.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLOR[o.status]}`}
                  >
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-1 rounded-xl bg-app-bg p-3 text-[13px]">
                  <Row label="이름" value={o.name} />
                  <Row label="이메일" value={o.email} />
                  <Row label="전화" value={o.phone} />
                  <Row label="금액" value={o.amount ? `${o.amount.toLocaleString("ko-KR")}원` : "-"} />
                </div>

                <div className="mt-3">
                  <label className="text-[12px] font-bold text-muted">상태 변경</label>
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                    className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] font-semibold outline-none focus:border-pink"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="truncate font-semibold text-ink">{value || "-"}</span>
    </div>
  );
}
