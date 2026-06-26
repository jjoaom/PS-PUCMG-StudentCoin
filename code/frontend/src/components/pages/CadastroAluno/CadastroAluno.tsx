import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { IMaskInput } from "react-imask";
import "./CadastroAluno.css";

type Instituicao = {
  id: number;
  nome: string;
};

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

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  useEffect(() => {
    fetch("/api/instituicoes")
      .then((res) => res.json())
      .then((data) => setInstituicoes(Array.isArray(data) ? data : []))
      .catch(() => setInstituicoes([]));
  }, []);

  function limparMascara(value: string) {
    return value.replace(/\D/g, "");
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function atualizarCampo(campo: keyof FormAluno, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function handleTelefoneDispatch(appended: string, dynamicMasked: any) {
    const numeros = `${dynamicMasked.unmaskedValue}${appended}`.replace(
      /\D/g,
      ""
    );

    return dynamicMasked.compiledMasks[numeros.length > 10 ? 1 : 0];
  }

  async function buscarCep() {
    const cepLimpo = limparMascara(form.cep);

    if (!cepLimpo || cepLimpo.length !== 8) {
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
        cpf: limparMascara(form.cpf),
        rg: limparMascara(form.rg),
        telefone: limparMascara(form.telefone),
        cep: limparMascara(form.cep),
        instituicaoId: Number(form.instituicaoId),
      };

      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        alert(dados?.erro || dados?.message || "Erro ao cadastrar aluno");
        return;
      }

      alert("Aluno cadastrado com sucesso!");

      setForm({
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

              <IMaskInput
                name="cpf"
                value={form.cpf}
                onAccept={(value: string) => atualizarCampo("cpf", value)}
                mask="000.000.000-00"
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>RG</label>

              <IMaskInput
                name="rg"
                value={form.rg}
                onAccept={(value: string) => atualizarCampo("rg", value)}
                mask="00.000.000"
                placeholder="00.000.000"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Telefone</label>

              <IMaskInput
                name="telefone"
                value={form.telefone}
                onAccept={(value: string) => atualizarCampo("telefone", value)}
                mask={[
                  { mask: "(00) 0000-0000" },
                  { mask: "(00) 00000-0000" },
                ]}
                dispatch={handleTelefoneDispatch}
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
                {instituicoes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nome}
                  </option>
                ))}
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

              <IMaskInput
                name="cep"
                value={form.cep}
                onAccept={(value: string) => atualizarCampo("cep", value)}
                onBlur={buscarCep}
                mask="00000-000"
                placeholder="00000-000"
                required
              />

              {loadingCep && (
                <span className="cep-loading">Buscando CEP...</span>
              )}
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
                maxLength={2}
                required
              />
            </div>
          </div>

          <button
            className="student-register-button"
            type="submit"
            disabled={loadingCadastro}
          >
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