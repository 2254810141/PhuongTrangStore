import heroImg from '../../assets/DellInspiron15.jpg'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/HomePage.css'
import { getProducts } from '../../services/productApi'

const categories = [
  {
    title: 'Gaming hiệu năng cao',
    text: 'Tản nhiệt tối ưu, màn 240Hz, hỗ trợ nâng cấp RAM/SSD.',
    badge: '-12% tuần này',
  },
  {
    title: 'Học tập & văn phòng',
    text: 'Mỏng nhẹ dưới 1.3kg, pin trọn ngày, sạc nhanh 65W.',
    badge: 'Quà 1 triệu',
  },
  {
    title: 'Đồ họa & 3D',
    text: 'Màn chuẩn màu, NVIDIA Studio, RAM 32GB cho project nặng.',
    badge: 'Cấu hình đề xuất',
  },
]

function HomePage() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getProducts()
        if (isMounted) {
          setFeatured(data.filter((item) => item.isActive).slice(0, 3))
        }
      } catch {
        if (isMounted) {
          setFeatured([])
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-page">
      <section className="hero-section" id="top">
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="pill">Laptop mới 2025</div>
            <h1>Trải nghiệm laptop mạnh mẽ cho công việc, học tập và gaming</h1>
            <p className="lede">
              Chọn cấu hình tối ưu, giao siêu tốc, bảo hành chính hãng. Đội ngũ tư vấn giúp bạn tìm chiếc
              laptop phù hợp nhất trong vài phút.
            </p>
            <div className="hero__actions">
              <Link className="primary-btn" to="/products/laptop">
                Xem danh sách
              </Link>
              <Link className="ghost-btn" to="/accessories">
                Xem phụ kiện
              </Link>
            </div>
            <div className="hero__meta">
              <span>Miễn phí cài đặt & vệ sinh định kỳ</span>
              <span>Giá đã bao gồm VAT</span>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__card">
              <img src={heroImg} alt="Laptop cao cap" />
              <div className="hero__floating">Giảm đến 3.000.000₫ + quà tặng</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="laptops">
        <div className="container section__header">
          <div>
            <p className="eyebrow">Sẵn hàng hôm nay</p>
            <h2>Top lựa chọn nổi bật</h2>
            <p className="muted">Đã tinh chỉnh cấu hình, tản nhiệt và bảo hành để sẵn sàng sử dụng.</p>
          </div>
          <Link className="link" to="/accessories">
            Xem thêm phụ kiện →
          </Link>
        </div>
        <div className="container card-grid">
          {featured.map((item) => (
            <article className="product-card" key={item.name}>
              <div className="product-card__top">
                <span className="pill pill--soft">{item.badge}</span>
                <span className="price">{item.displayPrice}</span>
              </div>
              {item.image && <img src={item.image} alt={item.name} />}
              <h3>{item.name}</h3>
              <p className="muted">{item.description}</p>
              <ul className="spec-list">
                {item.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <div className="product-card__footer">
                <Link to={`/products/${item.id}`} className="ghost-btn">
                  Xem
                </Link>
                <button type="button" className="primary-btn">
                  Thêm vào giỏ
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--muted" id="accessories">
        <div className="container section__header">
          <div>
            <p className="eyebrow">Danh mục</p>
            <h2>Chọn theo nhu cầu</h2>
            <p className="muted">Mọi thứ từ gaming, văn phòng đến đồ họa chuyên nghiệp.</p>
          </div>
          <Link className="link" to="/accessories">
            Xem phụ kiện hot →
          </Link>
        </div>
        <div className="container category-grid">
          {categories.map((cat) => (
            <article className="category-card" key={cat.title}>
              <div className="pill pill--soft">{cat.badge}</div>
              <h3>{cat.title}</h3>
              <p className="muted">{cat.text}</p>
              <Link className="link" to="/products/laptop">
                Xem gợi ý
              </Link>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}

export default HomePage
