import {useSortable} from '@dnd-kit/react/sortable';

export function Item({id, index, column, children}) {
  const {ref, status} = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
    data: {
      column
    }
  });

  if (status === 'dragging') {
    <div 
      className='bg-[#1f1f1f] text-gray-200 outline font-medium p-3 rounded-md cursor-grab w-52 text-start outline-1 outline-[#646464]'
      ref={ref}
    />
  }

  return (
    <div 
      className={`bg-[#1f1f1f] text-gray-200 outline font-medium p-3 border-none rounded-md cursor-grab w-52 text-start 
        ${status === 'dragging' ? 'outline-1 outline-[#646464]' : 'outline-2 outline-[#262626]'} focus:outline focus:outline-1 focus:outline-[#646464]`} 
      ref={ref}
    >
      {children}
    </div>
  );
}
