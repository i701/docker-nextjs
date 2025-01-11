import TodoForm from "@/components/todo-form";
import TodoItem from "@/components/todo-item";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await prisma.todo.findMany();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="border p-4 rounded-lg my-auto space-y-2">
        <h1 className="text-4xl font-bold">Todos man.</h1>
        <ol className="list-disc list-inside space-y-2">
          {todos?.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ol>
        <TodoForm />
      </main>

    </div>
  );
}
