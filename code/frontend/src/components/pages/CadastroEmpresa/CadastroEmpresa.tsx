import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "./CadastroEmpresa.css";

type FormEmpresa = {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  senha: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function CadastroEmpresa() {
  const [form, setForm] = useState<FormEmpresa>({
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    email: "",
    senha: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  const API = "/api/empresa";

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
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

  async function cadastrarEmpresa(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoadingCadastro(true);

      const resposta = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!resposta.ok) {
        alert("Erro ao cadastrar empresa");
        return;
      }

      alert("Empresa cadastrada com sucesso!");

      setForm({
        nomeFantasia: "",
        razaoSocial: "",
        cnpj: "",
        email: "",
        senha: "",
        telefone: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
    } catch {
      alert("Erro ao conectar com o backend");
    } finally {
      setLoadingCadastro(false);
    }
  }

  return (
    <main className="company-register-page">
      <section className="company-register-shell glass-card">
        <div className="company-register-intro">
          <span className="badge">Empresa Parceira</span>

          <h1>
            Conecte sua empresa ao <span>StudentCoin.</span>
          </h1>

          <p>
            Ofereça benefícios exclusivos para estudantes e fortaleça sua marca
            dentro do ecossistema acadêmico digital.
          </p>

          <div className="company-benefits">
            <div>
              <strong>01</strong>
              <span>Cadastre vantagens e cupons exclusivos.</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Ganhe visibilidade para milhares de estudantes.</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Participe de uma rede moderna de incentivo acadêmico.</span>
            </div>
          </div>
        </div>

        <form onSubmit={cadastrarEmpresa} className="company-register-form">
          <div className="form-section-title">
            <h2>Dados da empresa</h2>
            <p>Preencha as informações da empresa parceira.</p>
          </div>

          <div className="modern-form-grid">
            <div className="modern-input-group">
              <label>Nome Fantasia</label>

              <input
                name="nomeFantasia"
                value={form.nomeFantasia}
                onChange={handleChange}
                placeholder="Digite o nome fantasia"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Razão Social</label>

              <input
                name="razaoSocial"
                value={form.razaoSocial}
                onChange={handleChange}
                placeholder="Digite a razão social"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>CNPJ</label>

              <input
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="empresa@email.com"
                required
              />
            </div>

            <div className="modern-input-group">
              <label>Senha</label>

              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Crie uma senha"
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
                required
              />
            </div>
          </div>

          <div className="form-section-title spacing">
            <h2>Endereço</h2>
            <p>O CEP pode preencher os campos automaticamente.</p>
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

              {loadingCep && (
                <span className="cep-loading">
                  Buscando CEP...
                </span>
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
                required
              />
            </div>
          </div>

          <button
            className="student-register-button"
            type="submit"
            disabled={loadingCadastro}
          >
            {loadingCadastro
              ? "Cadastrando..."
              : "Cadastrar Empresa"}
          </button>

          <p className="register-login-link">
            Já possui conta?{" "}
            <Link to="/Login">Entrar agora</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

