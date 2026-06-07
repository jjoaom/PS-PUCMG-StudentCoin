import { useEffect, useState, type FormEvent } from "react";
import "./GerenciarBeneficios.css";

type Vantagem = {
  id: number;
  descricao: string;
  custoMoedas: number;
  detalhes?: string | null;
  ativa: boolean;
  empresaId: number;
  criadoEm?: string;
  atualizadoEm?: string;
};

type FormBeneficio = {
  descricao: string;
  custoMoedas: string;
  detalhes: string;
};

export default function GerenciarBeneficios() {
  const [form, setForm] = useState<FormBeneficio>({
    descricao: "",
    custoMoedas: "",
    detalhes: "",
  });

  const [beneficios, setBeneficios] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const empresaId = localStorage.getItem("userId");
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

  function limparMensagens() {
    setErro(null);
    setSucesso(null);
  }

  async function carregarBeneficios() {
    if (!empresaId) return;

    try {
      setLoadingLista(true);

      const res = await fetch(`/api/empresa/${empresaId}/vantagens`, {
        headers: getHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErro(data?.erro || data?.message || "Erro ao carregar benefícios.");
        return;
      }

      setBeneficios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoadingLista(false);
    }
  }

  async function cadastrarBeneficio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    limparMensagens();

    if (!empresaId) {
      setErro("Empresa não identificada. Faça login novamente.");
      return;
    }

    if (userType !== "EMPRESA") {
      setErro("Apenas empresas podem cadastrar benefícios.");
      return;
    }

    const custo = Number(form.custoMoedas);

    if (!form.descricao.trim()) {
      setErro("Informe a descrição do benefício.");
      return;
    }

    if (!custo || custo <= 0) {
      setErro("O custo em moedas deve ser maior que zero.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        descricao: form.descricao.trim(),
        custoMoedas: custo,
        detalhes: form.detalhes.trim() || null,
      };

      const res = await fetch(`/api/empresa/${empresaId}/vantagens`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErro(data?.erro || data?.message || "Erro ao cadastrar benefício.");
        return;
      }

      setSucesso("Benefício cadastrado com sucesso!");

      setForm({
        descricao: "",
        custoMoedas: "",
        detalhes: "",
      });

      await carregarBeneficios();
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function alterarStatus(beneficio: Vantagem) {
    limparMensagens();

    const acao = beneficio.ativa ? "desativar" : "ativar";

    try {
      const res = await fetch(`/api/vantagem/${beneficio.id}/${acao}`, {
        method: "PATCH",
        headers: getHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErro(data?.erro || data?.message || "Erro ao alterar benefício.");
        return;
      }

      setSucesso(
        beneficio.ativa
          ? "Benefício desativado com sucesso."
          : "Benefício ativado com sucesso."
      );

      await carregarBeneficios();
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    }
  }

  async function excluirBeneficio(id: number) {
    limparMensagens();

    const confirmar = window.confirm("Deseja realmente excluir este benefício?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/vantagem/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.erro || data?.message || "Erro ao excluir benefício.");
        return;
      }

      setSucesso("Benefício excluído com sucesso.");
      await carregarBeneficios();
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    }
  }

  if (userType !== "EMPRESA") {
    return (
      <main className="benefits-page">
        <section className="benefits-shell glass-card">
          <h1>Acesso restrito</h1>
          <p>Esta página é exclusiva para empresas parceiras.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="benefits-page">
      <section className="benefits-shell glass-card">
        <div className="benefits-intro">
          <span className="badge">Empresa Parceira</span>

          <h1>
            Gerencie seus <span>benefícios.</span>
          </h1>

          <p>
            Cadastre vantagens para que alunos possam resgatar usando moedas do
            StudentCoin.
          </p>

          <div className="benefits-info-card">
            <strong>ID da empresa</strong>
            <span>{empresaId}</span>
          </div>
        </div>

        <form onSubmit={cadastrarBeneficio} className="benefits-form">
          <div className="form-section-title">
            <h2>Novo benefício</h2>
            <p>Preencha os dados da vantagem que será exibida aos alunos.</p>
          </div>

          <div className="modern-input-group">
            <label>Descrição</label>
            <input
              value={form.descricao}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, descricao: e.target.value }))
              }
              placeholder="Ex: 20% de desconto em livros"
              required
            />
          </div>

          <div className="modern-input-group">
            <label>Custo em moedas</label>
            <input
              type="number"
              min="1"
              value={form.custoMoedas}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, custoMoedas: e.target.value }))
              }
              placeholder="Ex: 150"
              required
            />
          </div>

          <div className="modern-input-group">
            <label>Detalhes</label>
            <textarea
              value={form.detalhes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, detalhes: e.target.value }))
              }
              placeholder="Ex: Válido para compras acima de R$ 50,00."
              rows={5}
            />
          </div>

          {erro && <p className="benefits-message error">{erro}</p>}
          {sucesso && <p className="benefits-message success">{sucesso}</p>}

          <button type="submit" className="benefits-submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar benefício"}
          </button>
        </form>
      </section>

      <section className="benefits-list-section glass-card">
        <div className="benefits-list-header">
          <div>
            <span className="badge">Benefícios</span>
            <h2>Benefícios cadastrados</h2>
          </div>

          <button className="benefits-refresh" onClick={carregarBeneficios}>
            Atualizar
          </button>
        </div>

        {loadingLista ? (
          <p className="benefits-empty">Carregando benefícios...</p>
        ) : beneficios.length === 0 ? (
          <p className="benefits-empty">
            Nenhum benefício cadastrado ainda.
          </p>
        ) : (
          <div className="benefits-grid">
            {beneficios.map((beneficio) => (
              <article key={beneficio.id} className="benefit-card">
                <div className="benefit-card-header">
                  <span
                    className={
                      beneficio.ativa
                        ? "benefit-status active"
                        : "benefit-status inactive"
                    }
                  >
                    {beneficio.ativa ? "Ativo" : "Inativo"}
                  </span>

                  <strong>{beneficio.custoMoedas} moedas</strong>
                </div>

                <h3>{beneficio.descricao}</h3>

                <p>
                  {beneficio.detalhes || "Sem detalhes adicionais cadastrados."}
                </p>

                <div className="benefit-actions">
                  <button onClick={() => alterarStatus(beneficio)}>
                    {beneficio.ativa ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    className="danger"
                    onClick={() => excluirBeneficio(beneficio.id)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}