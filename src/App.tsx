import { useRef } from 'react';
import { scrollToRef } from './utils/scrollToRef';
import Header from './components/Header';
import Footer from './components/Footer';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
const App = () => {
  const bookRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToBook = () => {
    scrollToRef(bookRef);
  };
  
  return (
    <div className="w-full bg-white font-opensans">
      {/* Header */}
      <Header onScrollToBook={handleScrollToBook} />
      {/* Main */}
      <main>
        {/* Hero Section */}
        <div className="toothline-primary py-10 text-white">
          <div className="max-w-6xl mx-auto p-5 text-center h-96 flex items-center justify-center">
            <div className="my-auto">
              <h1 className="font-montserrat font-bold tracking-wide text-3xl md:text-5xl my-5">Your Smile, Our Priority</h1>
              <h2 className="md:text-lg my-10 md:w-2/3 px-3 md:px-0 mx-auto">Experience world-class dental care delivered by our dedicated team of specialists.</h2>
              <button type="button" onClick={() => scrollToRef(bookRef)} className="my-5 toothline-bg-light hover:toothline-accent px-5 py-2 rounded-md toothline-text-accent hover:text-white md:text-lg font-bold transition ease-in-out duration-300 transform hover:-translate-y-1 hover:shadow-lg">Book Your Visit</button>
            </div>
          </div>
        </div>
        {/* Dental Services */}
        <Services />
        {/* Booking Form */}
        <div ref={bookRef} className="toothline-bg-light py-10">
          <BookingForm />
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
