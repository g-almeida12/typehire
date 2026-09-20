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
A Lucide Icons é uma organização dedicada a impulsionar a experiência visual de desenvolvedores e designers em todo o mundo através de bibliotecas de ícones modernos, leves e altamente personalizáveis. Nascida da paixão por código aberto e design minimalista, nossa missão é fornecer ferramentas visuais consistentes que simplificam a prototipagem e o desenvolvimento de interfaces em aplicações modernas.

Buscamos constantemente talentos apaixonados por tecnologia que queiram construir produtos escaláveis e de alto impacto no ecossistema global. Em nosso ambiente, valorizamos a colaboração, a autonomia e a inovação contínua, oferecendo um espaço dinâmico onde engenheiros e criativos podem transformar ideias complexas em experiências digitais elegantes e acessíveis.
      `.trim(),
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: company1.id,
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
        skills: ["ANGULAR", "ARCHITECTURE", "POSTGRESQL", "PYTHON", "FASTAPI", "CSS", "HTML"],
      },
      {
        companyId: company1.id,
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
        companyId: company1.id,
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
          { userId: "user125" }, // Juliana Costa
        ],
      },
      bio: `
A CodeCraft Solutions é uma empresa inovadora especializada em arquitetura de microsserviços, soluções em nuvem e desenvolvimento de softwares sob medida para grandes corporações globais. Acreditamos que a engenharia de software de alta performance deve ser aliada a uma cultura ágil, transparente e centrada nas pessoas.

Nosso escritório respira tecnologia e criatividade. Aqui, cada membro da equipe tem voz ativa para propor novas abordagens arquiteturais, influenciar diretamente o ciclo de vida dos produtos e evoluir tecnologicamente através de desafios complexos do mercado corporativo.
      `.trim(),
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "SÊNIOR",
        modality: "REMOTO",
        title: "Arquiteto de Software Cloud",
        type: "INTEGRAL",
        minSalary: 12000.0,
        maxSalary: 16000.0,
        id: "job4",
        description: `
## Lidere Nossa Infraestrutura Cloud
Estamos contratando um **Arquiteto de Software Cloud Sênior** para desenhar, planejar e guiar a migração e evolução de sistemas de missão crítica para ambientes altamente escaláveis.

### Suas Missões
* Desenhar arquiteturas serverless e baseadas em containers na AWS.
* Garantir os mais altos padrões de segurança, resiliência e otimização de custos.
* Apoiar e mentorar os times de desenvolvimento backend.

### O que buscamos
* Ampla experiência com ecossistema AWS, Docker e Kubernetes.
* Histórico comprovado em projetos de grande escala.
* Domínio de padrões de arquitetura de software modernos.
        `.trim(),
        skills: ["AWS", "DOCKER", "KUBERNETES", "ARCHITECTURE", "TYPESCRIPT"],
      },
      {
        companyId: company2.id,
        createdBy: userJulia.id,
        level: "PLENO",
        modality: "REMOTO",
        title: "Desenvolvedor Backend Node.js",
        type: "INTEGRAL",
        minSalary: 6000.0,
        maxSalary: 8500.0,
        id: "job5",
        description: `
## Construa APIs de Alta Performance
Procuramos um **Desenvolvedor Backend Node.js Pleno** focado em escrever códigos robustos, seguros e performáticos para alimentar nossos principais produtos digitais.

### Principais Desafios
* Construir e manter APIs RESTful e serviços assíncronos.
* Modelar esquemas complexos em bancos de dados relacionais.
* Escrever testes automatizados garantindo cobertura e confiabilidade.

### Requisitos Técnicos
* Experiência sólida com Node.js, TypeScript e Express ou NestJS.
* Conexão e otimização de consultas em PostgreSQL.
* Familiaridade com práticas de CI/CD e testes com Jest.
        `.trim(),
        skills: ["POSTGRESQL", "TYPESCRIPT", "DOCKER", "JEST"],
      },
    ],
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
          { userId: "user127" }, // Gabriela Santos
          { userId: "user130" }, // Lucas Oliveira
        ],
      },
      bio: `
A Nexus Tech Innovations é uma startup de tecnologia focada em inteligência artificial aplicada, ciência de dados e desenvolvimento de experiências mobile e web altamente imersivas para o mercado latino-americano. 

Nossa cultura é pautada na experimentação rápida, no aprendizado constante e na entrega iterativa de valor. Se você busca um ambiente dinâmico onde suas ideias viram código e impacto real em poucas semanas, a Nexus é o seu lugar.
      `.trim(),
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "SÊNIOR",
        modality: "HÍBRIDO",
        location: "Florianópolis, SC",
        title: "Engenheiro de Machine Learning",
        type: "INTEGRAL",
        minSalary: 10000.0,
        maxSalary: 14000.0,
        id: "job6",
        description: `
## Inove com Inteligência Artificial
Buscamos um **Engenheiro de Machine Learning Sênior** para atuar em modelo híbrido em Florianópolis, SC, liderando a criação de pipelines preditivos e modelos generativos aplicados aos nossos produtos.

### Responsabilidades do Cargo
* Desenvolver, treinar e otimizar modelos de IA para produção.
* Integrar modelos inteligentes com aplicações web escaláveis.
* Colaborar com cientistas de dados e engenheiros de software.

### Requisitos Indispensáveis
* Domínio avançado de Python e bibliotecas de machine learning.
* Experiência com implantação de modelos em nuvem (AWS).
* Boa base em bancos de dados relacionais e engenharia de dados.
        `.trim(),
        skills: ["PYTHON", "AWS", "DOCKER", "POSTGRESQL"],
      },
      {
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "JÚNIOR",
        modality: "REMOTO",
        title: "Desenvolvedor Frontend React",
        type: "INTEGRAL",
        minSalary: 3000.0,
        maxSalary: 4500.0,
        id: "job7",
        description: `
## Crie Interfaces Incríveis
Estamos à procura de um **Desenvolvedor Frontend React Júnior** cheio de energia para ajudar a construir as interfaces responsivas e de altíssima performance dos nossos novos softwares.

### O que você fará no dia a dia
* Desenvolver componentes reutilizáveis utilizando React e Next.js.
* Consumir APIs RESTful e integrar estados globais e locais.
* Garantir uma experiência de usuário (UX) fluida em múltiplos dispositivos.

### O que esperamos de você
* Conhecimento prático em React, TypeScript e Tailwind CSS.
* Noções de semântica HTML e estilização CSS moderna.
* Vontade enorme de aprender e evoluir rápido no ecossistema frontend.
        `.trim(),
        skills: ["REACT", "TYPESCRIPT", "TAILWINDCSS", "HTML", "CSS"],
      },
      {
        companyId: company3.id,
        createdBy: userGabriel.id,
        level: "PLENO",
        modality: "REMOTO",
        title: "QA Engineer (Quality Assurance)",
        type: "MEIO_PERÍODO",
        fixedSalary: 4000.0,
        id: "job8",
        description: `
## Garanta a Qualidade dos Nossos Produtos
Procuramos um **QA Engineer Pleno** para atuar em meio período, estruturando processos de testes automatizados e garantindo a estabilidade contínua dos nossos releases.

### Atividades Principais
* Desenvolver e executar planos de testes manuais e automatizados.
* Implementar suítes de testes de ponta a ponta (E2E) e regressão.
* Atuar lado a lado com os desenvolvedores na prevenção de bugs.

### O que exigimos da vaga
* Experiência sólida com ferramentas de testes como Cypress e Jest.
* Familiaridade com automação em Python ou JavaScript.
* Boa comunicação e atenção aos detalhes.
        `.trim(),
        skills: ["CYPRESS", "JEST", "PYTHON", "GITHUB"],
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