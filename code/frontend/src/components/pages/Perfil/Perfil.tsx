import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./Perfil.css";

type UsuarioForm = {
  nome?: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  email: string;
  senha: string;
  telefone?: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  curso?: string;
  instituicaoId?: number;
};

function Perfil() {
  const [form, setForm] = useState<UsuarioForm>({
    email: "",
    senha: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const isAluno = userType === "ALUNO";
  const API = isAluno
    ? `http://localhost:8080/api/alunos/${userId}`
    : `http://localhost:8080/api/empresa/${userId}`;

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    if (!userId || !userType) {
      alert("Usuário não está logado");
      window.location.href = "/Login";
      return;
    }

    try {
      const resposta = await fetch(API);

      if (!resposta.ok) {
        alert("Erro ao carregar perfil");
        return;
      }

      const dados = await resposta.json();
      setForm(dados);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "instituicaoId" ? Number(value) : value,
    }));
  }

  async function buscarCep() {
    const cepLimpo = form.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        alert("CEP não encontrado");
        return;
      }

      setForm((prev) => ({
        ...prev,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch {
      alert("Erro ao buscar CEP");
    }
  }

  async function salvarAlteracoes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const resposta = await fetch(API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!resposta.ok) {
        alert("Erro ao atualizar perfil");
        return;
      }

      const dadosAtualizados = await resposta.json();

      localStorage.setItem("userEmail", dadosAtualizados.email);

      if (isAluno) {
        localStorage.setItem("userName", dadosAtualizados.nome);
      } else {
        localStorage.setItem("userName", dadosAtualizados.nomeFantasia);
      }

      alert("Perfil atualizado com sucesso!");
      setEditando(false);
      carregarPerfil();
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend");
    }
  }

  if (loading) {
    return <p className="perfil-loading">Carregando perfil...</p>;
  }

  return (
    <main className="perfil-page">
      <section className="perfil-card">
        <div className="perfil-header">
          <div>
            <h1>Meu Perfil</h1>
            <p>Visualize e edite suas informações cadastradas.</p>
          </div>

          <button
            type="button"
            className="perfil-edit-btn"
            onClick={() => setEditando(!editando)}
          >
            {editando ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        <form onSubmit={salvarAlteracoes}>
          <div className="form-grid">
            {isAluno ? (
              <>
                <div className="input-group">
                  <label>Nome</label>
                  <input name="nome" value={form.nome || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>CPF</label>
                  <input name="cpf" value={form.cpf || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>RG</label>
                  <input name="rg" value={form.rg || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>Curso</label>
                  <input name="curso" value={form.curso || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>Instituição</label>
                  <select
                    name="instituicaoId"
                    value={form.instituicaoId || ""}
                    onChange={handleChange}
                    disabled={!editando}
                  >
                    <option value="">Selecione</option>
                    <option value="1">PUC Minas</option>
                    <option value="2">UFMG</option>
                    <option value="3">CEFET-MG</option>
                    <option value="4">UNA</option>
                    <option value="5">FUMEC</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Nome Fantasia</label>
                  <input name="nomeFantasia" value={form.nomeFantasia || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>Razão Social</label>
                  <input name="razaoSocial" value={form.razaoSocial || ""} onChange={handleChange} disabled={!editando} />
                </div>

                <div className="input-group">
                  <label>CNPJ</label>
                  <input name="cnpj" value={form.cnpj || ""} onChange={handleChange} disabled={!editando} />
                </div>
              </>
            )}

            <div className="input-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input name="senha" type="password" value={form.senha} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone || ""} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>CEP</label>
              <input name="cep" value={form.cep} onChange={handleChange} onBlur={editando ? buscarCep : undefined} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Rua</label>
              <input name="rua" value={form.rua} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Número</label>
              <input name="numero" value={form.numero} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Bairro</label>
              <input name="bairro" value={form.bairro} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} disabled={!editando} />
            </div>

            <div className="input-group">
              <label>Estado</label>
              <input name="estado" value={form.estado} onChange={handleChange} disabled={!editando} />
            </div>
          </div>

          {editando && (
            <button className="perfil-save-btn" type="submit">
              Salvar Alterações
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

export default Perfil;