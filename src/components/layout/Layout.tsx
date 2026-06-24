import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="page">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
