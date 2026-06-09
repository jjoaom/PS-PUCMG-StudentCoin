import { FaChalkboardTeacher, FaGraduationCap, FaStore, FaCoins } from "react-icons/fa";
import { FiMail, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import "./Sobre.css";

export default function Sobre() {
  return (
    <main className="sobre-page">
      <section className="sobre-hero glass-card">
        <span className="badge">Conheça a Plataforma</span>
        <h1>
          Sobre o <span>StudentCoin</span>
        </h1>
        <p>
          O StudentCoin é um sistema inovador de economia acadêmica e recompensas 
          desenvolvido para integrar alunos, professores e empresas parceiras em um 
          ecossistema dinâmico de mérito e benefícios reais.
        </p>
      </section>

      <section className="sobre-grid">
        <article className="sobre-card glass-card">
          <div className="sobre-card-icon">
            <FaChalkboardTeacher />
          </div>
          <h2>Professores</h2>
          <p>
            Reconhecem o mérito estudantil distribuindo moedas. Cada professor recebe 
            automaticamente <strong>1000 moedas</strong> no início de cada semestre para 
            recompensar a participação, o desempenho e as contribuições em sala de aula.
          </p>
        </article>

        <article className="sobre-card glass-card">
          <div className="sobre-card-icon">
            <FaGraduationCap />
          </div>
          <h2>Alunos</h2>
          <p>
            Acumulam moedas virtuais de mérito e podem consultar seu saldo e extrato detalhado 
            em tempo real. Essas moedas são trocadas por cupons e benefícios reais oferecidos 
            pelas empresas parceiras cadastradas.
          </p>
        </article>

        <article className="sobre-card glass-card">
          <div className="sobre-card-icon">
            <FaStore />
          </div>
          <h2>Empresas Parceiras</h2>
          <p>
            Cadastram-se para ter visibilidade no ecossistema universitário, oferecendo 
            vantagens exclusivas (como descontos, brindes e serviços) que atraem estudantes 
            talentosos e engajados.
          </p>
        </article>
      </section>

      <section className="sobre-process glass-card">
        <span className="badge">Como Funciona</span>
        <h2>O Ciclo da Recompensa</h2>
        <div className="process-timeline">
          <div className="process-step">
            <div className="step-num"><FaCoins /></div>
            <h3>1. Premiação</h3>
            <p>Professores enviam moedas com uma justificativa pedagógica e o aluno é notificado.</p>
          </div>
          <div className="process-step">
            <div className="step-num"><FiMail /></div>
            <h3>2. Notificação & Resgate</h3>
            <p>O aluno recebe a confirmação e pode trocar suas moedas por vantagens de parceiros.</p>
          </div>
          <div className="process-step">
            <div className="step-num"><FiCheckCircle /></div>
            <h3>3. Validação</h3>
            <p>Um cupom é gerado e enviado por email para uso presencial ou online com validação automática.</p>
          </div>
        </div>
      </section>

      <section className="sobre-stats glass-card">
        <div className="stat-item">
          <FiTrendingUp className="stat-icon" />
          <div>
            <h3>Engajamento</h3>
            <p>Maior motivação e engajamento acadêmico através de gamificação transparente.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
