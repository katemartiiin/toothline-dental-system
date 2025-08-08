const Footer: React.FC = () => {
  return (
    <footer className="w-full flex flex-wrap bg-gray-50 border-t px-6 py-3 text-xs text-gray-500">
      <span className="w-full md:w-1/2 text-center md:text-left py-2">&copy; {new Date().getFullYear()} KJM - Toothline. All rights reserved.</span>
      <span className="w-full md:w-1/2 text-center md:text-right py-2">Built with ☕ using React, TypeScript, and Tailwind CSS.</span>
    </footer>
  );
};

export default Footer;