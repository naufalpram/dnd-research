import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline } from "react-icons/md";

function TaskCard({ task, index, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      index,
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 opacity-30bg-[#1f1f1f] text-gray-200 items-center flex text-left rounded-xl border-2 border-gray-200 cursor-grab relative">
          <div className="min-h-[100px]" />
        </div>
    );
  }

  if (editMode) {
    return (
      <div className="relative" ref={setNodeRef} style={style}>
        <div
          className="bg-[#1f1f1f] text-gray-200 p-4 flex text-left rounded-xl cursor-grab relative"
        >
          <textarea
            className="overflow-x-hidden min-h-[100px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
            value={task.content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
            onChange={(e) => updateTask(task.id, e.target.value)}
          />
        </div>
        <div 
          // Optional ref
          ref={setActivatorNodeRef} 
          className="absolute bottom-2 left-10 w-3/4 h-1 bg-gray-200 opacity-90 rounded cursor-grab transition-opacity" {...attributes} {...listeners}
        />
      </div>
    );
  }

  return (
    <button className="relative cursor-default" ref={setNodeRef} style={style}>
      <div
        onClick={toggleEditMode}
        className="bg-[#1f1f1f] text-gray-200 p-4 flex text-left rounded-xl outline outline-2 outline-[#262626] relative"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <div className="text-left min-h-[100px] overflow-x-hidden w-10/12 whitespace-pre-wrap">
          {task.content}
        </div>

        {mouseIsOver && (
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
          >
            <MdDeleteOutline size={20} />
          </button>
        )}
      </div>
      {/* Drag Handle */}
      {/* set touch action: none, in order to allow scrolling sortable but prevent scroll when initiating drag action in touch mode */}
      <div 
        // Optional ref
        ref={setActivatorNodeRef} 
        className="absolute bottom-2 left-10 w-3/4 h-1 bg-gray-200 opacity-30 hover:opacity-90 rounded cursor-grab transition-opacity touch-none" {...attributes} {...listeners}
      />
    </button>
  );
}

export default TaskCard;