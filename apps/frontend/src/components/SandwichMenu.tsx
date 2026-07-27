import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Opciones', path: '/options' },
  { label: 'Créditos', path: '/credits' },
  { label: 'Página de prueba', path: '/testing' },
];

export function SandwichMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative z-50">
      {/* Hamburger Button */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Menú principal"
        aria-expanded={isOpen}
        className="flex flex-col justify-center items-center w-12 h-12 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors shadow-md cursor-pointer"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
          }`}
        />
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
            <h2 className="text-xl font-bold tracking-wide text-purple-400">Campus Rush</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
              className="text-gray-400 hover:text-white p-1 rounded-md text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
            Campus Rush: 7:00 A.M. &copy; 2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default SandwichMenu;
