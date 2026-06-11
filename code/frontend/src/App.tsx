import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import Header from "./components/pages/Header";
import Login from "./components/pages/Login";
import CadastroAluno from "./components/pages/CadastroAluno/CadastroAluno";
import CadastroEmpresa from "./components/pages/CadastroEmpresa/CadastroEmpresa";
import Cadastro from "./components/pages/Cadastro/Cadastro";
import Perfil from "./components/pages/Perfil/Perfil"
import GerenciarBeneficios from "./components/pages/GerenciarBeneficios/GerenciarBeneficios";
import Beneficios from "./components/pages/Beneficios/Beneficios";
import Cupons from "./components/pages/Cupons/Cupons";
import Alunos from "./components/pages/Alunos/Alunos";
import Extrato from "./components/pages/Extrato/Extrato";
import Sobre from "./components/pages/Sobre/Sobre";
import EmpresasParceiras from "./components/pages/EmpresasParceiras/EmpresasParceiras";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CadastroAluno" element={<CadastroAluno />} />
          <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/gerenciar-beneficios" element={<GerenciarBeneficios />} />
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/meus-cupons" element={<Cupons />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/extrato" element={<Extrato />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/empresas-parceiras" element={<EmpresasParceiras />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
