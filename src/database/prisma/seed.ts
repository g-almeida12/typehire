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
  console.log("🌱 Iniciando o seed do banco de dados...");

  // Limpa dados existentes na ordem correta para evitar erros de FK
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Dados antigos limpos.");

  // ==========================================
  // 1. CRIANDO USUÁRIOS (Recrutadores e Candidatos)
  // ==========================================

  const recruter1 = await prisma.user.create({
    data: {
      id: "user-recruiter-1",
      name: "Ana Souza (Recrutadora)",
      email: "ana.souza@techcorp.com",
      emailVerified: true,
      bio: "Head de Talentos na TechCorp Brasil. Sempre em busca de novos talentos.",
      location: "Recife, PE",
      phoneNumber: "+55 81 99999-1111",
      githubUrl: "https://github.com/anasouza",
      linkedinUrl: "https://linkedin.com/in/ana-souza",
    },
  });

  const recruter2 = await prisma.user.create({
    data: {
      id: "user-recruiter-2",
      name: "Carlos Mendes (CTO)",
      email: "carlos@devstudio.io",
      emailVerified: true,
      bio: "Fundador e CTO na DevStudio. Apaixonado por arquitetura limpa e open-source.",
      location: "São Paulo, SP",
    },
  });

  const candidate1 = await prisma.user.create({
    data: {
      id: "user-candidate-1",
      name: "Gabriel Almeida",
      email: "gabriel@email.com",
      emailVerified: true,
      bio: "Desenvolvedor Full-Stack focado em ecossistema JavaScript/TypeScript, React e Next.js.",
      location: "Vitória de Santo Antão, PE",
      githubUrl: "https://github.com/g-almeida12",
      linkedinUrl: "https://linkedin.com/in/gabriel-almeida17",
      skills: [
        Skill.TYPESCRIPT,
        Skill.REACT,
        Skill.NEXTJS,
        Skill.NODEJS,
        Skill.POSTGRESQL,
        Skill.TAILWINDCSS,
      ],
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      id: "user-candidate-2",
      name: "Mariana Lima",
      email: "mariana.lima@email.com",
      emailVerified: true,
      bio: "Engenheira de Software Frontend com sólida experiência em UI/UX e design systems.",
      location: "Recife, PE",
      skills: [Skill.REACT, Skill.TYPESCRIPT, Skill.FIGMA, Skill.TAILWINDCSS],
    },
  });

  console.log("👥 Usuários criados com sucesso.");

  // ==========================================
  // 2. CRIANDO EMPRESAS E MEMBROS
  // ==========================================

  const techCorp = await prisma.company.create({
    data: {
      name: "TechCorp Solutions",
      cnpj: "12345678000199",
      website: "https://techcorp.example.com",
      bio: "Empresa líder em soluções de nuvem e inteligência de dados para o mercado financeiro.",
      size: CompanySize.LARGE,
      createdBy: recruter1.id,
      members: {
        create: {
          userId: recruter1.id,
        },
      },
    },
  });

  const devStudio = await prisma.company.create({
    data: {
      name: "DevStudio Inovação",
      cnpj: "98765432000188",
      website: "https://devstudio.io",
      bio: "Software house focada em criar produtos digitais inovadores para startups globais.",
      size: CompanySize.MEDIUM,
      createdBy: recruter2.id,
      members: {
        create: {
          userId: recruter2.id,
        },
      },
    },
  });

  console.log("🏢 Empresas criadas.");

  // ==========================================
  // 3. CRIANDO VAGAS (JOBS) COM DIFERENTES FILTROS
  // ==========================================

  const job1 = await prisma.job.create({
    data: {
      title: "Desenvolvedor(a) Front-End React/Next.js Sênior",
      description:
        "Buscamos um(a) desenvolvedor(a) Front-End sênior para liderar a arquitetura de interfaces de nossos produtos corporativos. Necessária forte experiência com Next.js, TypeScript e Design Systems.",
      minSalary: 8000.0,
      maxSalary: 12000.0,
      type: JobType.FULL_TIME,
      level: JobLevel.SENIOR,
      modality: JobModality.REMOTE,
      location: "Remoto (Brasil)",
      status: JobStatus.OPEN,
      skills: [Skill.TYPESCRIPT, Skill.REACT, Skill.NEXTJS, Skill.TAILWINDCSS],
      companyId: techCorp.id,
      createdBy: recruter1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Engenheiro(a) Backend Node.js / TypeScript",
      description:
        "Iremos expandir nossa camada de microsserviços. Procuramos alguém que domine Node.js, arquitetura limpa, PostgreSQL e mensageria (RabbitMQ ou Kafka).",
      fixedSalary: 9500.0,
      type: JobType.FULL_TIME,
      level: JobLevel.MID,
      modality: JobModality.HYBRID,
      location: "Recife, PE",
      status: JobStatus.OPEN,
      skills: [
        Skill.NODEJS,
        Skill.TYPESCRIPT,
        Skill.POSTGRESQL,
        Skill.DOCKER,
        Skill.MICROSERVICES,
      ],
      companyId: techCorp.id,
      createdBy: recruter1.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "Desenvolvedor(a) Full-Stack Pleno (React & Node)",
      description:
        "Vaga para atuar em projetos dinâmicos para clientes internacionais. Stack moderna baseada em TypeScript, React, Node.js e MongoDB.",
      minSalary: 6000.0,
      maxSalary: 8500.0,
      type: JobType.FULL_TIME,
      level: JobLevel.MID,
      modality: JobModality.REMOTE,
      location: "Remoto",
      status: JobStatus.OPEN,
      skills: [Skill.TYPESCRIPT, Skill.REACT, Skill.NODEJS, Skill.MONGODB],
      companyId: devStudio.id,
      createdBy: recruter2.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: "Estágio em Desenvolvimento Web",
      description:
        "Oportunidade de estágio para estudantes de Ciência da Computação ou áreas afins. Você vai aprender na prática com mentoria sênior trabalhando com HTML, CSS, JavaScript e React.",
      hourlySalary: 45.0, // Exemplo por hora
      type: JobType.PART_TIME,
      level: JobLevel.INTERN,
      modality: JobModality.ON_SITE,
      location: "São Paulo, SP",
      status: JobStatus.OPEN,
      skills: [Skill.JAVASCRIPT, Skill.REACT, Skill.HTML, Skill.CSS],
      companyId: devStudio.id,
      createdBy: recruter2.id,
    },
  });

  console.log("💼 Vagas criadas.");

  // ==========================================
  // 4. CRIANDO CANDIDATURAS (APPLICATIONS)
  // ==========================================

  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidate1.id,
      status: ApplicationStatus.REVIEW,
      feedback:
        "Currículo muito bom, portfólio bem estruturado. Aguardando agendamento de entrevista técnica.",
      feedbackAt: new Date(),
    },
  });

  await prisma.application.create({
    data: {
      jobId: job3.id,
      candidateId: candidate1.id,
      status: ApplicationStatus.PENDING,
    },
  });

  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidate2.id,
      status: ApplicationStatus.INTERVIEW,
      feedback: "Excelente domínio de design systems e componentização.",
      feedbackAt: new Date(),
    },
  });

  console.log("📝 Candidaturas criadas.");
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
