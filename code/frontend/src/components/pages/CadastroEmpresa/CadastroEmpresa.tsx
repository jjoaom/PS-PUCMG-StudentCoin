import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { IMaskInput } from "react-imask";
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

  const limpar = (v: string) => v.replace(/\D/g, "");

  const setCampo = (campo: keyof FormEmpresa, valor: string) => {
    setForm((p) => ({ ...p, [campo]: valor }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCampo(e.target.name as keyof FormEmpresa, e.target.value);
  };

  const handleTelefoneDispatch = (appended: string, dynamicMasked: any) => {
    const numeros = `${dynamicMasked.unmaskedValue}${appended}`.replace(
      /\D/g,
      ""
    );

    return dynamicMasked.compiledMasks[numeros.length > 10 ? 1 : 0];
  };

  async function buscarCep() {
    const cep = limpar(form.cep);
    if (cep.length !== 8) return alert("CEP inválido");

    try {
      setLoadingCep(true);

      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) return alert("CEP não encontrado");

      setForm((p) => ({
        ...p,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } finally {
      setLoadingCep(false);
    }
  }

  async function cadastrar(e: FormEvent) {
    e.preventDefault();

    try {
      setLoadingCadastro(true);

      const body = {
        ...form,
        cnpj: limpar(form.cnpj),
        telefone: limpar(form.telefone),
        cep: limpar(form.cep),
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return alert(data?.erro || data?.message || "Erro ao cadastrar");
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

        <form onSubmit={cadastrar} className="company-register-form">
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

              <IMaskInput
                name="cnpj"
                value={form.cnpj}
                onAccept={(v: string) => setCampo("cnpj", v)}
                mask="00.000.000/0000-00"
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

              <IMaskInput
                name="telefone"
                value={form.telefone}
                onAccept={(v: string) => setCampo("telefone", v)}
                mask={[
                  { mask: "(00) 0000-0000" },
                  { mask: "(00) 00000-0000" },
                ]}
                dispatch={handleTelefoneDispatch}
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

              <IMaskInput
                name="cep"
                value={form.cep}
                onAccept={(v: string) => setCampo("cep", v)}
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

          <button className="student-register-button" disabled={loadingCadastro}>
            {loadingCadastro ? "Cadastrando..." : "Cadastrar Empresa"}
          </button>

          <p className="register-login-link">
            Já possui conta? <Link to="/Login">Entrar agora</Link>
          </p>
        </form>
      </section>
    </main>
  );
}