'use client'
import type { Todo } from '@prisma/client'
import { TrashIcon } from 'lucide-react'
import React from 'react'
import { deleteTodo } from '../actions/todo'

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div key={todo.id} className=" bg-gray-300 p-2 rounded-lg flex items-center justify-between gap-2">
      <li >{todo.title}</li>
      <TrashIcon onClick={() => deleteTodo(todo.id)} color="red" className="cursor-pointer" />
    </div>
  )
}
