import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🎲 <span>Board Store</span></div>
            <p className="footer-description">
              Your ultimate destination for token games, board games, card games,
              miniatures, dice, and all tabletop gaming accessories.
            </p>
          </div>

          <div>
            <h3 className="footer-title">Shop</h3>
            <div className="footer-links">
              <Link href="/products?category=Board Games" className="footer-link">Board Games</Link>
              <Link href="/products?category=Card Games" className="footer-link">Card Games</Link>
              <Link href="/products?category=Miniatures" className="footer-link">Miniatures</Link>
              <Link href="/products?category=Dice & Tokens" className="footer-link">Dice & Tokens</Link>
              <Link href="/products?category=Accessories" className="footer-link">Accessories</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Account</h3>
            <div className="footer-links">
              <Link href="/auth/login" className="footer-link">Sign In</Link>
              <Link href="/auth/register" className="footer-link">Create Account</Link>
              <Link href="/wishlist" className="footer-link">Wishlist</Link>
              <Link href="/cart" className="footer-link">Cart</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Support</h3>
            <div className="footer-links">
              <span className="footer-link">Help Center</span>
              <span className="footer-link">Shipping Info</span>
              <span className="footer-link">Returns</span>
              <span className="footer-link">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Board Store. All rights reserved.</p>
          <p>Crafted with ❤️ for tabletop gamers</p>
        </div>
      </div>
    </footer>
  );
}
