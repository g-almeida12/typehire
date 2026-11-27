import {
  CompanySize,
  JobType,
  JobLevel,
  JobModality,
  JobStatus,
  ApplicationStatus,
  Skill,
} from "../generated/client";
import { prisma } from "../index";

async function main() {
  console.log("🌱 Iniciando o seed pontual...");

  // 1. Busca o usuário existente pelo ID fornecido
  const targetUserId = "bHg5j3pkABH5tIOubdy7dpco4I1K43pO";

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user) {
    console.error(
      `❌ Erro: Usuário com ID "${targetUserId}" não foi encontrado no banco de dados.`,
    );
    console.error(
      "Certifique-se de que a conta já foi criada antes de rodar este script.",
    );
    process.exit(1);
  }

  console.log(`👤 Usuário encontrado: ${user.name ?? user.email}`);

  // 3. Cria uma vaga vinculada a essa nova empresa e criada pelo usuário
  const newJob = (await prisma.job.findUnique({
    where: { id: "cmwxwvtac0002rz30eivrgjcw" },
  }))!;

  console.log(`💼 Vaga criada: ${newJob.title} (ID: ${newJob.id})`);

  // 4. Cria novos candidatos (usando upsert para permitir reexecuções seguras)
  const candidatesData = [
    {
      id: "seed-candidate-lucas",
      name: "Lucas Ferreira",
      email: "lucas.ferreira@example.com",
      bio: "Desenvolvedor Full-Stack com 4 anos de experiência em React, Next.js e Node.js.",
      location: "Recife, PE",
      githubUrl: "https://github.com/lucasferreira-dev",
      linkedinUrl: "https://linkedin.com/in/lucas-ferreira-dev",
      skills: [Skill.TYPESCRIPT, Skill.REACT, Skill.NEXTJS, Skill.POSTGRESQL],
    },
    {
      id: "seed-candidate-camila",
      name: "Camila Rocha",
      email: "camila.rocha@example.com",
      bio: "Engenheira de Software apaixonada por interfaces acessíveis e arquitetura front-end.",
      location: "Olinda, PE",
      githubUrl: "https://github.com/camilarocha",
      skills: [Skill.TYPESCRIPT, Skill.REACT, Skill.TAILWINDCSS, Skill.FIGMA],
    },
    {
      id: "seed-candidate-rafael",
      name: "Rafael Costa",
      email: "rafael.costa@example.com",
      bio: "Desenvolvedor Backend migrando para Full-Stack, forte bagagem em bancos relacionais.",
      location: "Caruaru, PE",
      linkedinUrl: "https://linkedin.com/in/rafael-costa-dev",
      skills: [Skill.NODEJS, Skill.TYPESCRIPT, Skill.POSTGRESQL, Skill.DOCKER],
    },
    {
      id: "seed-candidate-beatriz",
      name: "Beatriz Santos",
      email: "beatriz.santos@example.com",
      bio: "Desenvolvedora Web Jr/Pleno focada no ecossistema JavaScript moderno.",
      location: "Jaboatão dos Guararapes, PE",
      githubUrl: "https://github.com/beatrizsantos",
      skills: [Skill.JAVASCRIPT, Skill.REACT, Skill.NEXTJS, Skill.TAILWINDCSS],
    },
  ];

  const createdCandidates = [];

  for (const candidate of candidatesData) {
    const upserted = await prisma.user.upsert({
      where: { email: candidate.email },
      update: {},
      create: {
        ...candidate,
        emailVerified: true,
      },
    });
    createdCandidates.push(upserted);
  }

  console.log(`👥 ${createdCandidates.length} novos candidatos prontos.`);

  // 5. Cria candidaturas dos novos usuários na vaga recém-criada
  await prisma.application.createMany({
    data: [
      {
        jobId: newJob.id,
        candidateId: createdCandidates[0].id, // Lucas -> INTERVIEW
        status: ApplicationStatus.INTERVIEW,
        feedback:
          "Ótimo domínio de Next.js e Prisma. Entrevista técnica agendada.",
        feedbackAt: new Date(),
      },
      {
        jobId: newJob.id,
        candidateId: createdCandidates[1].id, // Camila -> REVIEW
        status: ApplicationStatus.REVIEW,
        feedback: "Portfólio muito bem estruturado, em avaliação.",
        feedbackAt: new Date(),
      },
      {
        jobId: newJob.id,
        candidateId: createdCandidates[2].id, // Rafael -> PENDING
        status: ApplicationStatus.PENDING,
      },
      {
        jobId: newJob.id,
        candidateId: createdCandidates[3].id, // Beatriz -> REJECTED
        status: ApplicationStatus.REJECTED,
        feedback:
          "Buscamos um perfil com maior experiência prática em arquitetura back-end no momento.",
        feedbackAt: new Date(),
      },
    ],
  });

  console.log("📝 Candidaturas vinculadas à vaga com sucesso!");
  console.log("✅ Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
