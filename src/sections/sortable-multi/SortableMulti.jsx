import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, pointerWithin, rectIntersection, getFirstCollision } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import DroppableContainer from "./components/DroppableContainer.jsx";
import Task from "./components/Task.jsx";

const SortableMulti = () => {
  const [tasks, setTasks] = useState({
    newTask: [
        { id: '00', label: 'Task 1'},
        { id: '01', label: 'Task 2'},
        { id: '02', label: 'Task 3'},
    ],
    inProgress: [
        { id: '03', label: 'Task 4'},
        { id: '04', label: 'Task 5'},
        { id: '05', label: 'Task 6'},
    ],
    closed: [
        { id: '06', label: 'Task 7'},
        { id: '07', label: 'Task 8'},
        { id: '08', label: 'Task 9'},
    ]
  });
  const [containers] = useState(
    Object.keys(tasks) ?? []
  )
  const [activeId, setActiveId] = useState(null);
  const [clonedTasks, setClonedTasks] = useState(null);
  
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // function handleDragEnd(event) {
  //   const { active, over } = event;
  //   console.log(event);
  //   if (active.id !== over.id) {
  //     setNewTask((prevItems) => {
  //       const oldIndex = prevItems.findIndex((item) => item.id === active.id);
  //       const newIndex = prevItems.findIndex((item) => item.id === over.id);
  //       return arrayMove(prevItems, oldIndex, newIndex);
  //     })
  //   }
  // }
  // function handleDragOver (e) {
  //   const {active, over} = e;
  //   const parentId = active.data.current?.parentId;

  //   if(over.id === 'inprogress' || inProgress.some((task) => task.id === over.id) && !inProgress.some((task) => task.id === active.id)) {
  //     const getTask = parentId === 'new' ? newTask.find((task) => task.id === active.id) : closed.find((task) => task.id === active.id);
  //     setInProgress((prev) => [...prev, getTask]);
  //     setNewTask((prev) => prev.filter(item => item.id !== active.id));
  //   }

  //   if(over.id === 'new' || newTask.some((task) => task.id === over.id) && !newTask.some((task) => task.id === active.id)) {
  //     const getTask = parentId === 'inprogress' ? inProgress.find((task) => task.id === active.id) : closed.find((task) => task.id === active.id);
  //     setNewTask((prev) => [...prev, getTask]);
  //     setInProgress(inProgress.filter(item => item !== active.id));
  //   }
  // }
  
  // function handleDragEnd (e) {
  //     const {active, over} = e;
  //     const container = over.id;
  //     const title = active.data.current?.title ?? "";
  //     const index = active.data.current?.index ?? 0;
  //     const parent = active.data.current?.parent ?? "ToDo";
  // }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeId && activeId in tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in tasks
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId in tasks) {
          const containerItems = tasks[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, tasks]
  );

  const findContainer = (id) => {
    if (id in tasks) {
      return id;
    }

    return Object.keys(tasks).find((key) => tasks[key].some((task) => task.id === id));
  };

  function handleDragStart({ active }) {
    setActiveId(active.id);
    setClonedTasks(tasks)
  }

  function handleDragOver({ active, over }) {
    const overId = over?.id;

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setTasks((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex;

        if (overId in prev) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...prev,
          [activeContainer]: prev[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...prev[overContainer].slice(0, newIndex),
            prev[activeContainer][activeIndex],
            ...prev[overContainer].slice(newIndex, prev[overContainer].length),
          ],
        };
      });
    }
  }

  function handleDragEnd({ active, over }) {
    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = tasks[activeContainer].findIndex((task) => task.id === active.id);
      const overIndex = tasks[overContainer].findIndex((task) => task.id === overId);

      if (activeIndex !== overIndex) {
        setTasks((prev) => ({
          ...prev,
          [overContainer]: arrayMove(
            prev[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    if (clonedTasks) {
      setTasks(clonedTasks);
    }
    setActiveId(null);
    setClonedTasks(null);
  }

  return (
    <div className="bg-slate-500 p-12 flex gap-28 items-center">
        <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            {containers.map((id) => (
                <DroppableContainer key={id} id={id}>
                    <SortableContext
                        items={tasks[id]}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks[id].map((task) => {
                          return <Task key={task?.id} id={task?.id} parentId={id}>{task?.label}</Task>
                        })}
                    </SortableContext>
                </DroppableContainer>
            ))}
        </DndContext>
    </div>
  )
}

export default SortableMulti