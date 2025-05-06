import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <nav className="bg-gray-900 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-white">
          MovieHunt
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === '/' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
            }`}
          >
            Films Notés
          </Link>
          <Link
            href="/admin"
            className={`text-sm font-medium ${
              isAdmin ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
            }`}
          >
            Administration
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
