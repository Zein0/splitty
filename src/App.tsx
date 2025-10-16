import clsx from 'clsx';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MerchantPage from './pages/MerchantPage';

const navigation = [
  { to: '/', label: 'Split expenses' },
  { to: '/merchant', label: 'Merchant' },
];

const App = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-ocean-500/20 via-slate-900/40 to-slate-950 blur-3xl" />
      <div className="relative">
        <header className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 pb-6 pt-8 sm:flex-row sm:justify-between sm:px-6 lg:max-w-6xl lg:px-8">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-ocean-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Splitly+
          </NavLink>
          <nav className="flex items-center gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }: { isActive: boolean }) =>
                  clsx(
                    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                    isActive
                      ? 'bg-gradient-to-r from-ocean-500 via-blossom-500 to-ocean-400 text-white shadow-lg shadow-ocean-900/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/merchant" element={<MerchantPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
