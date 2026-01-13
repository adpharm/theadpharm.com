export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="The AdPharm" className="h-8" />
        </div>

        <div className="flex items-center gap-8">{/* Navigation items will go here */}</div>
      </nav>
    </header>
  );
}
