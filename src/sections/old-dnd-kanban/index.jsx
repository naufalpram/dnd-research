import { useEffect, useMemo, useState } from "react";
import ColumnContainer from "./components/ColumnContainer";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./components/TaskCard";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const defaultCols = [
  {
    id: "todo",
    title: "New",
  },
  {
    id: "doing",
    title: "In progress",
  },
  {
    id: "done",
    title: "Closed",
  },
];

const defaultTasks = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];

function KanbanBoard() {
  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState(defaultTasks);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const [callFetch, setCallFetch] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (callFetch) {
      console.log('fetch called', tasks);
      setCallFetch(false)
    }
  }, [callFetch]);

  return (
    <div className="flex mx-8 items-center">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <div className="text-white bg-[#161616] p-8 rounded-2xl">
          <div className="flex gap-8 flex-wrap">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
            <button
              onClick={() => {
                createNewColumn();
              }}
              className="
                h-[60px]
                w-[350px]
                min-w-[350px]
                cursor-pointer
                rounded-lg
                bg-mainBackgroundColor
                border-2
                border-columnBackgroundColor
                p-4
                ring-blue-500
                hover:ring-2
                flex
                gap-2
              "
            >
              + Add Column
            </button>
          </div>
        </div>

        {createPortal(
          <DragOverlay modifiers={[restrictToWindowEdges]}>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks((prev) => [...prev, newTask]);
    setCallFetch(true);
  }
  
  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    setCallFetch(true);
  }
  
  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    
    setTasks(newTasks);
    setCallFetch(true);
  }
  
  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    
    setColumns([...columns, columnToAdd]);
    setCallFetch(true);
  }
  
  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
    setCallFetch(true);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    
    if (event.active.data.current?.type === "Task") {
      console.log(event.active.data.current.task);
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    
    const { active, over } = event;
    if (!over) return;
    console.log(active.data.current.index);
    console.log(tasks.findIndex((task) => task.id === active.id ));
    setActiveTask(null);
    const isActiveATask = active.data.current?.type === "Task";
    if (isActiveATask) {
      setCallFetch(true);
      return;
    }
    
    const activeId = active.id;
    const overId = over.id;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
    
    
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001).toString();
}

export default KanbanBoard;