import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

type TipoUsuario = "ALUNO" | "PROFESSOR" | "EMPRESA";

type UsuarioLogado = {
  id: string;
  tipo: TipoUsuario;
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    carregarUsuario();
  }, [location.pathname]);

  function carregarUsuario() {
    const id = localStorage.getItem("userId");

    const tipoSalvo = localStorage.getItem("userType");

    console.log("ID salvo:", id);
    console.log("Tipo salvo:", tipoSalvo);

    if (!id || !tipoSalvo) {
      setUsuarioLogado(null);
      return;
    }

    const tipo = tipoSalvo.toUpperCase();

    if (tipo !== "ALUNO" && tipo !== "PROFESSOR" && tipo !== "EMPRESA") {
      setUsuarioLogado(null);
      return;
    }

    setUsuarioLogado({
      id,
      tipo,
    });
  }

  function sair() {
    localStorage.removeItem("nextstep_user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("token");

    setUsuarioLogado(null);
    navigate("/Login");
  }

  function renderLinksPorTipo() {
    if (!usuarioLogado) {
      return (
        <>
          <Link to="/sobre">Sobre</Link>
          <Link to="/beneficios">Benefícios</Link>
          <Link to="/empresas-parceiras">Empresas Parceiras</Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "ALUNO") {
      return (
        <>
          <Link to="/perfil">Perfil</Link>
          <Link to="/beneficios">Benefícios</Link>
          <Link to="/extrato">Extrato</Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "PROFESSOR") {
      return (
        <>
          <Link to="/perfil">Perfil</Link>
          <Link to="/alunos">Alunos</Link>
          <Link to="/extrato">Extrato</Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "EMPRESA") {
      return (
        <>
          <Link to="/perfil">Perfil</Link>
          <Link to="/gerenciar-beneficios">Gerenciar Benefícios</Link>
        </>
      );
    }

    return null;
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        💎 StudentCoin
      </Link>

      <nav className={usuarioLogado ? "nav-logado" : "nav-publico"}>
        {renderLinksPorTipo()}
      </nav>

      <div className="nav-actions">
        {!usuarioLogado ? (
          <>
            <Link to="/Login">
              <button className="secondary-button">Login</button>
            </Link>

            <Link to="/Cadastro">
              <button className="primary-button">Cadastre-se</button>
            </Link>
          </>
        ) : (
          <button className="secondary-button" onClick={sair}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}