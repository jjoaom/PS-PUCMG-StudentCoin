import { useEffect, useState, type FormEvent } from "react";
import "./Alunos.css";

type Aluno = {
  id: number;
  nome?: string;
  name?: string;
  email: string;
  cpf?: string;
  curso?: string;
  saldo?: number;
};

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoId, setAlunoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saldoProfessor, setSaldoProfessor] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const professorId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarDados();
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

  async function carregarDados() {
    setErro(null);
    setSucesso(null);

    await Promise.all([carregarAlunos(), carregarSaldoProfessor()]);
  }

  async function carregarAlunos() {
    try {
      setLoadingLista(true);

      const resposta = await fetch("/api/alunos", {
        headers: getHeaders(),
      });

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(data?.erro || data?.message || "Erro ao carregar alunos.");
        return;
      }

      setAlunos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoadingLista(false);
    }
  }

  async function carregarSaldoProfessor() {
    if (!professorId) return;

    try {
      const resposta = await fetch(`/api/professor/${professorId}/saldo`, {
        headers: getHeaders(),
      });

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        console.error("Erro ao carregar saldo do professor:", data);
        return;
      }

      setSaldoProfessor(data?.saldo ?? 0);
    } catch (error) {
      console.error(error);
    }
  }

  async function enviarMoedas(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro(null);
    setSucesso(null);

    if (!professorId) {
      setErro("Professor não identificado. Faça login novamente.");
      return;
    }

    if (userType !== "PROFESSOR") {
      setErro("Apenas professores podem enviar moedas.");
      return;
    }

    const quantidadeNumerica = Number(quantidade);

    if (!alunoId) {
      setErro("Selecione um aluno.");
      return;
    }

    if (!quantidadeNumerica || quantidadeNumerica <= 0) {
      setErro("Informe uma quantidade válida de moedas.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Informe o motivo do envio.");
      return;
    }

    if (saldoProfessor !== null && quantidadeNumerica > saldoProfessor) {
      setErro("Saldo insuficiente para enviar essa quantidade.");
      return;
    }

    try {
      setLoading(true);

      const resposta = await fetch(
        `/api/professor/${professorId}/enviar-moedas`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            alunoId: Number(alunoId),
            quantidade: quantidadeNumerica,
            descricao: descricao.trim(),
          }),
        }
      );

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(data?.erro || data?.message || "Erro ao enviar moedas.");
        return;
      }

      setSucesso(
        typeof data === "string"
          ? data
          : "Moedas enviadas para processamento com sucesso!"
      );

      setAlunoId("");
      setQuantidade("");
      setDescricao("");

      setTimeout(() => {
        carregarDados();
      }, 1200);
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  if (userType !== "PROFESSOR") {
    return (
      <main className="alunos-page">
        <section className="alunos-restricted glass-card">
          <span className="badge">Acesso restrito</span>
          <h1>Envio de moedas</h1>
          <p>Esta página é exclusiva para professores.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="alunos-page">
      <section className="alunos-shell glass-card">
        <div className="alunos-intro">
          <span className="badge">Professor</span>

          <h1>
            Enviar <span>moedas</span> para alunos
          </h1>

          <p>
            Reconheça o mérito dos alunos enviando moedas por participação,
            desempenho ou bom comportamento.
          </p>

          <div className="saldo-professor-card">
            <span>Seu saldo</span>
            <strong>{saldoProfessor === null ? "..." : saldoProfessor}</strong>
            <small>moedas disponíveis</small>
          </div>
        </div>

        <form onSubmit={enviarMoedas} className="enviar-moedas-form">
          <div className="form-section-title">
            <h2>Nova transferência</h2>
            <p>Selecione o aluno, a quantidade e informe o motivo.</p>
          </div>

          <div className="modern-input-group">
            <label>Aluno</label>
            <select
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              required
            >
              <option value="">Selecione um aluno</option>

              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome || aluno.name} - {aluno.email}
                </option>
              ))}
            </select>
          </div>

          <div className="modern-input-group">
            <label>Quantidade de moedas</label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 100"
              required
            />
          </div>

          <div className="modern-input-group">
            <label>Motivo do reconhecimento</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Excelente participação na aula."
              rows={5}
              required
            />
          </div>

          {erro && <p className="alunos-message error">{erro}</p>}
          {sucesso && <p className="alunos-message success">{sucesso}</p>}

          <button type="submit" className="enviar-submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar moedas"}
          </button>
        </form>
      </section>

      <section className="lista-alunos-section glass-card">
        <div className="lista-alunos-header">
          <div>
            <span className="badge">Alunos</span>
            <h2>Alunos cadastrados</h2>
          </div>

          <button onClick={carregarDados} className="atualizar-alunos">
            Atualizar
          </button>
        </div>

        {loadingLista ? (
          <p className="alunos-empty">Carregando alunos...</p>
        ) : alunos.length === 0 ? (
          <p className="alunos-empty">Nenhum aluno cadastrado.</p>
        ) : (
          <div className="alunos-grid">
            {alunos.map((aluno) => (
              <article key={aluno.id} className="aluno-card">
                <div>
                  <h3>{aluno.nome || aluno.name}</h3>
                  <p>{aluno.email}</p>
                </div>

                <div className="aluno-card-info">
                  <span>{aluno.curso || "Curso não informado"}</span>
                  <strong>{aluno.saldo ?? 0} moedas</strong>
                </div>

                <button
                  onClick={() => {
                    setAlunoId(String(aluno.id));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Selecionar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}