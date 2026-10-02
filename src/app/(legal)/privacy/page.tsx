export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-background-100">
        Política de Privacidade
      </h1>
      <p className="text-sm text-background-400">
        Última atualização: Outubro de 2026
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">1. Introdução</h2>
        <p>
          A sua privacidade é de extrema importância para nós. Esta Política de
          Privacidade descreve como coletamos, usamos, armazenamos e protegemos
          as suas informações pessoais em conformidade com a Lei Geral de
          Proteção de Dados (LGPD).
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">2. Dados que Coletamos</h2>
        <p>Coletamos os seguintes tipos de informações:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            <strong>Dados de Cadastro:</strong> Nome, e-mail, CPF, senha,
            telefone e dados de perfil profissional ou empresarial.
          </li>
          <li>
            <strong>Dados de Vagas e Currículos:</strong> Informações inseridas
            em candidaturas, histórico profissional e habilidades.
          </li>
          <li>
            <strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador,
            páginas acessadas e dados coletados via cookies para melhorar a
            experiência de uso.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">
          3. Como Utilizamos os Dados
        </h2>
        <p>As informações coletadas são utilizadas para:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Operar, manter e melhorar a plataforma de vagas;</li>
          <li>Conectar candidatos e recrutadores de forma eficiente;</li>
          <li>
            Enviar notificações importantes sobre candidaturas e atualizações da
            conta;
          </li>
          <li>Garantir a segurança da plataforma e prevenir fraudes.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">4. Seus Direitos (LGPD)</h2>
        <p>
          Você tem direito a solicitar a confirmação do tratamento, acesso,
          correção, anonimização ou exclusão dos seus dados pessoais a qualquer
          momento.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold mt-4">
          5. Segurança da Informação
        </h2>
        <p>
          Adotamos medidas técnicas e administrativas rigorosas para proteger os
          seus dados contra acessos não autorizados, perdas ou alterações
          indesejadas.
        </p>
      </section>
    </main>
  );
}
