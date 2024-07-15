import { forwardRef } from 'react';
import Task from './Task';

const Container = forwardRef(({ id, title, children }, ref) => {

    return (
        <div className='bg-slate-800 p-4'>
            <h3 className='text-white font-bold'>{title}</h3>
            <div ref={ref} className='mt-2 flex flex-col gap-10'>
                {children}
            </div>
        </div>
    )
})

export default Container