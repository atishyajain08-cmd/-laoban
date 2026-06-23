import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
