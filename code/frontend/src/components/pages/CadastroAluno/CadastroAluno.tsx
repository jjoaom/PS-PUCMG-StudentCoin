import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
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

export default function CadastroAluno() {
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
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function buscarCep() {
    const cepLimpo = form.cep.replace(/\D/g, "");

    if (!cepLimpo) return;

    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    try {
      setLoadingCep(true);

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
    } finally {
      setLoadingCep(false);
    }
  }

  async function cadastrarAluno(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    setLoadingCadastro(true);

    const body = {
      ...form,
      instituicaoId: Number(form.instituicaoId),
    };

    console.log("Enviando aluno:", body);

    const resposta = await fetch("/api/alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const texto = await resposta.text();

    let dados: any = null;

    try {
      dados = texto ? JSON.parse(texto) : null;
    } catch {
      dados = texto;
    }

    console.log("Status:", resposta.status);
    console.log("Resposta do backend:", dados);

    if (!resposta.ok) {
      const mensagem =
        dados?.erro ||
        dados?.message ||
        "Erro ao cadastrar aluno";

      alert(mensagem);
      return;
    }

    alert("Aluno cadastrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao conectar com o backend:", erro);
    alert("Erro ao conectar com o backend");
  } finally {
    setLoadingCadastro(false);
  }
}

  return (
    <main className="student-register-page">
      <section className="student-register-shell glass-card">
        <div className="student-register-intro">
          <span className="badge">Cadastro de aluno</span>

          <h1>
            Crie sua conta e comece a ganhar <span>StudentCoins.</span>
          </h1>

          <p>
            Cadastre seus dados acadêmicos para participar do sistema de moeda
            estudantil, acompanhar saldo, extrato e resgatar benefícios.
          </p>

          <div className="register-benefits">
            <div>
              <strong>01</strong>
              <span>Receba moedas por reconhecimento acadêmico.</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Troque moedas por benefícios de empresas parceiras.</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Acompanhe saldo e transações em tempo real.</span>
            </div>
          </div>
        </div>

        <form onSubmit={cadastrarAluno} className="student-register-form">
          <div className="form-section-title">
            <h2>Dados do aluno</h2>
            <p>Preencha as informações abaixo.</p>
          </div>

          <div className="modern-form-grid">
            <div className="modern-input-group full">
              <label>Nome completo</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seuemail@gmail.com"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Crie uma senha"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>CPF</label>
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>RG</label>
              <input
                name="rg"
                value={form.rg}
                onChange={handleChange}
                placeholder="Digite seu RG"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Telefone</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(31) 99999-9999"
              />
            </div>

            <div className="modern-input-group">
              <label>Curso</label>
              <input
                name="curso"
                value={form.curso}
                onChange={handleChange}
                placeholder="Engenharia de Software"
                required
              />
            </div>

            <div className="modern-input-group full">
              <label>Instituição</label>
              <select
                name="instituicaoId"
                value={form.instituicaoId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a instituição</option>
                <option value="1">PUC Minas</option>
                <option value="2">UFMG</option>
                <option value="3">CEFET-MG</option>
                <option value="4">UNA</option>
                <option value="5">FUMEC</option>
              </select>
            </div>
          </div>

          <div className="form-section-title spacing">
            <h2>Endereço</h2>
            <p>O CEP pode preencher parte do endereço automaticamente.</p>
          </div>

          <div className="modern-form-grid">
            <div className="modern-input-group">
              <label>CEP</label>
              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={buscarCep}
                placeholder="00000-000"
                required
              />
              {loadingCep && <span className="cep-loading">Buscando CEP...</span>}
            </div>

            <div className="modern-input-group">
              <label>Rua</label>
              <input
                name="rua"
                value={form.rua}
                onChange={handleChange}
                placeholder="Rua / Avenida"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Número</label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Bairro</label>
              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Cidade</label>
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Estado</label>
              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="UF"
                required
              />
            </div>
          </div>

          <button className="student-register-button" type="submit" disabled={loadingCadastro}>
            {loadingCadastro ? "Cadastrando..." : "Cadastrar Aluno"}
          </button>

          <p className="register-login-link">
            Já tem conta? <Link to="/Login">Entrar agora</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

