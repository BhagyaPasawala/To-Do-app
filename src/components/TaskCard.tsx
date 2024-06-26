import { useState } from "react";
import DeleteTasks from "../icons/DeleteTasks";
import { Id, Task } from "../types"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Props {
    task: Task;
    deleteTask: (id:Id) => void;
    updateTask: (id:Id, content: string) => void;
}

function TaskCard({task, deleteTask, updateTask}: Props) {

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
        type: "Task",
        task,
    },
    disabled: editMode,
});

const style = {
  transition,
  transform: CSS.Transform.toString(transform),
}

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false); 
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef} style={style}
        className="bg-zinc-800 p-2.5 pl-4 h-[70px] min-h-[70px] items-center
        flex text-left rounded-lg border-2 border-zinc-700 hover:border-zinc-600 cursor-grab relative opacity-50 border-dashed"
      />
    );
  }

  if (editMode) {
    return (
    <div 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className="bg-zinc-800 p-2.5 pl-4 h-[70px] min-h-[70px] items-center
              flex text-left rounded-lg border-2 border-zinc-800 hover:border-zinc-600 cursor-grab relative"
              >

  <textarea className="
    h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none 
  "
  value={task.content}
  autoFocus
  placeholder="Task content here"
  onBlur={toggleEditMode}
  onKeyDown={e => {
    if (e.key === "Enter" && e.shiftKey) {
      toggleEditMode();
    }
  }}

  onChange={e => updateTask(task.id, e.target.value)}

  >
  </textarea>
  </div>
    )
  }

  return (
    <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={toggleEditMode} 
          className="bg-zinc-800 p-2.5 pl-4 h-[70px] min-h-[70px] items-center
                    flex text-left rounded-lg border-2 border-zinc-800 hover:border-zinc-600 cursor-grab relative"
                    onMouseEnter={() => {
                      setMouseIsOver(true);
                    }}
                    onMouseLeave={() => {
                      setMouseIsOver(false);
                    }}
                    >
        <p
          className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}              
        </p>

        {mouseIsOver && (
            <button
                onClick={() => {
                  deleteTask(task.id);
            }} 
              className="absolute right-4 opacity-60 hover:opacity-100">
              <DeleteTasks />
            </button>
        )}
    </div>
  )
}

export default TaskCard