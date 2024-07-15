import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import Lane from "./components/Lane.jsx";

const Sortable = () => {
  const [newTask, setNewTask] = useState([
    { id: '00', label: 'Task 1'},
    { id: '01', label: 'Task 2'},
    { id: '02', label: 'Task 3'},
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(event);
    if (active.id !== over.id) {
      setNewTask((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      })
    }
  }

  return (
    <div className="bg-slate-500 p-12 flex gap-28 items-center">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={newTask}
            strategy={verticalListSortingStrategy}
          >
              <Lane id='new' title='New' items={newTask} />
          </SortableContext>
        </DndContext>
    </div>
  )
}

export default Sortable