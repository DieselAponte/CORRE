import type { ReactNode } from 'react';
import { SandwichMenu } from '../components/SandwichMenu';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title = 'Campus Rush' }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-wide text-purple-400">{title}</h1>
        <SandwichMenu />
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default MainLayout;
