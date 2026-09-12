import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Board Store | Premium Token Games & Tabletop Gaming",
  description: "Your ultimate destination for board games, card games, miniatures, dice, tokens, and tabletop gaming accessories. Shop premium token games and collectibles.",
  keywords: "board games, card games, token games, miniatures, dice, tabletop gaming, TCG, RPG",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
