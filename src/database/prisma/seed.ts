import { prisma } from "@/database/index";

async function main() {
  await prisma.job.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.company.deleteMany();
  await prisma.application.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "user123",
        name: "João Carlos",
        email: "joaocarlos@gmail.com",
      },
      {
        id: "user124",
        name: "Julia Silva",
        email: "juliasilva@gmail.com",
      },
      {
        id: "user125",
        name: "Juliana Costa",
        email: "julianacosta@gmail.com",
      },
      {
        id: "user126",
        name: "Gabriel Souza",
        email: "gabrielsouza@gmail.com",
      },
      {
        id: "user127",
        name: "Gabriela Santos",
        email: "gabrielasantos@gmail.com",
      },
      {
        id: "user128",
        name: "Carlos Eduardo",
        email: "carloseduardo@gmail.com",
      },
      {
        id: "user129",
        name: "Camila Rodrigues",
        email: "camilarodrigues@gmail.com",
      },
      {
        id: "user130",
        name: "Lucas Oliveira",
        email: "lucasoliveira@gmail.com",
      },
    ],
    skipDuplicates: true,
  });

  const user = (await prisma.user.findUnique({
    where: { email: "almeida@gmail.com" },
  }))!;

  // Empresa 1: Lucide Icons
  const company1 = await prisma.company.create({
    data: {
      name: "Lucide Icons",
      cnpj: "11.222.333/4444-55",
      website: "lucide.icons.io",
      size: "GRANDE",
      createdBy: user.id,
      members: {
        create: {
          userId: user.id,
        },
      },
      bio: `
A Lucide Icons é uma organização dedicada a impulsionar a experiência visual de desenvolvedores e designers em todo o mundo através de bibliotecas de ícones modernos, leves e altamente personalizáveis.
      `.trim(),
    },
  });

  // Empresa 2: CodeCraft Solutions
  const userJulia = (await prisma.user.findUnique({
    where: { email: "juliasilva@gmail.com" },
  }))!;

  const company2 = await prisma.company.create({
    data: {
      name: "CodeCraft Solutions",
      cnpj: "22.333.444/0001-99",
      website: "codecraft.dev",
      size: "MÉDIA",
      createdBy: userJulia.id,
      members: {
        create: [
          { userId: userJulia.id },
          { userId: "user125" },
          { userId: user.id },
        ],
      },
      bio: `
A CodeCraft Solutions é uma empresa inovadora especializada em arquitetura de microsserviços, soluções em nuvem e desenvolvimento de softwares sob medida.
      `.trim(),
    },
  });

  // Empresa 3: Nexus Tech Innovations
  const userGabriel = (await prisma.user.findUnique({
    where: { email: "gabrielsouza@gmail.com" },
  }))!;

  const company3 = await prisma.company.create({
    data: {
      name: "Nexus Tech Innovations",
      cnpj: "33.444.555/0001-88",
      website: "nexustech.io",
      size: "PEQUENA",
      createdBy: userGabriel.id,
      members: {
        create: [
          { userId: userGabriel.id },
          { userId: "user127" },
          { userId: "user130" },
        ],
      },
      bio: `
A Nexus Tech Innovations é uma startup de tecnologia focada em inteligência artificial aplicada, ciência de dados e desenvolvimento mobile/web.
      `.trim(),
    },
  });

  // Lista massiva de vagas para teste de rolagem infinita
  await prisma.job.createMany({
    data: [
      {
        id: "job1",
        companyId: company1.id,
        createdBy: user.id,
        level: "JÚNIOR",
        modality: "REMOTO",
        title: "Desenvolvedor FullStack",
        type: "MEIO_PERÍODO",
        fixedSalary: 1800.5,
        description: "Desenvolvimento fullstack com Python, FastAPI e PostgreSQL.",
        skills: ["ANGULAR", "ARCHITECTURE", "POSTGRESQL", "PYTHON", "FASTAPI", "CSS", "HTML"],
      },
      {
        id: "job2",
        companyId: company1.id,
        createdBy: user.id,
        level: "PLENO",
        modality: "HÍBRIDO",
        title: "Designer UI/UX",
        location: "Recife, PE",
        type: "FREELANCER",
        hourlySalary: 100.0,
        description: "Criação de wireframes e protótipos de alta fidelidade no Figma.",
        skills: ["FIGMA", "HTML", "CSS", "JIRA", "NETLIFY"],
      },
      {
        id: "job3",
        companyId: company1.id,
        createdBy: user.id,
        level: "ESTAGIÁRIO",
        modality: "PRESENCIAL",
        location: "São Paulo, SP",
        title: "Analista de dados",
        type: "INTEGRAL",
        minSalary: 1600.0,
        maxSalary: 2200.0,
        description: "Apoio em pipelines de dados e automações em Python.",
        skills: ["PYTEST", "PYTHON", "ARCHITECTURE", "AWS"],
      },
      {
        id: "job4",
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "SÊNIOR",
        modality: "REMOTO",
        title: "Arquiteto de Software Cloud",
        type: "INTEGRAL",
        minSalary: 12000.0,
        maxSalary: 16000.0,
        description: "Desenho de arquiteturas serverless e containers na AWS.",
        skills: ["AWS", "DOCKER", "KUBERNETES", "ARCHITECTURE", "TYPESCRIPT"],
      },
      {
        id: "job5",
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "PLENO",
        modality: "REMOTO",
        title: "Desenvolvedor Backend Node.js",
        type: "INTEGRAL",
        minSalary: 6000.0,
        maxSalary: 8500.0,
        description: "Construção de APIs RESTful e serviços assíncronos.",
        skills: ["POSTGRESQL", "TYPESCRIPT", "DOCKER", "JEST"],
      },
      {
        id: "job6",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "SÊNIOR",
        modality: "HÍBRIDO",
        location: "Florianópolis, SC",
        title: "Engenheiro de Machine Learning",
        type: "INTEGRAL",
        minSalary: 10000.0,
        maxSalary: 14000.0,
        description: "Criação de pipelines preditivos e modelos generativos.",
        skills: ["PYTHON", "AWS", "DOCKER", "POSTGRESQL"],
      },
      {
        id: "job7",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "JÚNIOR",
        modality: "REMOTO",
        title: "Desenvolvedor Frontend React",
        type: "INTEGRAL",
        minSalary: 3000.0,
        maxSalary: 4500.0,
        description: "Desenvolvimento de interfaces responsivas com React e Next.js.",
        skills: ["REACT", "TYPESCRIPT", "TAILWINDCSS", "HTML", "CSS"],
      },
      {
        id: "job8",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "PLENO",
        modality: "REMOTO",
        title: "QA Engineer (Quality Assurance)",
        type: "MEIO_PERÍODO",
        fixedSalary: 4000.0,
        description: "Testes automatizados e garantia de qualidade de software.",
        skills: ["CYPRESS", "JEST", "PYTHON", "GITHUB"],
      },
      // --- Novas Vagas para Testar Infinit Scroll ---
      {
        id: "job9",
        companyId: company1.id,
        createdBy: user.id,
        level: "SÊNIOR",
        modality: "REMOTO",
        title: "Tech Lead Frontend",
        type: "INTEGRAL",
        minSalary: 11000.0,
        maxSalary: 15000.0,
        description: "Liderança técnica do time de front-end, definindo padrões e arquitetura.",
        skills: ["REACT", "TYPESCRIPT", "NEXTJS", "ARCHITECTURE"],
      },
      {
        id: "job10",
        companyId: company1.id,
        createdBy: user.id,
        level: "PLENO",
        modality: "REMOTO",
        title: "Desenvolvedor Mobile React Native",
        type: "INTEGRAL",
        minSalary: 6500.0,
        maxSalary: 9000.0,
        description: "Desenvolvimento de aplicativos multiplataforma de alta performance.",
        skills: ["REACT", "TYPESCRIPT", "TAILWINDCSS"],
      },
      {
        id: "job11",
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "JÚNIOR",
        modality: "HÍBRIDO",
        location: "Curitiba, PR",
        title: "Desenvolvedor Backend .NET",
        type: "INTEGRAL",
        minSalary: 3500.0,
        maxSalary: 5000.0,
        description: "Criação de microsserviços corporativos utilizando C# e .NET Core.",
        skills: ["POSTGRESQL", "DOCKER"],
      },
      {
        id: "job12",
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "ESTAGIÁRIO",
        modality: "REMOTO",
        title: "Estagiário de Suporte e DevOps",
        type: "MEIO_PERÍODO",
        fixedSalary: 1500.0,
        description: "Apoio na monitoria de servidores e automação de deploys.",
        skills: ["DOCKER", "AWS", "GITHUB"],
      },
      {
        id: "job13",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "SÊNIOR",
        modality: "REMOTO",
        title: "Engenheiro de Dados Sênior",
        type: "INTEGRAL",
        minSalary: 13000.0,
        maxSalary: 17000.0,
        description: "Modelagem de data warehouses e arquiteturas de Big Data.",
        skills: ["PYTHON", "POSTGRESQL", "AWS", "ARCHITECTURE"],
      },
      {
        id: "job14",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "PLENO",
        modality: "PRESENCIAL",
        location: "Porto Alegre, RS",
        title: "Product Manager",
        type: "INTEGRAL",
        minSalary: 7500.0,
        maxSalary: 10500.0,
        description: "Gestão do ciclo de vida do produto e alinhamento com stakeholders.",
        skills: ["JIRA", "FIGMA"],
      },
      {
        id: "job15",
        companyId: company1.id,
        createdBy: user.id,
        level: "JÚNIOR",
        modality: "REMOTO",
        title: "Analista de Suporte Técnico",
        type: "INTEGRAL",
        minSalary: 2500.0,
        maxSalary: 3500.0,
        description: "Atendimento a clientes e resolução de incidentes em sistemas web.",
        skills: ["HTML", "CSS"],
      },
      {
        id: "job16",
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "SÊNIOR",
        modality: "REMOTO",
        title: "Security Engineer (DevSecOps)",
        type: "INTEGRAL",
        minSalary: 12500.0,
        maxSalary: 16500.0,
        description: "Análise de vulnerabilidades, auditoria de código e segurança em nuvem.",
        skills: ["AWS", "DOCKER", "KUBERNETES", "PYTHON"],
      },
      {
        id: "job17",
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "PLENO",
        modality: "HÍBRIDO",
        location: "Belo Horizonte, MG",
        title: "Desenvolvedor FullStack Go & React",
        type: "INTEGRAL",
        minSalary: 7000.0,
        maxSalary: 9500.0,
        description: "Construção de aplicações web modernas usando Golang e React.",
        skills: ["REACT", "TYPESCRIPT", "POSTGRESQL", "DOCKER"],
      },
    ],
  });

  console.log("Database seeded successfully with multiple jobs for testing!");
}

main()
  .catch((err) => {
    console.error("Error: ", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });