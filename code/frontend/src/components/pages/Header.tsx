import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        💎 StudentCoin
      </Link>

      <nav>
        <a href="#">Sobre</a>
        <a href="#">Benefícios</a>
        <a href="#">Empresas Parceiras</a>
      </nav>

      <div className="nav-actions">
        <Link to="/Login">
          <button className="secondary-button">
            Login
          </button>
        </Link>

        <Link to="/Cadastro">
          <button className="primary-button">
            Cadastre-se
          </button>
        </Link>
      </div>
    </header>
  );
}