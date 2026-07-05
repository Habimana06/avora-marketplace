import { Link } from 'react-router-dom';

export default function SiteFooter({ dark = true }) {
  return (
    <footer className={`${dark ? 'bg-primary text-white' : 'bg-gray-50 text-primary border-t border-gray-100'} py-16 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Shop</h4>
            <ul className={`space-y-2.5 text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
              <li><Link to="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-gold transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-gold transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Support</h4>
            <ul className={`space-y-2.5 text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Account</h4>
            <ul className={`space-y-2.5 text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
              <li><Link to="/customer/orders" className="hover:text-gold transition-colors">Order History</Link></li>
              <li><Link to="/customer/wishlist" className="hover:text-gold transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition-colors">Cart</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Company</h4>
            <ul className={`space-y-2.5 text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
              <li><Link to="/" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Craftsmanship</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Careers</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-xs tracking-wider uppercase ${dark ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'}`}>
          <p>© {new Date().getFullYear()} AVORA · Proudly Made in Rwanda</p>
          <p>Prices in RWF</p>
        </div>
      </div>
    </footer>
  );
}
