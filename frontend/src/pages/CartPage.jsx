export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-heading font-bold text-4xl mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-12">Your selected items.</p>

        <div className="card-premium p-8 text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <a href="/shop" className="inline-block btn-primary mt-6">Continue Shopping</a>
        </div>
      </div>
    </div>
  )
}