import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	try {
		await prisma.todo.createMany({
			data: Array.from({ length: 10 }, () => ({
				title: faker.internet.domainName(),
			})),
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
