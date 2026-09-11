import { prisma } from "@/database/index";

async function main() {
  await prisma.job.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();

  const user = (await prisma.user.findUnique({
    where: { email: "almeida@gmail.com" },
  }))!;

  const company = await prisma.company.create({
    data: {
      name: "Lucide Icons",
      cnpj: "11.222.333/4444-55",
      website: "lucide.icons.io",
      size: "GRANDE",
      createdBy: user.id,
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: company.id,
        createdBy: user.id,
        level: "JÚNIOR",
        modality: "REMOTO",
        title: "Desenvolvedor FullStack",
        type: "MEIO_PERÍODO",
        fixedSalary: 1800.5,
        id: "job1",
        description: "Vaga para Desenvolvedor FullStack Júnior Remoto.",
      },
      {
        companyId: company.id,
        createdBy: user.id,
        level: "PLENO",
        modality: "HÍBRIDO",
        title: "Designer UI/UX",
        type: "FREELANCER",
        fixedSalary: 5500.9,
        id: "job2",
        description: "Vaga para Designer UI/UX Pleno Híbrida.",
      },
      {
        companyId: company.id,
        createdBy: user.id,
        level: "ESTAGIÁRIO",
        modality: "PRESENCIAL",
        title: "Analista de dados",
        type: "INTEGRAL",
        fixedSalary: 1600.0,
        id: "job3",
        description: "Vaga para Analista de Dados Estagiário Presencial.",
      },
    ],
  });
}

main()
  .catch((err) => {
    console.log("Error: ", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
