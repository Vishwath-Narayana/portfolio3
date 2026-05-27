import { SmoothScroll } from './components/layout/SmoothScroll';
import { Atmosphere } from './components/ui/Atmosphere';
import { MagneticCursor } from './components/ui/MagneticCursor';
import { Hero } from './components/sections/Hero';
import { SelectedWork } from './components/sections/SelectedWork';
import { Philosophy } from './components/sections/Philosophy';
import { Capabilities } from './components/sections/Capabilities';
import { Infrastructure } from './components/sections/Infrastructure';
import { Evolution } from './components/sections/Evolution';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <SmoothScroll>
      <Atmosphere />
      <MagneticCursor />
      <main className="bg-primary-900 text-text-light min-h-screen selection:bg-accent selection:text-white">
        <Hero />
        <SelectedWork />
        <Philosophy />
        <Capabilities />
        <Infrastructure />
        <Evolution />
        <Contact />
      </main>
    </SmoothScroll>
  );
}

export default App;
