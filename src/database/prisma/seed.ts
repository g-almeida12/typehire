import { prisma } from "@/database/index";

async function main() {
  await prisma.job.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.company.deleteMany();
  
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
    skipDuplicates: true, // Evita erros caso algum ID ou e-mail já exista no banco
  });

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
      members: {
        create: {
          userId: user.id,
        },
      },
      bio: "A Lucide Icons é uma organização dedicada a impulsionar a experiência visual de desenvolvedores e designers em todo o mundo através de bibliotecas de ícones modernos, leves e altamente personalizáveis. Nascida da paixão por código aberto e design minimalista, nossa missão é fornecer ferramentas visuais consistentes que simplificam a prototipagem e o desenvolvimento de interfaces em aplicações modernas.\n\nBuscamos constantemente talentos apaixonados por tecnologia que queiram construir produtos escaláveis e de alto impacto no ecossistema global. Em nosso ambiente, valorizamos a colaboração, a autonomia e a inovação contínua, oferecendo um espaço dinâmico onde engenheiros e criativos podem transformar ideias complexas em experiências digitais elegantes e acessíveis.",
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
        description: `
## Sobre a Oportunidade
Estamos em busca de um **Desenvolvedor FullStack Júnior** para compor nosso time de engenharia de forma remota. Se você gosta de desafios e quer crescer construindo produtos escaláveis, essa vaga é para você!

### Responsabilidades
* Desenvolver novas funcionalidades no frontend e backend.
* Participar de reuniões de alinhamento com o time de produto.
* Escrever códigos limpos e testáveis.

### Requisitos Obrigatórios
* Experiência prévia com projetos usando Python e FastAPI.
* Conhecimento sólido em bancos de dados relacionais como PostgreSQL.
* Familiaridade com HTML, CSS e arquitetura de software.

### Benefícios
* Horário flexível.
* Ambiente 100% remoto.
* Mentoria contínua com devs seniores.
        `.trim(),
        skills: [
          "ANGULAR",
          "ARCHITECTURE",
          "POSTGRESQL",
          "PYTHON",
          "FASTAPI",
          "CSS",
          "HTML",
        ],
      },
      {
        companyId: company.id,
        createdBy: user.id,
        level: "PLENO",
        modality: "HÍBRIDO",
        title: "Designer UI/UX",
        location: "Recife, PE",
        type: "FREELANCER",
        hourlySalary: 100.0,
        id: "job2",
        description: `
## O Desafio de Design
Buscamos um **Designer UI/UX Pleno** para atuar em formato híbrido em Recife, PE. Você será responsável por desenhar a experiência dos nossos principais fluxos de usuário.

### O que você vai fazer
* Criar wireframes, protótipos de baixa e alta fidelidade no Figma.
* Conduzir pesquisas e testes com usuários.
* Colaborar diretamente com desenvolvedores para garantir a fidelidade do design.

### Requisitos da Vaga
* Domínio absoluto do Figma.
* Boa comunicação e foco em metodologias ágeis (Jira).
* Noções básicas de HTML e CSS para melhor alinhamento com o front.
        `.trim(),
        skills: ["FIGMA", "HTML", "CSS", "JIRA", "NETLIFY"],
      },
      {
        companyId: company.id,
        createdBy: user.id,
        level: "ESTAGIÁRIO",
        modality: "PRESENCIAL",
        location: "São Paulo, SP",
        title: "Analista de dados",
        type: "INTEGRAL",
        minSalary: 1600.0,
        maxSalary: 2200.0,
        id: "job3",
        description: `
## Venha Estagiar Conosco
Procuramos um **Analista de Dados Estagiário** para atuar presencialmente em São Paulo, SP. O estagiário trabalhará coletando, estruturando e analisando grandes volumes de dados.

### Principais Atividades
* Apoiar na criação de pipelines de dados.
* Desenvolver scripts de automação e testes.
* Gerar relatórios periódicos para a diretoria.

### O que esperamos de você
* Cursando ensino superior em exatas ou áreas afins.
* Conhecimento básico de Python e testes unitários.
* Vontade de aprender sobre arquitetura de dados e cloud (AWS).
        `.trim(),
        skills: ["PYTEST", "PYTHON", "ARCHITECTURE", "AWS"],
      },
    ],
  });
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
