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
} from "react-email";

interface AccountVerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export default function AccountVerificationEmail({
  userName,
  verificationUrl,
}: AccountVerificationEmailProps) {
  const firstName = userName.split(" ")[0];

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>
        Conclua a verificação de email para sua conta no TypeHire
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>
            Termine a configuração da sua conta
          </Heading>

          <Text style={styles.text}>Olá, {firstName}!</Text>
          <Text style={styles.text}>
            Bem-vindo ao TypeHire! Para começar a usar nossos serviços, por
            favor verifique seu endereço de email clicando no botão abaixo:
          </Text>

          <Button href={verificationUrl} style={styles.button}>
            Verificar meu email
          </Button>
          <Text style={styles.text}>
            Esse link vai expirar após 30 minutos.
          </Text>

          <Hr style={styles.hr} />
          <Text style={styles.muted}>
            Se você não registrou uma conta no TypeHire, você pode ignorar com
            segurança esse email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: { backgroundColor: "#C0C0C0", fontFamily: "Arial, sans-serif" },
  container: {
    backgroundColor: "#ffffff",
    margin: "24px auto",
    padding: "24px",
    maxWidth: "520px",
    borderRadius: "8px",
  },
  h1: { fontSize: "22px", color: "#1E1E25", margin: "0 0 16px" },
  text: { fontSize: "15px", color: "#2C2C37", lineHeight: "22px" },
  button: {
    backgroundColor: "#7019DE",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "6px",
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
    marginTop: "20px",
  },
  hr: { borderColor: "#4C4C5B", backgroundColor: "#4C4C5B", margin: "24px 0" },
  muted: { fontSize: "13px", color: "#656572" },
};

AccountVerificationEmail.PreviewProps = {
  userName: "Gabriel Almeida",
  verificationUrl: "https://github.com/g-almeida12",
} satisfies AccountVerificationEmailProps;
