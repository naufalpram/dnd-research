import { useEffect, useRef, useState } from 'react';
import {Column} from './components/Column';
import {Item} from './components/Item';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

const columnLabels = {
  new: 'New',
  onProgress: 'On Progress',
  closed: 'Closed',
}

export default function App() {
    const [items, setItems] = useState({
      new: [
        { id: '10001', label: '10001- Task 1' },
        { id: '10002', label: '10002- Task 2' },
        { id: '10003', label: '10003- Task 3' },
        { id: '10004', label: '10004- Task 4' },
        { id: '10005', label: '10005- Task 5' },
        { id: '10006', label: '10006- Task 6' },
        { id: '10007', label: '10007- Task 7' },
        { id: '10008', label: '10008- Task 8' },
      ],
      onProgress: [
        { id: '42445', label: '42445- Task 4' },
        { id: '42467', label: '42467 - Task 5' },
        { id: '42123', label: '42123 - Task 6' },
        { id: '20001', label: '20001- Task 1' },
        { id: '20002', label: '20002- Task 2' },
        { id: '20008', label: '20008- Task 8' },
      ],
      closed: [
        { id: '30001', label: '30001- Task 1' },
        { id: '30002', label: '30002- Task 2' },
      ],
    });
    const [columnOrder, setColumnOrder] = useState(Object.keys(items));
    const [callFetch, setCallFetch] = useState(false);
    
    const clonedItems = useRef(items);
  
    useEffect(() => {
        if (callFetch) {
            console.log('fetch called');
            setCallFetch(false)
        }
    }, [callFetch]);

    return (
      <DragDropProvider
        onDragStart={() => {
          clonedItems.current = items;
        }}
        onDragOver={(event) => {
          const {source, target} = event.operation;
          
          if (event.canceled) {
            setItems(clonedItems.current);
            return;
          }
          if (source?.type === 'column') return;
  
          setItems((items) => move(items, source, target));
        }}
        onDragEnd={(event) => {
          const {source, target} = event.operation;
          if (event.canceled) return;
          if (source.type === 'column') setColumnOrder((columns) => move(columns, source, target));
          else (source.type === 'item') && (items[source.data.column][source.index]?.id !== clonedItems.current[source.data.column][source.index]?.id) && setCallFetch(true);
        }}
      >
        <div className='inline-flex flex-row gap-5'>
          {columnOrder.map((column, columnIndex) => (
            <Column key={column} id={column} index={columnIndex} label={columnLabels[column]}>
              {items[column].map((item, index) => (
                <Item key={item.id} id={item.id} index={index} column={column}>{item.label}</Item>
              ))}
            </Column>
          ))}
        </div>
      </DragDropProvider>
    );
  }