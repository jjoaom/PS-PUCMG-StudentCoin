import { useEffect, useState } from "react";
import "./Extrato.css";

type TipoUsuario = "ALUNO" | "PROFESSOR" | "EMPRESA";

type Movimentacao = {
  valor: number;
  descricao?: string | null;
  tipo: "CREDITO" | "DEBITO" | "RESGATE" | string;
  data: string;
};

export default function Extrato() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType") as TipoUsuario | null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarExtrato();
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

  function getBaseUrl() {
    if (userType === "ALUNO") {
      return `/api/alunos/${userId}`;
    }

    if (userType === "PROFESSOR") {
      return `/api/professor/${userId}`;
    }

    return null;
  }

  async function carregarExtrato() {
    setErro(null);

    if (!userId || !userType) {
      setErro("Usuário não identificado. Faça login novamente.");
      return;
    }

    const baseUrl = getBaseUrl();

    if (!baseUrl) {
      setErro("Este tipo de usuário não possui extrato de moedas.");
      return;
    }

    try {
      setLoading(true);

      const [saldoResposta, extratoResposta] = await Promise.all([
        fetch(`${baseUrl}/saldo`, {
          headers: getHeaders(),
        }),
        fetch(`${baseUrl}/extrato`, {
          headers: getHeaders(),
        }),
      ]);

      const saldoData = await saldoResposta.json().catch(() => null);
      const extratoData = await extratoResposta.json().catch(() => null);

      if (!saldoResposta.ok) {
        setErro(
          saldoData?.erro || saldoData?.message || "Erro ao carregar saldo."
        );
        return;
      }

      if (!extratoResposta.ok) {
        setErro(
          extratoData?.erro ||
            extratoData?.message ||
            "Erro ao carregar extrato."
        );
        return;
      }

      setSaldo(saldoData?.saldo ?? 0);
      setMovimentacoes(Array.isArray(extratoData) ? extratoData : []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data: string) {
    try {
      return new Date(data).toLocaleString("pt-BR");
    } catch {
      return data;
    }
  }

  function getTipoLabel(tipo: string) {
    if (tipo === "CREDITO") return "Recebimento";
    if (tipo === "DEBITO") return "Envio";
    if (tipo === "RESGATE") return "Resgate";
    return tipo;
  }

  function getSinal(tipo: string) {
    if (tipo === "CREDITO") return "+";
    return "-";
  }

  function getClasseTipo(tipo: string) {
    if (tipo === "CREDITO") return "credito";
    if (tipo === "DEBITO") return "debito";
    if (tipo === "RESGATE") return "resgate";
    return "";
  }

  function extrairEnvolvido(mov: Movimentacao) {
    const descricao = mov.descricao || "";

    if (descricao.startsWith("Envio para ")) {
      const nome = descricao
        .replace("Envio para ", "")
        .split(":")[0]
        .trim();

      return {
        label: "Recebedor: ",
        nome,
      };
    }

    if (descricao.startsWith("Recebido de ")) {
      const nome = descricao
        .replace("Recebido de ", "")
        .split(":")[0]
        .trim();

      return {
        label: "Enviado por: ",
        nome,
      };
    }

    if (mov.tipo === "RESGATE") {
      return {
        label: "Resgate",
        nome: "Empresa parceira",
      };
    }

    return {
      label: "Não informado",
      nome: "-",
    };
  }

  function extrairMotivo(descricao?: string | null) {
    if (!descricao) return "Sem descrição";

    if (descricao.includes(":")) {
      return descricao.split(":").slice(1).join(":").trim();
    }

    return descricao;
  }

  return (
    <main className="extrato-page">
      <section className="extrato-hero glass-card">
        <div>
          <span className="badge">Carteira StudentCoin</span>

          <h1>
            Meu <span>extrato</span>
          </h1>

          <p>
            Acompanhe seu saldo e o histórico de movimentações da sua carteira.
          </p>
        </div>

        <div className="extrato-saldo-card">
          <span>Saldo atual</span>
          <strong>{saldo === null ? "..." : saldo}</strong>
          <small>moedas disponíveis</small>
        </div>
      </section>

      <section className="extrato-list-section glass-card">
        <div className="extrato-list-header">
          <div>
            <span className="badge">Movimentações</span>
            <h2>Histórico da carteira</h2>
          </div>

          <button onClick={carregarExtrato} className="extrato-refresh">
            Atualizar
          </button>
        </div>

        {erro && <p className="extrato-message error">{erro}</p>}

        {loading ? (
          <p className="extrato-empty">Carregando extrato...</p>
        ) : movimentacoes.length === 0 ? (
          <p className="extrato-empty">Nenhuma movimentação encontrada.</p>
        ) : (
          <div className="extrato-table-wrapper">
            <table className="extrato-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Envolvido</th>
                  <th>Motivo</th>
                  <th>Data</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {movimentacoes.map((mov, index) => {
                  const envolvido = extrairEnvolvido(mov);

                  return (
                    <tr key={`${mov.data}-${index}`}>
                      <td>
                        <span className={`tipo-pill ${getClasseTipo(mov.tipo)}`}>
                          {getTipoLabel(mov.tipo)}
                        </span>
                      </td>

                      <td>
                        <div className="envolvido-cell">
                          <span>{envolvido.label}</span>
                          <strong>{envolvido.nome}</strong>
                        </div>
                      </td>

                      <td>{extrairMotivo(mov.descricao)}</td>

                      <td>{formatarData(mov.data)}</td>

                      <td className={`valor ${getClasseTipo(mov.tipo)}`}>
                        {getSinal(mov.tipo)}
                        {mov.valor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}