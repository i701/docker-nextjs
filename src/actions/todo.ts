"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

type currentState = {
	message: string;
};

export default async function addTodo(
	_prevState: currentState,
	formData: FormData,
): Promise<currentState> {
	const title = formData.get("title") as string;
	if (!title)
		return {
			message: "title is required",
		};

	const todo = await prisma.todo.create({
		data: {
			title: title,
		},
	});

	revalidatePath("/");
	return {
		message: `success ${todo.id}`,
	};
}

export async function deleteTodo(id: number) {
	await prisma.todo.delete({
		where: {
			id: id,
		},
	});
	revalidatePath("/");
}
