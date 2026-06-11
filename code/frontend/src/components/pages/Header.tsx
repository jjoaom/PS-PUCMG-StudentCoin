import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  FiInfo, 
  FiGift, 
  FiBriefcase, 
  FiUser, 
  FiFileText, 
  FiUsers, 
  FiSliders, 
  FiLogIn, 
  FiUserPlus, 
  FiLogOut,
  FiTag
} from "react-icons/fi";
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
          <Link to="/sobre" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiInfo /> Sobre
          </Link>
          <Link to="/beneficios" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiGift /> Benefícios
          </Link>
          <Link to="/empresas-parceiras" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiBriefcase /> Empresas Parceiras
          </Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "ALUNO") {
      return (
        <>
          <Link to="/perfil" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiUser /> Perfil
          </Link>
          <Link to="/beneficios" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiGift /> Benefícios
          </Link>
          <Link to="/meus-cupons" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiTag /> Meus Cupons
          </Link>
          <Link to="/extrato" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiFileText /> Extrato
          </Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "PROFESSOR") {
      return (
        <>
          <Link to="/perfil" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiUser /> Perfil
          </Link>
          <Link to="/alunos" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiUsers /> Alunos
          </Link>
          <Link to="/extrato" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiFileText /> Extrato
          </Link>
        </>
      );
    }

    if (usuarioLogado.tipo === "EMPRESA") {
      return (
        <>
          <Link to="/perfil" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiUser /> Perfil
          </Link>
          <Link to="/gerenciar-beneficios" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FiSliders /> Gerenciar Benefícios
          </Link>
        </>
      );
    }

    return null;
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <img 
          src="/logo.png" 
          alt="StudentCoin Logo" 
          className="logo-img" 
          style={{ 
            height: "72px", 
            width: "128px", 
            aspectRatio: "16/9", 
            objectFit: "contain", 
            display: "block" 
          }} 
        />
      </Link>

      <nav className={usuarioLogado ? "nav-logado" : "nav-publico"}>
        {renderLinksPorTipo()}
      </nav>

      <div className="nav-actions">
        {!usuarioLogado ? (
          <>
            <Link to="/Login">
              <button className="secondary-button" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <FiLogIn /> Login
              </button>
            </Link>

            <Link to="/Cadastro">
              <button className="primary-button" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <FiUserPlus /> Cadastre-se
              </button>
            </Link>
          </>
        ) : (
          <button className="secondary-button" onClick={sair} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <FiLogOut /> Sair
          </button>
        )}
      </div>
    </header>
  );
}