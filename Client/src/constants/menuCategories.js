export const categoryMenu = [
  {
    id: 'dung-cu-dung-pin',
    label: 'Dụng Cụ Dùng Pin',
    children: [
      { id: 'khoan-pin', label: 'Khoan pin' },
      { id: 'siet-vit-pin', label: 'Siết vít pin' },
      { id: 'mai-pin', label: 'Mài pin' },
    ],
  },
  {
    id: 'may-han-cat',
    label: 'Máy Hàn và Cắt',
    children: [
      { id: 'han-que', label: 'Hàn que' },
      { id: 'han-mig', label: 'Hàn MIG' },
      { id: 'han-tig', label: 'Hàn TIG' },
      { id: 'cat-plasma', label: 'Cắt Plasma' },
    ],
  },
  {
    id: 'may-cong-trinh',
    label: 'Máy Công Trình',
    children: [
      { id: 'khoan-bua', label: 'Khoan búa' },
      { id: 'duc-be-tong', label: 'Đục bê tông' },
      { id: 'rut-loi', label: 'Rút lõi' },
    ],
  },
  {
    id: 'vat-tu-kim-khi',
    label: 'Vật Tư Kim Khí',
    children: [
      { id: 'luoi-cat', label: 'Lưỡi cắt' },
      { id: 'da-mai', label: 'Đá mài' },
      { id: 'nham', label: 'Nhám' },
    ],
  },
]

export const categorySlugMap = {
  'khoan-pin': [1],
  'siet-vit-pin': [2],
  'mai-pin': [3],
  'han-que': [4],
  'han-mig': [5],
  'han-tig': [6],
  'cat-plasma': [7],
  'khoan-bua': [8],
  'duc-be-tong': [9],
  'rut-loi': [10],
  'luoi-cat': [11],
  'da-mai': [12],
  nham: [13],
}

export function getCategoryLabelById(id) {
  for (const group of categoryMenu) {
    if (group.id === id) return group.label
    const child = group.children.find((item) => item.id === id)
    if (child) return child.label
  }

  return 'Danh mục sản phẩm'
}

