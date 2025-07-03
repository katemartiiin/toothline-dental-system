const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t px-6 py-3 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} KJM - Toothline. All rights reserved.
    </footer>
  );
};

export default Footer;