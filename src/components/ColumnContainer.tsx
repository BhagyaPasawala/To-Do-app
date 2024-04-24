import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id, Task } from "../types"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    tasks: Task[];
    updateTask: (id: Id, content: string) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props;

    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id)
    }, [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div 
            ref = {setNodeRef}
            style={style}
            className="bg-zinc-900 w-[350px] h-[500px] max-h-[500px]
            rounded-lg flex flex-col opacity-60 border-2 border-zinc-700 border-dashed"
            >   
            </div>;
    }

  return (
    <div
    ref = {setNodeRef}
    style={style}
    className="bg-zinc-900 w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col">

        {/* Column title */}
        <div
        {...attributes}
        {...listeners}
        onClick={() => {
            setEditMode(true);
        }}
        className="bg-zinc-900 hover:bg-zinc-800 duration-300 hover:border-green-500 flex items-center justify-between font-semibold text-md h-[60px] rounded-lg rounded-b-none cursor-grab text-center border-2 border-zinc-700 p-4">

            <div className="flex gap-3">

                {!editMode && column.title}
                {editMode && (
                    <input
                        className="bg-zinc-800 focus:border-zinc-700 border-2 rounded-md outline-none px-2 py-1"
                        value={column.title}
                        onChange={e => updateColumn(column.id, e.target.value)}
                        autoFocus onBlur={() => {
                        setEditMode(false);
                    }}
                    onKeyDown={e => {
                        if (e.key !== "Enter") return;
                        setEditMode(false);
                    }}
                /> 
                )}
                
            </div>
            <button onClick={() => (
                deleteColumn(column.id)
            )}
                className="stroke-zinc-700 hover:stroke-red-500 hover:animate-pulse duration-200">
                <DeleteIcon />
            </button>
        </div>

        {/* Column task */}
        <div className="flex flex-grow flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto">
            <SortableContext items={tasksIds}>
            {
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                ))}
            </SortableContext>
        </div>

        {/* Column footer */}
        <button 
                className="flex gap-4 items-center border-zinc-900 border-2 rounded-lg
                p-4 hover:border-green-500 duration-300 active:bg-zinc-800"
                onClick={() => {
                    createTask(column.id);
                }}
                >
            <PlusIcon />
            Add task
        </button>
    </div>
  )
}

export default ColumnContainer