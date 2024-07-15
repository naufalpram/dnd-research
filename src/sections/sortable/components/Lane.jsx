import Task from './Task';

const Lane = ({ id, title, items }) => {

    return (
        <div className='bg-slate-800 p-4'>
            <h3 className='text-white font-bold'>{title}</h3>
            <div className='mt-2 flex flex-col gap-10'>
                {items.map((item, index) => {
                    return <Task key={item.id} id={item.id} index={index} parentId={id}>{item.label}</Task>
                })}
            </div>
        </div>
    )
}

export default Lane