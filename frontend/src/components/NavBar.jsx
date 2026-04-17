import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Zap, Sun, Moon } from 'lucide-react';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

function Navbar({ toggleTheme, theme, onSidebarChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const open = window.innerWidth >= 1024;
      setIsSidebarOpen(open);
      onSidebarChange?.(open);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    onSidebarChange?.(next);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggle}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      {/* Mobile top bar — hidden on desktop */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        {/* App name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-sm shadow-orange-200">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">TrueGrit</p>
            <p className="text-[9px] text-orange-500 font-semibold uppercase tracking-widest">Fitness Pro</p>
          </div>
        </div>

        {/* Right side — theme toggle + profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <SignedIn>
            <div className="relative">
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8 ring-2 ring-orange-100' } }} />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-semibold">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      <BottomNav />
    </>
  );
}

export default Navbar;
