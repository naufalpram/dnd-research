import { useState } from 'react';
import './App.css';
import SimpleDnD from './sections/simple/SimpleDnD.jsx';
import Sortable from './sections/sortable/Sortable.jsx';
import SortableMulti from './sections/sortable-multi/SortableMulti.jsx';
import ReactKit from './sections/dnd_kit-react';

function App() {
  const [selected, setSelected] = useState('react');

  return (
    <div className="App">
      <h1>Drag And Drop</h1>
      <menu className='flex gap-4'>
        <button className='bg-blue-950 text-white px-4 py-2 rounded' onClick={() => setSelected('simple')}>Simple DnD</button>
        <button className='bg-yellow-600 text-white px-4 py-2 rounded' onClick={() => setSelected('sortable')}>Sortable</button>
        <button className='bg-green-600 text-white px-4 py-2 rounded' onClick={() => setSelected('sortable-multi')}>Sortable Multi Container</button>
        <button className='bg-red-600 text-white px-4 py-2 rounded' onClick={() => setSelected('react')}>using @dnd-kit/react</button>
      </menu>

      <section>
        {selected === 'simple' && <SimpleDnD />}
        {selected === 'sortable' && <Sortable />}
        {selected === 'sortable-multi' && <SortableMulti />}
        {selected === 'react' && <ReactKit />}
      </section>
    </div>
  )
}

export default App
