import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./Perfil.css";

type TipoUsuario = "ALUNO" | "PROFESSOR" | "EMPRESA";

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

  departamento: string;

  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;

  saldo: string;
};



export default function Perfil() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);

  const [tipoUsuario, setTipoUsuario] =
    useState<TipoUsuario>("ALUNO");

  const [userId, setUserId] = useState<number | null>(null);

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

    departamento: "",

    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",

    saldo: "",
  });

  function endpointBase(tipo: TipoUsuario) {
    switch (tipo) {
      case "PROFESSOR":
        return "/api/professor";

      case "EMPRESA":
        return "/api/empresa";

      default:
        return "/api/alunos";
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Usuário não autenticado.");
          return;
        }

        // 1. Buscar usuário autenticado
        const idSalvo = localStorage.getItem("userId");
        const tipoSalvo = localStorage.getItem("userType") as TipoUsuario | null;

        if (!idSalvo || !tipoSalvo) {
          alert("Usuário não autenticado.");
          return;
        }

        setTipoUsuario(tipoSalvo);
        setUserId(Number(idSalvo));

        // 2. Buscar perfil completo
        const perfilResponse = await fetch(
          `${endpointBase(tipoSalvo)}/${idSalvo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!perfilResponse.ok) {
          alert("Erro ao carregar perfil.");
          return;
        }

        const dados = await perfilResponse.json();

        setForm({
          nome: dados.name || "",
          email: dados.email || "",
          senha: "",

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
          instituicaoId: String(dados.instituicao?.id ?? dados.instituicaoId ?? ""),

          departamento: dados.departamento || "",

          nomeFantasia: dados.nomeFantasia || "",
          razaoSocial: dados.razaoSocial || "",
          cnpj: dados.cnpj || "",

          saldo: String(dados.carteira?.saldo ?? 0),
        });
      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com backend.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  async function salvarPerfil(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      alert("Usuário inválido.");
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("token");

      const payload =
        tipoUsuario === "PROFESSOR"
          ? {
              name: form.nome,
              email: form.email,
              password: form.senha || undefined,
              cpf: form.cpf,
              departamento: form.departamento,
            }
          : tipoUsuario === "EMPRESA"
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

      const response = await fetch(
        `${endpointBase(tipoUsuario)}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const erro = await response.json().catch(() => null);

        alert(erro?.erro || "Erro ao salvar perfil.");
        return;
      }

      alert("Perfil atualizado com sucesso.");

      setEditando(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar perfil.");
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
            <span className="badge">{tipoUsuario}</span>

            <h1>Meu Perfil</h1>
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

            {(tipoUsuario === "ALUNO" ||
              tipoUsuario === "PROFESSOR") && (
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
              </>
            )}

            {tipoUsuario === "ALUNO" && (
              <>
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
              </>
            )}

            {tipoUsuario === "PROFESSOR" && (
              <>
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
                  <label>Saldo</label>

                  <input
                    value={form.saldo}
                    disabled
                  />
                </div>
              </>
            )}

            {tipoUsuario === "EMPRESA" && (
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
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
          </div>

          {editando && (
            <button
              className="profile-save-button"
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          )}
        </form>
      </section>
    </main>
  );
}