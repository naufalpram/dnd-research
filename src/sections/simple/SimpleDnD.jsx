import { DndContext } from "@dnd-kit/core"
import Droppable from "./components/Droppable.jsx"
import Draggable from "./components/Draggable.jsx"
import { useState } from "react"
import Item from "../components/Item.jsx"

const SimpleDnD = () => {
  const [parent, setParent] = useState(null);
  const [activeId, setActiveId]= useState(null);

  const draggable = <Draggable id='item-1' className='w-40 h-40 bg-amber-700 flex items-center justify-center text-white'>Drag me!</Draggable>;
  
    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

  function handleDragEnd(event) {
    const { over } = event;
    setParent(over ? over.id : null);
    setActiveId(null)
  }

  return (
    <div className="bg-slate-500 w-[500px] h-[640px] p-12 flex flex-col gap-28 items-center">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {parent === null ? draggable : <Item className='w-40 h-40 invisible'></Item>}
            <Droppable id='area-1' className='w-2/3 h-1/2 bg-gray-800 text-white flex flex-col gap-4 items-center justify-center'>
                {parent === 'area-1' && draggable}
                <h2 className={`${parent === 'area-1' ? 'text-gray-500':'text-white'} font-semibold`}>{parent === 'area-1' ? 'It\'s dropped' : 'Drop Here!'}</h2>
            </Droppable>
        </DndContext>
    </div>
  )
}

export default SimpleDnD