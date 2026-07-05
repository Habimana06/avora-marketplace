export default function CustomerWishlist() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading font-bold text-3xl mb-6">Wishlist</h1>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">Your wishlist is empty.</p>
        <a href="/shop" className="inline-block btn-primary mt-6">Browse Products</a>
      </div>
    </div>
  )
}