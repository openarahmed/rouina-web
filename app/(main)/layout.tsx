// File: app/(main)/layout.tsx

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        {children}
      </main>
      <Footer />
    </>
  );
}