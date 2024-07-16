import { useState } from 'react';
import './App.css';
import SimpleDnD from './sections/simple/SimpleDnD.jsx';
import Sortable from './sections/sortable/Sortable.jsx';
import SortableMulti from './sections/sortable-multi/SortableMulti.jsx';
import ReactKit from './sections/dnd_kit-react';
import Kanban from './sections/old-dnd-kanban';

function App() {
  const [selected, setSelected] = useState('react');

  return (
    <div className="App">
      <h1>Drag And Drop</h1>
      <menu className='flex gap-4'>
        <button className={`${selected === 'simple' ? 'bg-blue-950 text-white' : 'text-blue-950 outline outline-blue-900'} px-4 py-2 rounded`} onClick={() => setSelected('simple')}>Simple DnD</button>
        <button className={`${selected === 'sortable' ? 'bg-yellow-600 text-white' : 'text-yellow-600 outline outline-yellow-600'} px-4 py-2 rounded`} onClick={() => setSelected('sortable')}>Sortable</button>
        <button className={`${selected === 'sortable-multi' ? 'bg-green-600 text-white' : 'text-green-600 outline outline-green-600'} px-4 py-2 rounded`} onClick={() => setSelected('sortable-multi')}>Sortable Multi Container</button>
        <button className={`${selected === 'react' ? 'bg-red-600 text-white' : 'text-red-600 outline outline-red-600'} px-4 py-2 rounded`} onClick={() => setSelected('react')}>using @dnd-kit/react</button>
        <button className={`${selected === 'kanban' ? 'bg-purple-600 text-white' : 'text-purple-600 outline outline-purple-600'} px-4 py-2 rounded`} onClick={() => setSelected('kanban')}>Kanban - old dnd kit</button>
      </menu>

      <section className='mx-20'>
        {selected === 'simple' && <SimpleDnD />}
        {selected === 'sortable' && <Sortable />}
        {selected === 'sortable-multi' && <SortableMulti />}
        {selected === 'react' && <ReactKit />}
        {selected === 'kanban' && <Kanban />}
      </section>
    </div>
  )
}

export default App
