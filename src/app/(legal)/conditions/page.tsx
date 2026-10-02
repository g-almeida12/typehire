export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-background-100">Termos e Condições de Uso</h1>
      <p className="text-sm text-background-400">Última atualização: Outubro de 2026</p>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou utilizar a nossa plataforma de vagas, você concorda expressamente em cumprir e ficar vinculado a estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">2. Cadastro e Contas de Usuário</h2>
        <p>
          Para utilizar todas as funcionalidades do site, você precisará criar uma conta. Você é responsável por manter a confidencialidade das suas credenciais e por todas as atividades realizadas sob a sua conta.
        </p>
        <p>
          Você garante que todas as informações fornecidas durante o cadastro são verdadeiras, precisas e atualizadas.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">3. Regras de Conduta e Uso Aceitável</h2>
        <p>É estritamente proibido aos usuários:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Publicar vagas falsas, enganosas ou discriminatórias;</li>
          <li>Utilizar a plataforma para envio de spam, fraudes ou engenharia social;</li>
          <li>Tentar burlar os sistemas de segurança ou raspar dados de forma automatizada sem autorização;</li>
          <li>Carregar conteúdos maliciosos, vírus ou códigos que possam danificar a infraestrutura do site.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">4. Propriedade Intelectual</h2>
        <p>
          Todo o design, código-fonte, logotipos, textos e estrutura visual da plataforma são de propriedade exclusiva da nossa marca e protegidos pelas leis de propriedade intelectual. O uso não autorizado é proibido.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">5. Modificações dos Termos</h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas na plataforma. O uso continuado após as modificações implica aceitação automática dos novos termos.
        </p>
      </section>
    </main>
  );
}