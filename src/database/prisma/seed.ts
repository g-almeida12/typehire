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
  console.log("🌱 Iniciando o seed de vagas externas e candidaturas...");

  // 1. Busca o seu usuário (lulitogamepl) pelo ID fornecido
  const targetUserId = "bHg5j3pkABH5tIOubdy7dpco4I1K43pO";

  const mainUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!mainUser) {
    console.error(
      `❌ Erro: Usuário com ID "${targetUserId}" não foi encontrado no banco de dados.`,
    );
    process.exit(1);
  }

  console.log(`👤 Usuário alvo encontrado: ${mainUser.name ?? mainUser.email}`);

  // 2. Cria recrutadores externos (via upsert para reexecução segura)
  const recruiter1 = await prisma.user.upsert({
    where: { email: "recrutamento@cloudscale.com.br" },
    update: {},
    create: {
      id: "seed-ext-recruiter-1",
      name: "Mariana Vasconcelos",
      email: "recrutamento@cloudscale.com.br",
      emailVerified: true,
      bio: "Tech Recruiter na CloudScale Brasil.",
      location: "Recife, PE",
    },
  });

  const recruiter2 = await prisma.user.upsert({
    where: { email: "talentos@fintechpulse.io" },
    update: {},
    create: {
      id: "seed-ext-recruiter-2",
      name: "Rodrigo Almeida",
      email: "talentos@fintechpulse.io",
      emailVerified: true,
      bio: "Engineering Manager na FintechPulse.",
      location: "São Paulo, SP",
    },
  });

  // 3. Cria empresas externas
  const company1 = await prisma.company.upsert({
    where: { cnpj: "11222333000144" },
    update: {},
    create: {
      id: "seed-ext-company-1",
      name: "CloudScale Sistemas",
      cnpj: "11222333000144",
      website: "https://cloudscale.example.com",
      bio: "Consultoria especializada em arquitetura cloud e aplicações web modernas.",
      size: CompanySize.LARGE,
      createdBy: recruiter1.id,
      members: {
        create: {
          userId: recruiter1.id,
        },
      },
    },
  });

  const company2 = await prisma.company.upsert({
    where: { cnpj: "55666777000188" },
    update: {},
    create: {
      id: "seed-ext-company-2",
      name: "FintechPulse Pagamentos",
      cnpj: "55666777000188",
      website: "https://fintechpulse.example.com",
      bio: "Infraestrutura financeira de alta disponibilidade para e-commerces.",
      size: CompanySize.MEDIUM,
      createdBy: recruiter2.id,
      members: {
        create: {
          userId: recruiter2.id,
        },
      },
    },
  });

  console.log("🏢 Empresas externas criadas/verificadas.");

  // 4. Cria 5 novas vagas pertencentes aos recrutadores externos
  const externalJobsData = [
    {
      id: "seed-ext-job-1",
      title: "Desenvolvedor(a) Front-End React / Next.js",
      description:
        "Atuação no desenvolvimento de dashboards financeiros de alta performance com Next.js App Router, TypeScript e Tailwind CSS.",
      minSalary: 5500.0,
      maxSalary: 8000.0,
      type: JobType.FULL_TIME,
      level: JobLevel.MID,
      modality: JobModality.REMOTE,
      location: "Remoto (Brasil)",
      status: JobStatus.OPEN,
      skills: [Skill.TYPESCRIPT, Skill.REACT, Skill.NEXTJS, Skill.TAILWINDCSS],
      companyId: company2.id,
      createdBy: recruiter2.id,
    },
    {
      id: "seed-ext-job-2",
      title: "Engenheiro(a) de Software Full-Stack",
      description:
        "Construção de APIs RESTful escaláveis e interfaces reativas integradas com PostgreSQL e Prisma ORM.",
      fixedSalary: 7200.0,
      type: JobType.FULL_TIME,
      level: JobLevel.MID,
      modality: JobModality.HYBRID,
      location: "Recife, PE",
      status: JobStatus.OPEN,
      skills: [
        Skill.TYPESCRIPT,
        Skill.NODEJS,
        Skill.REACT,
        Skill.POSTGRESQL,
      ],
      companyId: company1.id,
      createdBy: recruiter1.id,
    },
    {
      id: "seed-ext-job-3",
      title: "Desenvolvedor(a) Back-End Node.js Júnior",
      description:
        "Vaga para integrar o time de microsserviços e integrações bancárias, trabalhando com Node.js, Docker e testes automatizados.",
      minSalary: 4000.0,
      maxSalary: 5200.0,
      type: JobType.FULL_TIME,
      level: JobLevel.JUNIOR,
      modality: JobModality.REMOTE,
      location: "Remoto",
      status: JobStatus.OPEN,
      skills: [Skill.NODEJS, Skill.TYPESCRIPT, Skill.DOCKER, Skill.POSTGRESQL],
      companyId: company2.id,
      createdBy: recruiter2.id,
    },
    {
      id: "seed-ext-job-4",
      title: "Desenvolvedor(a) Web Full-Stack (Projeto Temporário)",
      description:
        "Desenvolvimento de portal institucional e área do cliente sob demanda com foco em SEO e Core Web Vitals.",
      hourlySalary: 65.0,
      type: JobType.FULL_TIME,
      level: JobLevel.MID,
      modality: JobModality.REMOTE,
      location: "Remoto",
      status: JobStatus.OPEN,
      skills: [Skill.NEXTJS, Skill.TYPESCRIPT, Skill.TAILWINDCSS],
      companyId: company1.id,
      createdBy: recruiter1.id,
    },
    {
      id: "seed-ext-job-5",
      title: "Engenheiro(a) de Interface & Design Systems",
      description:
        "Criação e manutenção da biblioteca de componentes acessíveis da empresa.",
      minSalary: 8500.0,
      maxSalary: 11000.0,
      type: JobType.FULL_TIME,
      level: JobLevel.SENIOR,
      modality: JobModality.ON_SITE,
      location: "São Paulo, SP",
      status: JobStatus.CLOSED,
      skills: [Skill.REACT, Skill.TYPESCRIPT, Skill.FIGMA, Skill.TAILWINDCSS],
      companyId: company2.id,
      createdBy: recruiter2.id,
    },
  ];

  for (const job of externalJobsData) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: job,
    });
  }

  console.log(`💼 ${externalJobsData.length} vagas externas prontas.`);

  // 5. Remove candidaturas antigas do usuário nessas vagas de seed (evita duplicidade ao reexecutar)
  await prisma.application.deleteMany({
    where: {
      candidateId: mainUser.id,
      jobId: { in: externalJobsData.map((j) => j.id) },
    },
  });

  // 6. Cria as candidaturas do seu usuário com todos os status variados
  await prisma.application.createMany({
    data: [
      {
        jobId: "seed-ext-job-1",
        candidateId: mainUser.id,
        status: ApplicationStatus.INTERVIEW,
        feedback:
          "Gostamos muito da arquitetura dos seus projetos em Next.js. Enviamos o link para a entrevista técnica por e-mail.",
        feedbackAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      },
      {
        jobId: "seed-ext-job-2",
        candidateId: mainUser.id,
        status: ApplicationStatus.REVIEW,
        feedback: "Perfil técnico em análise pela liderança de engenharia.",
        feedbackAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
      },
      {
        jobId: "seed-ext-job-3",
        candidateId: mainUser.id,
        status: ApplicationStatus.PENDING,
      },
      {
        jobId: "seed-ext-job-4",
        candidateId: mainUser.id,
        status: ApplicationStatus.HIRED,
        feedback:
          "Parabéns! Você foi selecionado para o projeto. Nossa equipe de RH entrará em contato para formalizar o contrato.",
        feedbackAt: new Date(),
      },
      {
        jobId: "seed-ext-job-5",
        candidateId: mainUser.id,
        status: ApplicationStatus.REJECTED,
        feedback:
          "Agradecemos o interesse, mas optamos por seguir com candidatos residentes em São Paulo devido ao modelo presencial.",
        feedbackAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 dias atrás
      },
    ],
  });

  console.log(
    "📝 Candidaturas criadas para o seu usuário em todos os status (PENDING, REVIEW, INTERVIEW, ACCEPTED, REJECTED)!",
  );
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