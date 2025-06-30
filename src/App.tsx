import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Organizers from './pages/Organizers';
import Contributors from './pages/Contributors';
import Channels from './pages/Channels';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/organizers" element={<Organizers />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/channels" element={<Channels />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
