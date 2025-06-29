import logo from './assets/logo-v1.png';
function App() {
  return (
    <div className="w-full toothline-secondary p-5">
      {/* Header */}
      <header className="max-w-6xl flex flex-wrap mx-auto">
        <div className="w-1/2">
          <img src={logo} className='w-40' />
        </div>
        <div className="w-1/2 text-right my-auto">
          <button type="button" className="font-opensans font-bold toothline-accent hover:toothline-accent-hover text-white px-3 py-2 rounded-md text-sm transition ease-in-out duration-300">Book Appointment</button>
        </div>
      </header>
      {/* Main */}
      {/* Footer */}
    </div>
  );
}

export default App;
