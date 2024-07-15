import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import Item from "../../components/Item";

const Task = ({ id, parentId, children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id  
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <Item id={id} ref={setNodeRef} style={style} className='w-40 h-40 bg-amber-700 flex items-center justify-center text-white cursor-grab' {...attributes} {...listeners} {...props}>
        {children}
    </Item>
  )
}

export default Task