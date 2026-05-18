import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="hero">
      <section className="hero-content glass-card">
        <span className="badge">Moeda estudantil digital</span>

        <h1>
          Transforme desempenho acadêmico em
          <span> benefícios reais.</span>
        </h1>

        <p>
          O StudentCoin conecta alunos, professores e empresas parceiras em um
          sistema moderno de recompensas acadêmicas baseado em moedas digitais.
        </p>

        <div className="hero-actions">
          <Link to="/CadastroAluno">
            <button className="primary-button">
              Começar agora
            </button>
          </Link>

          <Link to="/Login">
            <button className="secondary-button">
              Fazer login
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}