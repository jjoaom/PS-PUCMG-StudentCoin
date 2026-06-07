import { useEffect, useState } from "react";
import "./Beneficios.css";

type Vantagem = {
  id: number;
  descricao: string;
  custoMoedas: number;
  detalhes?: string | null;
  ativa: boolean;
  empresaId?: number;
  nomeEmpresa?: string;
};

export default function Beneficios() {
  const [beneficios, setBeneficios] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarBeneficios();
  }, []);

  function getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function carregarBeneficios() {
    setErro(null);

    try {
      setLoading(true);

      const resposta = await fetch("/api/vantagem", {
        headers: getHeaders(),
      });

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(data?.erro || data?.message || "Erro ao carregar benefícios.");
        return;
      }

      const lista = Array.isArray(data) ? data : [];

      const beneficiosAtivos = lista.filter(
        (beneficio: Vantagem) => beneficio.ativa !== false
      );

      setBeneficios(beneficiosAtivos);
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function abrirModalResgate() {
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  if (userType !== "ALUNO") {
    return (
      <main className="beneficios-page">
        <section className="beneficios-restricted glass-card">
          <span className="badge">Acesso restrito</span>
          <h1>Benefícios disponíveis</h1>
          <p>Esta página é exclusiva para alunos.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="beneficios-page">
      <section className="beneficios-hero glass-card">
        <div>
          <span className="badge">StudentCoin</span>

          <h1>
            Benefícios <span>disponíveis</span>
          </h1>

          <p>
            Veja as vantagens oferecidas pelas empresas parceiras do
            StudentCoin.
          </p>
        </div>

        <button onClick={carregarBeneficios} className="beneficios-refresh">
          Atualizar lista
        </button>
      </section>

      <section className="beneficios-list glass-card">
        <div className="beneficios-list-header">
          <div>
            <span className="badge">Vantagens</span>
            <h2>Lista de benefícios</h2>
          </div>
        </div>

        {erro && <p className="beneficios-message error">{erro}</p>}

        {loading ? (
          <p className="beneficios-empty">Carregando benefícios...</p>
        ) : beneficios.length === 0 ? (
          <p className="beneficios-empty">
            Nenhum benefício disponível no momento.
          </p>
        ) : (
          <div className="beneficios-grid">
            {beneficios.map((beneficio) => (
              <article key={beneficio.id} className="beneficio-card">
                <div className="beneficio-card-top">
                  <span className="beneficio-status">Disponível</span>
                  <strong>{beneficio.custoMoedas} moedas</strong>
                </div>

                <h3>{beneficio.descricao}</h3>

                <p>
                  {beneficio.detalhes ||
                    "Sem detalhes adicionais cadastrados."}
                </p>

                <button onClick={abrirModalResgate}>
                  Resgatar benefício
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>
              ×
            </button>

            <div className="modal-image-box">
              <img
                src="/cachorro-pedreiro.png"
                alt="Estamos trabalhando nisso"
              />
            </div>

            <h2>Estamos trabalhando nisso!</h2>

            <p>
              A funcionalidade de resgate ainda está em desenvolvimento.
            </p>

            <button className="modal-action" onClick={fecharModal}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}