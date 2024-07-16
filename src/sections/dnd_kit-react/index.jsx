import { useEffect, useRef, useState } from 'react';
import {Column} from './components/Column';
import {Item} from './components/Item';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { DragOverlay } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import AddTaskModal from './components/AddTaskModal';

const columnLabels = {
  backlog: 'Backlog',
  new: 'New',
  onProgress: 'On Progress',
  closed: 'Closed',
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default function App() {
    const [items, setItems] = useState({
      backlog: [
        { id: '10001', label: '[FE] - Planning Cycle Listing - UI Development' },
        { id: '10002', label: '[FE] - Planning Cycle Listing - Integration' },
        { id: '10003', label: '[BE] - Auth Access Right + Create PO User' },
        { id: '10004', label: '[BE] - Check Data + Existing API & Inject Query' },
      ],
      new: [
        { id: '20001', label: '[BE] - Create Cycle PO' },
        { id: '20002', label: '[BE] - API List Participant' },
        { id: '20003', label: '[FE] - Input Target PO - UI Development' },
        { id: '20006', label: '[FE] - Input Target PO - Integration' },
        { id: '20007', label: '[QA] - Testing Form Proyeksi' },
        { id: '20008', label: '[QA] - Testing Form Kick Off' },
      ],
      onProgress: [
        { id: '42445', label: '[FE] - Modul Marketing Pt 2 - Integration' },
        { id: '42467', label: '[FE] - Modul Marketing - Target Projection' },
        { id: '42123', label: '[BE] - API Download Failed Data' },
        { id: '23501', label: '[QA] - Create Test Case' },
        { id: '20202', label: '[QA] - Testing Change Master COB' },
        { id: '20508', label: '[QA} - Testing' },
      ],
      closed: [
        { id: '30001', label: '[BE] - API Fetch Data Target' },
        { id: '30002', label: '[BE] - API Submit Data Target' },
      ],
    });
    const [columnOrder, setColumnOrder] = useState(Object.keys(items));
    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [callFetch, setCallFetch] = useState(false);
    const [showModal, setShodModal] = useState(false);
    
    const clonedItems = useRef(items);
  
    useEffect(() => {
        if (callFetch) {
            console.log('fetch called');
            setCallFetch(false)
        }
    }, [callFetch]);

    function handleDragStart(event) {
      clonedItems.current = items;

      const {source} = event.operation;
      if (source.type === 'column') {
        setActiveColumn(source.id);
        return;
      }
      if (source.type === 'item') {
        setActiveTask({
          id: source.id,
          column: source.data.column
        });
        return;
      }
      
    }

    function handleDragOver(event) {
      const {source, target} = event.operation;
          
      if (event.canceled) {
        setItems(clonedItems.current);
        return;
      }
      if (source?.type === 'column') return;

      setItems((items) => move(items, source, target));
    }

    function handleDragEnd(event) {
      const {source, target} = event.operation;
      if (event.canceled) return;
      if (source.type === 'column') setColumnOrder((columns) => move(columns, source, target));
      else (source.type === 'item') && (items[source.data.column][source.index]?.id !== clonedItems.current[source.data.column][source.index]?.id) && setCallFetch(true);
      setActiveColumn(null);
      setActiveTask(null);
    }

    const callModal = (type) => {
      setShodModal(true)
      if (type === 'backlog') {
        return <AddTaskModal type='backlog' onSubmit={handleAddTask} />
      }
      if (type === 'new') {
        return <AddTaskModal type='new' onSubmit={handleAddTask} />
      }
    }

    function handleAddTask(column) {
      setItems((prevItems) => ({
        ...prevItems,
        [column]: [
          ...prevItems[column],
          { id: generateId().toString(), label: `Task ${prevItems[column].length + 1}`}
        ]
      }))
    }

    return (
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className='inline-flex flex-row flex-wrap gap-8 p-12 rounded-2xl bg-[#161616]'>
          {columnOrder.map((column, columnIndex) => (
            <Column key={column} id={column} index={columnIndex} label={columnLabels[column]} length={items[column].length} addTaskAction={callModal}>
              {items[column].map((item, index) => (
                <Item key={item.id} id={item.id} index={index} column={column}>{item.label}</Item>
              ))}
            </Column>
          ))}
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column id={activeColumn} label={columnLabels[activeColumn]} length={items[activeColumn].length} >
                {items[activeColumn].map((item, index) => (
                  <Item key={item.id} id={item.id} index={index} column={activeColumn}>{item.label}</Item>
                ))}
              </Column>
            )}
            {activeTask && (
              <Item id={activeTask.id} column={activeTask.column}>{items[activeTask.column].find((task) => task.id === activeTask.id)?.label}</Item>
            )}
          </DragOverlay>,
          document.body
        )}
      </DragDropProvider>
    );
  }