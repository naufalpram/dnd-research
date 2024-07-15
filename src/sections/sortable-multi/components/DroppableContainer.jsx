import { useDroppable } from '@dnd-kit/core';
import Container from './Container';

const DroppableContainer = ({ id, items, children }) => {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
        type: 'container',
        children: items
    }
  });

  return (
    <Container id={id} title={id} ref={setNodeRef}>
        {children}
    </Container>
  )
}

export default DroppableContainer