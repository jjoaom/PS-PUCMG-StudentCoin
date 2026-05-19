import { useState } from "react";

import CadastroAluno from "../CadastroAluno/CadastroAluno";
import CadastroEmpresa from "../CadastroEmpresa/CadastroEmpresa";

import "./Cadastro.css";

export default function CadastroPage() {
  const [tipoCadastro, setTipoCadastro] = useState<"aluno" | "empresa">("aluno");

  return (
    <main className="cadastro-page">
      <section className="cadastro-switch-container">
        <div className="cadastro-switch">
          <button
            type="button"
            onClick={() => setTipoCadastro("aluno")}
            className={`cadastro-switch-button ${
              tipoCadastro === "aluno" ? "active" : ""
            }`}
          >
            Aluno
          </button>

          <button
            type="button"
            onClick={() => setTipoCadastro("empresa")}
            className={`cadastro-switch-button ${
              tipoCadastro === "empresa" ? "active" : ""
            }`}
          >
            Empresa
          </button>
        </div>
      </section>

      <section className="cadastro-form-container">
        {tipoCadastro === "aluno" ? <CadastroAluno /> : <CadastroEmpresa />}
      </section>
    </main>
  );
}