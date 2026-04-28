import { Link } from 'react-router-dom'

const contacts = [
  {
    label: 'Hotline',
    value: '0909 000 000',
    href: 'tel:0909000000',
    description: 'Gọi ngay để được tư vấn nhanh.',
  },
  {
    label: 'Zalo',
    value: 'PhuongTrang Store',
    href: 'https://zalo.me/0909000000',
    description: 'Nhắn Zalo để nhận báo giá và tư vấn chi tiết.',
  },
  {
    label: 'Facebook',
    value: 'PhuongTrang Store',
    href: 'https://facebook.com/phuongtrangstore',
    description: 'Inbox Facebook để được hỗ trợ trực tiếp.',
  },
]

function ContactPage() {
  return (
    <section className="container-app space-y-6">
      <div className="overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-panel">
        <div className="grid gap-8 bg-brand-grid bg-grid p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-red-700 bg-red-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300">
              Liên hệ tư vấn
            </span>
            <h1 className="text-3xl font-black leading-tight lg:text-5xl">
              Kết nối với PhươngTrang Store để nhận báo giá và tư vấn đúng nhu cầu
            </h1>
            <p className="max-w-2xl text-sm text-zinc-300 lg:text-base">
              Chúng tôi hỗ trợ nhanh các dòng dụng cụ cầm tay, máy hàn, máy công trình và vật tư kim khí.
              Hãy chọn kênh liên hệ phù hợp nhất để được phản hồi sớm.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="tel:0909000000"
                className="rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Gọi ngay
              </a>
              <Link
                to="/products"
                className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-bold text-zinc-100 transition hover:border-red-600 hover:text-red-400"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Thông tin nhanh</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-zinc-500">Giờ làm việc</p>
                <p className="mt-1 font-semibold text-white">08:00 - 20:30, Thứ 2 đến Chủ nhật</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-zinc-500">Hỗ trợ kỹ thuật</p>
                <p className="mt-1 font-semibold text-white">Tư vấn đúng máy, đúng công suất</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">{contact.label}</p>
                <h2 className="mt-2 text-2xl font-black text-zinc-900">{contact.value}</h2>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Liên hệ</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">{contact.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition group-hover:text-red-800">
              Nhấn để mở {contact.label}
              <span aria-hidden="true">→</span>
            </div>
          </a>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Địa chỉ hỗ trợ</p>
          <h2 className="mt-2 text-2xl font-black text-zinc-900">PhươngTrang Store</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Hotline: <a className="font-semibold text-red-700" href="tel:0909000000">0909 000 000</a>
            <br />
            Email: <a className="font-semibold text-red-700" href="mailto:hotro@phuongtrangstore.vn">hotro@phuongtrangstore.vn</a>
            <br />
            Chúng tôi luôn sẵn sàng tư vấn nhanh các sản phẩm báo giá liên hệ.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">Tư vấn nhanh</p>
          <h2 className="mt-2 text-2xl font-black">Cần chọn đúng máy?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Gửi nhu cầu sử dụng, chúng tôi sẽ tư vấn dòng máy phù hợp với công việc, công suất và ngân sách của bạn.
          </p>
          <a
            href="https://zalo.me/0909000000"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
          >
            Chat Zalo ngay
          </a>
        </div>
      </div>
    </section>
  )
}

export default ContactPage

