import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import { DataProvider as LostDataProvider } from './modules/lost_claim/context/DataContext';
import { ToastProvider as LostToastProvider } from './modules/lost_claim/context/ToastContext';
import { ToastProvider as FoundToastProvider } from './modules/found_social/components/Toast';

export default function UnifiedLayout() {
  return (
    <div className="min-h-screen app-bg bg-slate-50 flex flex-col font-sans">
      <Nav />
      {/* We layer the contexts needed by the sub-apps. They are proxying to central Auth context under the hood. */}
      <LostToastProvider>
        <LostDataProvider>
          <FoundToastProvider>
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 relative">
              <Outlet />
            </main>
          </FoundToastProvider>
        </LostDataProvider>
      </LostToastProvider>
      <Footer />
    </div>
  );
}
