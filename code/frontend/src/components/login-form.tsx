import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

type LoginResponse = {
  accessToken?: string;
  token?: string;
  user: {
    id: number;
    name?: string;
    nome?: string;
    email: string;
  };
};

type ProfessorResponse = {
  id: number;
  name?: string;
  nome?: string;
  email: string;
  cpf?: string;
  departamento?: string;
  saldoMoedas?: number;
};

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function descobrirTipoUsuario(userId: number, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const aluno = await fetch(`/api/alunos/${userId}`, { headers });

    if (aluno.ok) {
      return "ALUNO";
    }

    const empresa = await fetch(`/api/empresa/${userId}`, { headers });

    if (empresa.ok) {
      return "EMPRESA";
    }

    const professor = await fetch(`/api/professor/${userId}`, { headers });

    if (professor.ok) {
      return "PROFESSOR";
    }

    return "EMPRESA";
  }

  async function tentarLoginGeral() {
    const resposta = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: senha,
      }),
    });

    if (!resposta.ok) {
      return null;
    }

    const data: LoginResponse = await resposta.json();

    const token = data.accessToken || data.token;
    const user = data.user;

    if (!token || !user) {
      return null;
    }

    const userType = await descobrirTipoUsuario(user.id, token);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", String(user.id));
    localStorage.setItem("userName", user.name || user.nome || "");
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userType", userType);

    return userType;
  }

  async function tentarLoginProfessor() {
    const resposta = await fetch("/api/professor/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: senha,
      }),
    });

    if (!resposta.ok) {
      return null;
    }

    const professor: ProfessorResponse = await resposta.json();

    localStorage.setItem("userId", String(professor.id));
    localStorage.setItem("userName", professor.name || professor.nome || "");
    localStorage.setItem("userEmail", professor.email || "");
    localStorage.setItem("userType", "PROFESSOR");

    localStorage.removeItem("token");

    return "PROFESSOR";
  }

  async function fazerLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro(null);
    setLoading(true);

    try {
      let userType = await tentarLoginGeral();

      if (!userType) {
        userType = await tentarLoginProfessor();
      }

      if (!userType) {
        setErro("Email ou senha inválidos.");
        return;
      }

      if (userType === "ALUNO") {
        navigate("/");
      } else if (userType === "EMPRESA") {
        navigate("/");
      } else if (userType === "PROFESSOR") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-form-card">
      <div className="login-form-header">
        <span className="login-icon">
          <FiLock style={{ color: "var(--color-primary)" }} />
        </span>

        <div>
          <h2>Entrar na conta</h2>
          <p>Informe seus dados para acessar o sistema.</p>
        </div>
      </div>

      <form onSubmit={fazerLogin} className="login-form">
        <div className="form-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="seuemail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="senha">Senha</label>

          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="login-register">
          Ainda não tem conta? <Link to="/Cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}