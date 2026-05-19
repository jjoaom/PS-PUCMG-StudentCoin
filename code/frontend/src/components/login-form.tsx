import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

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

    return "USUARIO";
  }

  async function fazerLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro(null);
    setLoading(true);

    try {
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
        setErro("Email ou senha inválidos.");
        return;
      }

      const data: LoginResponse = await resposta.json();

      const token = data.accessToken || data.token;
      const user = data.user;

      if (!token || !user) {
        setErro("Resposta de login inválida.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(user.id));
      localStorage.setItem("userName", user.name || user.nome || "");
      localStorage.setItem("userEmail", user.email || "");

      const userType = await descobrirTipoUsuario(user.id, token);

      localStorage.setItem("userType", userType);

      if (userType === "ALUNO") {
        navigate("/");
      } else if (userType === "EMPRESA") {
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
        <span className="login-icon">🔐</span>

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