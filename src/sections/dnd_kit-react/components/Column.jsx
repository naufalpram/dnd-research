import {CollisionPriority} from '@dnd-kit/abstract';
import {useSortable} from '@dnd-kit/react/sortable';
import { IoMdAdd } from 'react-icons/io';
import { MdDeleteOutline, MdDragIndicator } from 'react-icons/md';

const AddTask = ({ clickAction = () => {} }) => {
  return (
    <button className="bg-transparent text-[#646464] font-medium hover:text-white transition-colors" onClick={clickAction}>Add Task +</button>
  )
}

export default AddTask
export function Column({children, id, index, label, length, accepts = ['item', 'column'], disabled, addTaskAction}) {
  const {ref, handleRef} = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: accepts,
  });

  const titleColor = () => {
    switch (id) {
      case 'new':
        return 'text-[#dcdd9e]';
      case 'onProgress':
        return 'text-[#99a4ae]';
      case 'closed':
        return 'text-[#a3d4c0]';
      default:
        return undefined;
    }
  }

  return (
    <div className='bg-[#161616] relative cursor-default min-w-72 rounded-xl' style={{ boxShadow: 'rgba(112, 114, 125, 0.4) 0px 1px 4px' }} ref={ref}>
      <div className='w-full h-16 flex justify-between items-center px-4 py-2 cursor-auto text-[#646464] font-semibold' >
        <div className='flex gap-2 items-center'>
          <div className='bg-[#1f1f1f] text-gray-200 w-8 h-8 flex items-center justify-center rounded'>{length}</div>
          <h4 className={`font-semibold ${titleColor()}`}>{label}</h4>
          <IoMdAdd size={20} color='white' className='cursor-pointer' onClick={() => addTaskAction(id)} />
        </div>
        {!disabled && (
          <div className='flex gap-2'>
            <div className='hover:bg-red-500 hover:text-white hover:rounded transition-colors cursor-pointer'>
              <MdDeleteOutline size={20} />
            </div>
            <div ref={handleRef} className='cursor-grab'>
              <MdDragIndicator size={20} />
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center gap-8 p-5 min-w-52 max-h-96 overflow-x-auto'>
        {children}
      </div>
    </div>
  );
}