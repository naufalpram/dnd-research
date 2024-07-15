import {CollisionPriority} from '@dnd-kit/abstract';
import {useSortable} from '@dnd-kit/react/sortable';
import { MdDragIndicator } from 'react-icons/md';

export function Column({children, id, index, label}) {
  const {ref, handleRef} = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: ['item', 'column'],
  });

  return (
    <div className='bg-gray-300 rounded-lg cursor-default' style={{ boxShadow: 'rgba(112, 114, 125, 0.4) 0px 1px 4px' }} ref={ref}>
      <div className='w-full h-16 flex justify-between items-center px-4 py-2 bg-white cursor-auto' >
        <h4>{label}</h4>
        <div ref={handleRef} className='cursor-grab'>
          <MdDragIndicator size={20} />
        </div>
      </div>
      <div className='flex flex-col gap-8 p-5 min-w-52'>
        {children}
      </div>
    </div>
  );
}