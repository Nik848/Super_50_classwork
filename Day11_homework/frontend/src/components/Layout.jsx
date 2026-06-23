import { Outlet } from "react-router";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShopVista — Powered by DummyJSON
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
