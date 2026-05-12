import { useState, type ChangeEvent, type FormEvent } from "react";
import "./CadastroAluno.css";

type FormAluno = {
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
};

function CadastroAluno() {
  const [form, setForm] = useState<FormAluno>({
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
  });

  const [loadingCep, setLoadingCep] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function buscarCep() {
    const cepLimpo = form.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    try {
      setLoadingCep(true);

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

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
    } finally {
      setLoadingCep(false);
    }
  }

  async function cadastrarAluno(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:8080/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          instituicaoId: Number(form.instituicaoId),
        }),
      });

      if (!resposta.ok) {
        alert("Erro ao cadastrar aluno");
        return;
      }

      alert("Aluno cadastrado com sucesso!");
    } catch {
      alert("Erro ao conectar com o backend");
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">
        <h1>Cadastro de Aluno</h1>
        <p>Preencha seus dados para participar do sistema de moeda estudantil.</p>

        <form onSubmit= {cadastrarAluno}>
          <div className="form-grid">
            <div className="input-group">
              <label>Nome completo</label>
              <input name="nome" value={form.nome} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input name="senha" type="password" value={form.senha} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>RG</label>
              <input name="rg" value={form.rg} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>CEP</label>
              <input name="cep" value={form.cep} onChange={handleChange} onBlur={buscarCep} required />
              {loadingCep && <span className="cep-loading">Buscando CEP...</span>}
            </div>

            <div className="input-group">
              <label>Rua</label>
              <input name="rua" value={form.rua} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Número</label>
              <input name="numero" value={form.numero} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Bairro</label>
              <input name="bairro" value={form.bairro} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Estado</label>
              <input name="estado" value={form.estado} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Curso</label>
              <input name="curso" value={form.curso} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Instituição</label>
              <select name="instituicaoId" value={form.instituicaoId} onChange={handleChange} required>
                <option value="">Selecione a instituição</option>
                <option value="1">PUC Minas</option>
                <option value="2">UFMG</option>
                <option value="3">CEFET-MG</option>
                <option value="4">UNA</option>
                <option value="5">FUMEC</option>
              </select>
            </div>
          </div>

          <button className="cadastro-button" type="submit">
            Cadastrar Aluno
          </button>
        </form>
      </section>
    </main>
  );
}

export default CadastroAluno;