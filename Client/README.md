# PhuongTrang Store Frontend

Frontend cho website thuong mai dien tu **PhuongTrang Store** (React + Vite + Tailwind CSS), ket noi backend C#.

## Features da refactor

- Header phong cach cong nghiep do/den, co search, gio hang, menu responsive.
- Dropdown danh muc da cap theo route `/category/:id`.
- Product Grid responsive (1 cot mobile, 2 cot tablet, 4 cot desktop).
- Hien thi gia theo rule backend:
  - `IsContactPrice = true` -> `Lien he`
  - nguoc lai -> format VNĐ (`1.200.000d`)
- Product image fallback khi khong co anh.
- Product detail page, category page, search page, cart page.
- Luu gio hang tren `localStorage`.

## Cau truc chinh

- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/customerpage/ProductGrid.jsx`
- `src/components/customerpage/ProductDetailPage.jsx`
- `src/components/customerpage/CategoryPage.jsx`
- `src/services/productApi.js`
- `src/utils/product.js`

## Yeu cau

- Node.js 18+

## Chay local

```bash
npm install
npm run dev
```

Mac dinh frontend goi API toi:

- `http://localhost:5026`

Co the override bang file `.env`:

```bash
VITE_API_BASE_URL=http://localhost:5026
```

## Kiem tra

```bash
npm run lint
npm run build
```
