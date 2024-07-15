import { forwardRef } from 'react'

const Item = forwardRef(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
        {children}
    </div>
  )
});

export default Item