'use client'
import { useActionState } from 'react';
import addTodo from '../actions/todo';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function TodoForm() {
  const [actionState, action, isPending] = useActionState(
    addTodo,
    {
      message: '',
    }
  );
  console.log(actionState);
  return (
    <form action={action} className='space-y-2'>
      <Input placeholder='lay ur fucking todo on me homie' type="text" name="title" />
      <Button disabled={isPending} type="submit">ADD THIS FUCKING TODO HOMIE</Button>
    </form>
  )
}
