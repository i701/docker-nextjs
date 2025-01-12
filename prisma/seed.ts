import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const todos = [
	{
		title: "Create a prisma project",
	},
	{
		title: "Add Prisma Client",
	},
	{
		title: "Add Prisma Migrate",
	},
	{
		title: "Run Prisma Migrate",
	},
];

async function main() {
	try {
		await prisma.todo.createMany({
			data: todos,
		});
	} catch (e) {
		console.error(e);
	}
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
