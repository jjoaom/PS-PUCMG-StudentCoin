import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./Perfil.css";

type TipoUsuario = "ALUNO" | "EMPRESA" | "PROFESSOR";

type PerfilForm = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  rg: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  curso: string;
  instituicaoId: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  departamento: string;
  saldoMoedas: string;
};

export default function Perfil() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("ALUNO");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<PerfilForm>({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    rg: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    curso: "",
    instituicaoId: "",
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    departamento: "",
    saldoMoedas: "",
  });

  const userId = localStorage.getItem("userId");

  function descobrirTipoUsuario(): TipoUsuario {
    const tipo =
      localStorage.getItem("tipoUsuario") ||
      localStorage.getItem("userType") ||
      localStorage.getItem("role") ||
      localStorage.getItem("accessType") ||
      "";

    const tipoUpper = tipo.toUpperCase();

    if (tipoUpper.includes("PROFESSOR")) {
      return "PROFESSOR";
    }

    if (tipoUpper.includes("EMPRESA")) {
      return "EMPRESA";
    }

    return "ALUNO";
  }

  function endpointBase(tipo: TipoUsuario) {
    if (tipo === "EMPRESA") {
      return "/api/empresa";
    }

    if (tipo === "PROFESSOR") {
      return "/api/professor";
    }

    return "/api/alunos";
  }

  useEffect(() => {
    async function carregarPerfil() {
      try {
        if (!userId) {
          alert("Usuário não encontrado no localStorage.");
          return;
        }

        const tipo = descobrirTipoUsuario();
        setTipoUsuario(tipo);

        const resposta = await fetch(`${endpointBase(tipo)}/${userId}`);

        if (!resposta.ok) {
          const erro = await resposta.json().catch(() => null);
          alert(erro?.erro || "Erro ao carregar perfil.");
          return;
        }

        const dados = await resposta.json();

        setForm((prev) => ({
          ...prev,
          nome: dados.nome || dados.name || "",
          email: dados.email || "",
          cpf: dados.cpf || "",
          rg: dados.rg || "",
          telefone: dados.telefone || "",
          cep: dados.cep || "",
          rua: dados.rua || "",
          numero: dados.numero || "",
          bairro: dados.bairro || "",
          cidade: dados.cidade || "",
          estado: dados.estado || "",
          curso: dados.curso || "",
          instituicaoId: String(dados.instituicaoId || ""),
          nomeFantasia: dados.nomeFantasia || "",
          razaoSocial: dados.razaoSocial || "",
          cnpj: dados.cnpj || "",
          departamento: dados.departamento || "",
          saldoMoedas: String(dados.saldoMoedas ?? ""),
        }));
      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o backend.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [userId]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function salvarPerfil(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      alert("Usuário não encontrado.");
      return;
    }

    try {
      setSalvando(true);

      const payload =
        tipoUsuario === "EMPRESA"
          ? {
              nomeFantasia: form.nomeFantasia,
              razaoSocial: form.razaoSocial,
              cnpj: form.cnpj,
              email: form.email,
              senha: form.senha || undefined,
              telefone: form.telefone,
              cep: form.cep,
              rua: form.rua,
              numero: form.numero,
              bairro: form.bairro,
              cidade: form.cidade,
              estado: form.estado,
            }
          : tipoUsuario === "PROFESSOR"
          ? {
              name: form.nome,
              email: form.email,
              password: form.senha || undefined,
              cpf: form.cpf,
              departamento: form.departamento,
            }
          : {
              nome: form.nome,
              email: form.email,
              senha: form.senha || undefined,
              cpf: form.cpf,
              rg: form.rg,
              telefone: form.telefone,
              cep: form.cep,
              rua: form.rua,
              numero: form.numero,
              bairro: form.bairro,
              cidade: form.cidade,
              estado: form.estado,
              curso: form.curso,
              instituicaoId: Number(form.instituicaoId),
            };

      const resposta = await fetch(`${endpointBase(tipoUsuario)}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => null);
        alert(erro?.erro || "Erro ao salvar perfil.");
        return;
      }

      localStorage.setItem("userName", form.nome);
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("userType", tipoUsuario);
      localStorage.setItem("role", tipoUsuario);

      alert("Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <h1>Carregando perfil...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <div>
            <span className="badge">
              {tipoUsuario === "EMPRESA"
                ? "Empresa Parceira"
                : tipoUsuario === "PROFESSOR"
                ? "Professor"
                : "Aluno"}
            </span>

            <h1>Meu Perfil</h1>
            <p>Visualize e edite suas informações cadastradas.</p>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => setEditando((prev) => !prev)}
          >
            {editando ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        <form onSubmit={salvarPerfil} className="profile-form">
          <div className="modern-form-grid">
            {tipoUsuario === "EMPRESA" ? (
              <>
                <div className="modern-input-group">
                  <label>Nome Fantasia</label>
                  <input
                    name="nomeFantasia"
                    value={form.nomeFantasia}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Razão Social</label>
                  <input
                    name="razaoSocial"
                    value={form.razaoSocial}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>CNPJ</label>
                  <input
                    name="cnpj"
                    value={form.cnpj}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>
              </>
            ) : tipoUsuario === "PROFESSOR" ? (
              <>
                <div className="modern-input-group">
                  <label>Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Departamento</label>
                  <input
                    name="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Saldo de moedas</label>
                  <input
                    name="saldoMoedas"
                    value={form.saldoMoedas}
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                <div className="modern-input-group">
                  <label>Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>RG</label>
                  <input
                    name="rg"
                    value={form.rg}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Curso</label>
                  <input
                    name="curso"
                    value={form.curso}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Instituição</label>
                  <select
                    name="instituicaoId"
                    value={form.instituicaoId}
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
            )}

            <div className="modern-input-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>

            <div className="modern-input-group">
              <label>Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                disabled={!editando}
                placeholder={editando ? "Digite uma nova senha" : ""}
              />
            </div>

            {tipoUsuario !== "PROFESSOR" && (
              <>
                <div className="modern-input-group">
                  <label>Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>CEP</label>
                  <input
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Rua</label>
                  <input
                    name="rua"
                    value={form.rua}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Número</label>
                  <input
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Bairro</label>
                  <input
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Cidade</label>
                  <input
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="modern-input-group">
                  <label>Estado</label>
                  <input
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>
              </>
            )}
          </div>

          {editando && (
            <button
              className="profile-save-button"
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
          )}
        </form>
      </section>
    </main>
  );
}