import { useState } from "react"
import { createPortal } from "react-dom"

const AddTaskModal = ({ type, onSubmit }) => {
  const [content, setContent] = useState(null);
  return (
    createPortal(
        <div className="w-full h-full fixed z-10 flex justify-center items-center " style={{ backgroundColor: 'rgb(0,0,0, 0.3)' }}>
            <div className="w-1/4 h-1/4 p-5">
                <h2>Add Task</h2>
                <input type="text" name="content" className="mt-4" value={content} onChange={(e) => setContent(e.target.value)} />
                <button type="submit" className="mt-4" onClick={() => onSubmit(type, content)}>Submit</button>
            </div>
        </div>,
        document.body
    )
  )
}

export default AddTaskModal