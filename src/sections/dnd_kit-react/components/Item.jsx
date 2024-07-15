import {useSortable} from '@dnd-kit/react/sortable';

export function Item({id, index, column, children}) {
  const {ref} = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
    data: {
      column
    }
  });

  return (
    <button className='bg-white text-gray-500 px-3 py-5 border-none rounded-md cursor-grab' ref={ref}>
      {children}
    </button>
  );
}
