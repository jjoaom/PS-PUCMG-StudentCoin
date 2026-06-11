import { useEffect, useState } from "react";
import { FiCopy, FiRefreshCw, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { ImDiamonds } from "react-icons/im";
import "./Cupons.css";

type Cupom = {
  id: number;
  codigo: string;
  dataEmissao: string;
  dataValidade: string;
  utilizado: boolean;
  dataUtilizacao: string | null;
  alunoId: number;
  vantagemId: number;
  vantagemDescricao: string;
  custoMoedas: number;
  nomeEmpresa: string;
};

export default function Cupons() {
  const [disponiveis, setDisponiveis] = useState<Cupom[]>([]);
  const [historico, setHistorico] = useState<Cupom[]>([]);
  const [aba, setAba] = useState<"disponiveis" | "historico">("disponiveis");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [usando, setUsando] = useState<number | null>(null);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  const isAluno = userType === "ALUNO";

  function getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  useEffect(() => {
    if (isAluno && userId) {
      carregarCupons();
    }
  }, [isAluno, userId]);

  async function carregarCupons() {
    setErro(null);
    setLoading(true);

    try {
      const [dispResp, histResp] = await Promise.all([
        fetch(`/api/alunos/${userId}/cupons/disponiveis`, { headers: getHeaders() }),
        fetch(`/api/alunos/${userId}/cupons/historico`, { headers: getHeaders() }),
      ]);

      const dispData = await dispResp.json().catch(() => null);
      const histData = await histResp.json().catch(() => null);

      if (!dispResp.ok) {
        setErro(dispData?.erro || "Erro ao carregar cupons disponíveis.");
        return;
      }

      setDisponiveis(Array.isArray(dispData) ? dispData : []);
      setHistorico(Array.isArray(histData) ? histData : []);
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function usarCupom(cupomId: number, codigo: string) {
    setUsando(cupomId);
    setErro(null);

    try {
      const resposta = await fetch(`/api/alunos/usar-cupom/${codigo}`, {
        method: "POST",
        headers: getHeaders(),
      });

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(data?.erro || data?.message || "Erro ao utilizar cupom.");
        return;
      }

      carregarCupons();
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setUsando(null);
    }
  }

  function copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  }

  function formatarData(data: string) {
    try {
      return new Date(data).toLocaleString("pt-BR");
    } catch {
      return data;
    }
  }

  function formatarDataCurta(data: string) {
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  }

  function isExpirado(dataValidade: string) {
    try {
      return new Date(dataValidade) < new Date();
    } catch {
      return false;
    }
  }

  if (!isAluno) {
    return (
      <main className="cupons-page restricted">
        <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
          <FiXCircle style={{ fontSize: "3rem", color: "var(--color-text-muted)", marginBottom: "16px" }} />
          <h1>Acesso restrito</h1>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "12px" }}>
            Apenas alunos podem acessar esta página.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="cupons-page">
      <section className="cupons-hero glass-card">
        <div>
          <span className="badge">StudentCoin</span>
          <h1>
            Meus <span>cupons</span>
          </h1>
          <p>
            Acompanhe seus cupons resgatados e utilize-os nas empresas parceiras.
          </p>
        </div>

        <button onClick={carregarCupons} className="cupons-refresh primary-button" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiRefreshCw /> Atualizar
        </button>
      </section>

      <section className="cupons-content glass-card">
        <div className="cupons-tabs">
          <button
            className={`cupons-tab ${aba === "disponiveis" ? "active" : ""}`}
            onClick={() => setAba("disponiveis")}
          >
            <FiClock /> Disponíveis ({disponiveis.length})
          </button>
          <button
            className={`cupons-tab ${aba === "historico" ? "active" : ""}`}
            onClick={() => setAba("historico")}
          >
            <FiCheckCircle /> Histórico ({historico.length})
          </button>
        </div>

        {erro && <p className="cupons-message error">{erro}</p>}

        {loading ? (
          <p className="cupons-empty">Carregando cupons...</p>
        ) : aba === "disponiveis" ? (
          disponiveis.length === 0 ? (
            <p className="cupons-empty">Nenhum cupom disponível. Resgate benefícios na página de Benefícios!</p>
          ) : (
            <div className="cupons-grid">
              {disponiveis.map((cupom) => (
                <article key={cupom.id} className="cupom-card available">
                  <div className="cupom-card-header">
                    <span className="cupom-empresa">{cupom.nomeEmpresa}</span>
                    <span className="cupom-moedas"><ImDiamonds /> {cupom.custoMoedas}</span>
                  </div>

                  <h3>{cupom.vantagemDescricao}</h3>

                  <div className="cupom-code-display">
                    <code>{cupom.codigo}</code>
                    <button
                      className="cupom-small-copy"
                      onClick={() => copiarCodigo(cupom.codigo)}
                    >
                      <FiCopy /> {copiado === cupom.codigo ? "Copiado" : "Copiar"}
                    </button>
                  </div>

                  <div className="cupom-card-footer">
                    <span className="cupom-validade">
                      Válido até {formatarDataCurta(cupom.dataValidade)}
                    </span>
                    <button
                      className="cupom-usar-btn"
                      onClick={() => usarCupom(cupom.id, cupom.codigo)}
                      disabled={usando === cupom.id}
                    >
                      {usando === cupom.id ? "Utilizando..." : "Utilizar cupom"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          historico.length === 0 ? (
            <p className="cupons-empty">Nenhum cupom no histórico.</p>
          ) : (
            <div className="cupons-grid">
              {historico.map((cupom) => {
                const expirado = !cupom.utilizado && isExpirado(cupom.dataValidade);
                return (
                  <article key={cupom.id} className={`cupom-card ${cupom.utilizado ? "used" : "expired"}`}>
                    <div className="cupom-card-header">
                      <span className="cupom-empresa">{cupom.nomeEmpresa}</span>
                      <span className={`cupom-status-badge ${cupom.utilizado ? "used" : "expired"}`}>
                        {cupom.utilizado ? "Utilizado" : "Expirado"}
                      </span>
                    </div>

                    <h3>{cupom.vantagemDescricao}</h3>

                    <div className="cupom-code-display">
                      <code>{cupom.codigo}</code>
                    </div>

                    <div className="cupom-card-footer">
                      <span className="cupom-validade">
                        {cupom.utilizado
                          ? `Usado em ${formatarData(cupom.dataUtilizacao!)}`
                          : expirado
                            ? `Expirou em ${formatarDataCurta(cupom.dataValidade)}`
                            : `Válido até ${formatarDataCurta(cupom.dataValidade)}`}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        )}
      </section>
    </main>
  );
}
