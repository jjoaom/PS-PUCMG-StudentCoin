import { LoginForm } from "../login-form";

function Login() {
  return (
    <main className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-left">
          <span className="badge">Acesso à plataforma</span>

          <h1>
            Bem-vindo ao <span>StudentCoin</span>
          </h1>

          <p>
            Entre na plataforma para acessar suas moedas estudantis,
            benefícios e histórico de transações.
          </p>
        </div>

        <div className="auth-right">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

export default Login;