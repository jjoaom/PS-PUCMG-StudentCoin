import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function fazerLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    try {
      setLoading(true);

      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!resposta.ok) {
        setErro("Email ou senha inválidos.");
        return;
      }

      const data = await resposta.json();
      const { accessToken, user } = data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("userId", String(user.id));
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      if (user.permissions?.includes("ALUNO")) {
        localStorage.setItem("userType", "ALUNO");
        navigate("/aluno/home");
      } else if (user.permissions?.includes("EMPRESA")) {
        localStorage.setItem("userType", "EMPRESA");
        navigate("/empresa/home");
      } else {
        localStorage.setItem("userType", "USUARIO");
        navigate("/");
      }
    } catch {
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
            required
          />
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="login-register">
          Ainda não tem conta?{" "}
          <Link to="/CadastroAluno">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}