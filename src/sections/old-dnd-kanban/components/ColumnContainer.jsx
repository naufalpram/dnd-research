import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { MdDeleteOutline } from "react-icons/md";

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    boxShadow: 'rgba(112, 114, 125, 0.5) 0px 1px 4px'
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 border-2 border-gray-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-[#161616] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      {/* Column title */}
      <div {...attributes} {...listeners} onClick={() => setEditMode(true)} className=" text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-semibold flex items-center justify-between">
        <div className="flex gap-2 text-white">
          <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-gray-200 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <MdDeleteOutline size={20} color="white" />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 px-2 pt-2 pb-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex text-white gap-2 items-center rounded-md p-4 outline outline-1 outline-[#646464] hover:bg-mainBackgroundColor hover:text-blue-500 active:bg-black z-10"
        // style={{ boxShadow: 'rgba(112, 114, 125, 0.5) 0px 1px 4px' }}
        onClick={() => createTask(column.id)}
      >
        + Add task
      </button>
    </div>
  );
}

export default ColumnContainer;