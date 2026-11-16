import "server-only";
import { prisma } from "@/database/index";

async function deleteAll() {
  await prisma.user.deleteMany();
}
deleteAll()
  .catch((err) => {
    console.error("Error: ", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
