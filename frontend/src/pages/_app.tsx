import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Navbar from '../components/Navbar'; 

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar /> 
      {/* Centered layout container shell */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
