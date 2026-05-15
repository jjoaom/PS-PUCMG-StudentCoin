import { useState, type ChangeEvent, type FormEvent } from "react";
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

function CadastroEmpresa() {
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
      const resposta = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!resposta.ok) {
        const erro = await resposta.text();

        console.error(erro);

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
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com o backend");
    }
  }

  return (
    <main className="instituicao-page">
      <section className="instituicao-card">
        <h1>Cadastro de Empresa</h1>

        <p>
          Cadastre sua empresa parceira no sistema StudentCoin.
        </p>

        <form onSubmit={cadastrarEmpresa}>
          <div className="form-grid">
            <div className="input-group">
              <label>Nome Fantasia</label>

              <input
                name="nomeFantasia"
                value={form.nomeFantasia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Razão Social</label>

              <input
                name="razaoSocial"
                value={form.razaoSocial}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>CNPJ</label>

              <input
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group full">
              <label>Senha</label>

              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Telefone</label>

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>CEP</label>

              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={buscarCep}
                required
              />

              {loadingCep && (
                <span className="cep-loading">
                  Buscando CEP...
                </span>
              )}
            </div>

            <div className="input-group">
              <label>Rua</label>

              <input
                name="rua"
                value={form.rua}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Número</label>

              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Bairro</label>

              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Cidade</label>

              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Estado</label>

              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="instituicao-button" type="submit">
            Cadastrar Empresa
          </button>
        </form>
      </section>
    </main>
  );
}

export default CadastroEmpresa;