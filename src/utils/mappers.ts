import {
  Skill,
  JobLevel,
  JobModality,
  JobStatus,
  JobType,
  CompanySize,
  ApplicationStatus,
} from "@/database/generated/enums";

export const SKILL_LABELS: Record<Skill, string> = {
  // --- Frontend & Web ---
  JAVASCRIPT: "JavaScript",
  TYPESCRIPT: "TypeScript",
  REACT: "React",
  VUE: "Vue",
  ANGULAR: "Angular",
  SVELTE: "Svelte",
  NUXTJS: "NuxtJS",
  NEXTJS: "NextJS",
  NESTJS: "NestJS",
  REMIX: "Remix",
  ASTRO: "Astro",
  HTML: "HTML5",
  CSS: "CSS3",
  TAILWINDCSS: "Tailwind CSS",
  SCSS: "SCSS",
  BOOTSTRAP: "Bootstrap",
  SASS: "Sass",
  LESS: "Less",
  WEBPACK: "Webpack",
  VITE: "Vite",
  BUN: "Bun",

  // --- Backend & Languages ---
  NODEJS: "NodeJS",
  PYTHON: "Python",
  JAVA: "Java",
  CSHARP: "C#",
  GOLANG: "Go",
  RUST: "Rust",
  RUBY: "Ruby",
  PHP: "PHP",
  LARAVEL: "Laravel",
  DJANGO: "Django",
  FLASK: "Flask",
  FASTAPI: "FastAPI",
  SPRING: "Spring Boot",
  DOTNET: ".NET",
  CPP: "C++",
  C: "C",
  R: "R",

  // --- Databases ---
  POSTGRESQL: "PostgreSQL",
  MYSQL: "MySQL",
  MONGODB: "MongoDB",
  REDIS: "Redis",
  FIREBASE: "Firebase",
  DYNAMODB: "DynamoDB",
  ORACLE: "Oracle",
  ELASTICSEARCH: "Elasticsearch",
  CASSANDRA: "Cassandra",
  MARIADB: "MariaDB",

  // --- Mobile ---
  REACT_NATIVE: "React Native",
  FLUTTER: "Flutter",
  SWIFT: "Swift",
  KOTLIN: "Kotlin",
  XAMARIN: "Xamarin",
  IONIC: "Ionic",

  // --- DevOps & Cloud ---
  DOCKER: "Docker",
  KUBERNETES: "Kubernetes",
  AWS: "AWS",
  AZURE: "Azure",
  GCP: "Google Cloud",
  HEROKU: "Heroku",
  NETLIFY: "Netlify",
  VERCEL: "Vercel",
  GITLAB_CI: "GitLab CI",
  GITHUB_ACTIONS: "GitHub Actions",
  JENKINS: "Jenkins",
  TERRAFORM: "Terraform",

  // --- Tools & OS ---
  GIT: "Git",
  GITHUB: "GitHub",
  GITLAB: "GitLab",
  BITBUCKET: "Bitbucket",
  JIRA: "Jira",
  FIGMA: "Figma",
  LINUX: "Linux",
  WINDOWS: "Windows",
  MACOS: "macOS",

  // --- Testing ---
  JEST: "Jest",
  VITEST: "Vitest",
  CYPRESS: "Cypress",
  SELENIUM: "Selenium",
  MOCHA: "Mocha",
  CHAI: "Chai",
  PYTEST: "PyTest",
  UNITTEST: "UnitTest",

  // --- Concepts & Architecture ---
  REST_API: "REST API",
  GRAPHQL: "GraphQL",
  GRPC: "gRPC",
  WEBSOCKETS: "WebSockets",
  OAUTH: "OAuth",
  JWT: "JWT",
  SQL: "SQL",
  NOSQL: "NoSQL",
  MQ: "Message Queue",
  RABBITMQ: "RabbitMQ",
  KAFKA: "Apache Kafka",
  DESIGN_PATTERNS: "Design Patterns",
  AGILE: "Métodologia Ágil",
  SCRUM: "Scrum",
  MICROSERVICES: "Microsserviços",
  MONOLITH: "Monólito",
  ARCHITECTURE: "Arquitetura de Software",
};

export const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  INTERN: "Estagiário",
  JUNIOR: "Júnior",
  MID: "Pleno",
  SENIOR: "Sênior",
};

export const JOB_MODALITY_LABELS: Record<JobModality, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Tempo Integral",
  PART_TIME: "Meio Período",
  FREELANCE: "Freelancer",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
  PAUSED: "Pausada",
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  STARTUP: "Startup",
  SMALL: "Pequena empresa",
  MEDIUM: "Média empresa",
  LARGE: "Grande empresa",
  MULTINATIONAL: "Multinacional",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pendente",
  REVIEW: "Em análise",
  INTERVIEW: "Em entrevista",
  HIRED: "Contratado(a)",
  REJECTED: "Não selecionado(a)",
};
