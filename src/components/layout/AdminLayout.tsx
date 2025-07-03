import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4">
          <Outlet /> {/* ← This is where the current page (e.g. Dashboard) is inserted */}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
