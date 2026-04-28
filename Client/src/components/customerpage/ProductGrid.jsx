import { Link } from 'react-router-dom'

function ProductGrid({ products, onAddToCart = () => {} }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Link to={`/products/${product.id}`} className="block bg-zinc-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-52 w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <h3 className="min-h-12 text-sm font-semibold text-zinc-900">{product.name}</h3>
            <p className="text-xl font-bold text-red-700">{product.displayPrice}</p>
            <p className="text-xs text-zinc-500">Mã SP: {product.id}</p>

            <div className="mt-auto flex items-center gap-2">
              <Link
                to={`/products/${product.id}`}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
              >
                Chi tiết
              </Link>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                onClick={() => onAddToCart(product)}
              >
                Thêm giỏ
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ProductGrid


