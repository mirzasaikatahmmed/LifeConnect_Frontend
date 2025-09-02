import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background border-b border-foreground/10 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-xl font-bold text-foreground">
              LifeConnect
            </Link>
          </div>
          
          <div>
            <ul className="flex space-x-6">
              <li>
                <Link href="/login" className="text-foreground hover:text-foreground/70">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-foreground hover:text-foreground/70">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}