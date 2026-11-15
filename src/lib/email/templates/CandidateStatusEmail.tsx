// lib/email/templates/ApplicationUpdateTemplate.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section,
} from "react-email";
import type { ApplicationStatus } from "@/database/generated/enums";
import { APPLICATION_STATUS_LABELS } from "@/utils/mappers";

interface CandidateStatusEmailProps {
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  userName: string;
  jobTitle: string;
  companyName: string;
  feedback: string;
  applicationUrl?: string;
}

export function CandidateStatusEmail({
  oldStatus,
  newStatus,
  userName,
  jobTitle,
  companyName,
  feedback,
  applicationUrl,
}: CandidateStatusEmailProps) {
  const firstName = userName.split(" ")[0];
  const hasFeedback = feedback.trim().length > 0;

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>
        Sua candidatura para {jobTitle} agora está:{" "}
        {APPLICATION_STATUS_LABELS[newStatus]}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Atualização na sua candidatura</Heading>

          <Text style={styles.text}>Olá, {firstName}!</Text>
          <Text style={styles.text}>
            A candidatura para a vaga <strong>{jobTitle}</strong> na{" "}
            <strong>{companyName}</strong> foi atualizada.
          </Text>

          {/* Mudança de status */}
          <Section style={styles.statusBox}>
            <StatusBadge status={oldStatus} />
            <span style={styles.arrow}>&rarr;</span>
            <StatusBadge status={newStatus} />
          </Section>

          <Text style={styles.text}>{STATUS_MESSAGES[newStatus]}</Text>

          {/* Feedback do recrutador */}
          {hasFeedback && (
            <>
              <Text style={styles.feedbackLabel}>Feedback do recrutador</Text>
              <Text style={styles.feedback}>{feedback}</Text>
            </>
          )}

          {applicationUrl && (
            <Button href={applicationUrl} style={styles.button}>
              Ver minha candidatura
            </Button>
          )}

          <Hr style={styles.hr} />
          <Text style={styles.muted}>
            Você recebeu este e-mail porque se candidatou a uma vaga no
            TypeHire.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { bg, text } = STATUS_COLORS[status];
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string }> = {
  PENDING: { bg: "#FEF3C7", text: "#92400E" },
  REVIEW: { bg: "#CCFBF1", text: "#115E59" },
  INTERVIEW: { bg: "#F3E8FF", text: "#6B21A8" },
  HIRED: { bg: "#DCFCE7", text: "#166534" },
  REJECTED: { bg: "#FEE2E2", text: "#991B1B" },
};

const STATUS_MESSAGES: Record<ApplicationStatus, string> = {
  PENDING: "Sua candidatura voltou para a fila de avaliação.",
  REVIEW: "O recrutador está analisando o seu perfil.",
  INTERVIEW: "Você agora está na etapa de entrevista. Boa sorte!",
  HIRED: "Parabéns! Você foi selecionado(a) para a vaga.",
  REJECTED:
    "Infelizmente você não foi selecionado(a) desta vez. Agradecemos o seu interesse.",
};

const styles = {
  body: { backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif" },
  container: {
    backgroundColor: "#ffffff",
    margin: "24px auto",
    padding: "24px",
    maxWidth: "520px",
    borderRadius: "8px",
  },
  h1: { fontSize: "22px", color: "#111827", margin: "0 0 16px" },
  text: { fontSize: "15px", color: "#374151", lineHeight: "22px" },
  statusBox: { margin: "16px 0" },
  arrow: { margin: "0 10px", color: "#6b7280", fontSize: "16px" },
  feedbackLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    margin: "20px 0 4px",
  },
  feedback: {
    backgroundColor: "#f3f4f6",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#111827",
    lineHeight: "22px",
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },
  button: {
    backgroundColor: "#6d28d9",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "6px",
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
    marginTop: "20px",
  },
  hr: { borderColor: "#e5e7eb", margin: "24px 0" },
  muted: { fontSize: "13px", color: "#6b7280" },
};
