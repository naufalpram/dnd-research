import { useDroppable } from "@dnd-kit/core"

const Droppable = ({ id, children, ...props }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id
  });

  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div id={id} ref={setNodeRef} style={style} {...props}>
        {children}
    </div>
  )
}

export default Droppable