import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities";
import Item from "../../components/Item";

const Draggable = ({ id, children, ...props }) => {
  const {attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform)
  } : undefined

  return (
    <Item id={id} ref={setNodeRef} style={style} {...attributes} {...listeners} {...props}>
        {children}
    </Item>
  )
}

export default Draggable