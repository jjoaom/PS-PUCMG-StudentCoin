import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiInfo, FiGift } from "react-icons/fi";
import { IoDiamond } from "react-icons/io5";
import "./Beneficios.css";

type Vantagem = {
  id: number;
  descricao: string;
  custoMoedas: number;
  detalhes?: string | null;
  ativa: boolean;
  empresaId?: number;
  nomeEmpresa?: string;
};

const BENEFICIOS_MOCK: Vantagem[] = [
  {
    id: 101,
    descricao: "Cupom de R$ 20,00 no Restaurante Universitário",
    custoMoedas: 50,
    detalhes: "Válido para qualquer refeição no self-service do Sabores do Campus.",
    ativa: true,
    nomeEmpresa: "Sabores do Campus"
  },
  {
    id: 102,
    descricao: "Desconto de 50% em Livros Didáticos",
    custoMoedas: 100,
    detalhes: "Aplicável a livros universitários selecionados na Livraria Universitária.",
    ativa: true,
    nomeEmpresa: "Livraria Universitária"
  },
  {
    id: 103,
    descricao: "Assinatura Grátis de 3 meses na DevLearn Tech",
    custoMoedas: 250,
    detalhes: "Acesso ilimitado a todos os cursos de desenvolvimento e dados.",
    ativa: true,
    nomeEmpresa: "DevLearn Tech"
  },
  {
    id: 104,
    descricao: "Ingresso Cortesia para o Startup Challenge",
    custoMoedas: 90,
    detalhes: "Garante entrada e certificado de participação no evento anual do Hub.",
    ativa: true,
    nomeEmpresa: "Inova PUCMG Hub"
  },
  {
    id: 105,
    descricao: "Copo Térmico Personalizado StudentCoin",
    custoMoedas: 150,
    detalhes: "Retirada presencial no Bloco I do campus mediante apresentação do cupom.",
    ativa: true,
    nomeEmpresa: "Brindes Express"
  },
  {
    id: 106,
    descricao: "Assinatura de 2 meses Premium no SoundStream",
    custoMoedas: 120,
    detalhes: "Curta suas playlists sem anúncios no SoundStream.",
    ativa: true,
    nomeEmpresa: "SoundStream"
  }
];

export default function Beneficios() {
  const [beneficios, setBeneficios] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [selecionado, setSelecionado] = useState<Vantagem | null>(null);

  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  const isAluno = userType === "ALUNO";

  useEffect(() => {
    if (isAluno) {
      carregarBeneficios();
    } else {
      setBeneficios(BENEFICIOS_MOCK);
    }
  }, [isAluno]);

  function getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function carregarBeneficios() {
    setErro(null);

    try {
      setLoading(true);

      const resposta = await fetch("/api/vantagem", {
        headers: getHeaders(),
      });

      const data = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(data?.erro || data?.message || "Erro ao carregar benefícios.");
        return;
      }

      const lista = Array.isArray(data) ? data : [];

      const beneficiosAtivos = lista.filter(
        (beneficio: Vantagem) => beneficio.ativa !== false
      );

      setBeneficios(beneficiosAtivos.length > 0 ? beneficiosAtivos : BENEFICIOS_MOCK);
    } catch (error) {
      console.error(error);
      // Fallback para mock caso dê erro de conexão
      setBeneficios(BENEFICIOS_MOCK);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalResgate(beneficio: Vantagem) {
    setSelecionado(beneficio);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setSelecionado(null);
  }

  return (
    <main className="beneficios-page">
      {!isAluno && (
        <div className="preview-banner glass-card">
          <FiInfo className="preview-banner-icon" />
          <div className="preview-banner-content">
            <strong>Modo de Visualização pública</strong>
            <p>
              Esta página exibe benefícios de demonstração. 
              Para resgatar de verdade, <Link to="/Login" className="coin-text">faça login</Link> ou 
              <Link to="/Cadastro" className="coin-text"> cadastre-se</Link> como Aluno.
            </p>
          </div>
        </div>
      )}

      <section className="beneficios-hero glass-card">
        <div>
          <span className="badge">StudentCoin</span>

          <h1>
            Benefícios <span>disponíveis</span>
          </h1>

          <p>
            Veja as vantagens oferecidas pelas empresas parceiras do
            StudentCoin.
          </p>
        </div>

        {isAluno && (
          <button onClick={carregarBeneficios} className="beneficios-refresh primary-button" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiRefreshCw /> Atualizar
          </button>
        )}
      </section>

      <section className="beneficios-list glass-card">
        <div className="beneficios-list-header">
          <div>
            <span className="badge">Vantagens</span>
            <h2>Lista de benefícios</h2>
          </div>
        </div>

        {erro && <p className="beneficios-message error">{erro}</p>}

        {loading ? (
          <p className="beneficios-empty">Carregando benefícios...</p>
        ) : beneficios.length === 0 ? (
          <p className="beneficios-empty">
            Nenhum benefício disponível no momento.
          </p>
        ) : (
          <div className="beneficios-grid">
            {beneficios.map((beneficio) => (
              <article key={beneficio.id} className="beneficio-card">
                <div className="beneficio-card-top">
                  <span className="beneficio-status">
                    <FiGift style={{ marginRight: "4px" }} />
                    {beneficio.nomeEmpresa || "Empresa Parceira"}
                  </span>
                  <strong>
                    <IoDiamond style={{ marginRight: "4px", color: "var(--color-primary)" }} />
                    {beneficio.custoMoedas} moedas
                  </strong>
                </div>

                <h3>{beneficio.descricao}</h3>

                <p>
                  {beneficio.detalhes ||
                    "Sem detalhes adicionais cadastrados."}
                </p>

                <button onClick={() => abrirModalResgate(beneficio)} className="primary-button" style={{ width: "100%", marginTop: "auto" }}>
                  Resgatar benefício
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>
              ×
            </button>

            {isAluno ? (
              <>
                <div className="modal-image-box">
                  <img
                    src="/cachorro-pedreiro.png"
                    alt="Estamos trabalhando nisso"
                  />
                </div>

                <h2>Estamos trabalhando nisso!</h2>

                <p>
                  A funcionalidade de resgate para o benefício <strong>"{selecionado?.descricao}"</strong> ainda está em desenvolvimento.
                </p>

                <button className="modal-action primary-button" onClick={fecharModal}>
                  Entendi
                </button>
              </>
            ) : (
              <>
                <div className="modal-icon-box" style={{ fontSize: "3rem", color: "var(--color-primary)", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <IoDiamond />
                </div>

                <h2>Quer resgatar este benefício?</h2>

                <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
                  Você precisa entrar em uma conta do tipo <strong>Aluno</strong> para resgatar <strong>"{selecionado?.descricao}"</strong> por <strong>{selecionado?.custoMoedas} StudentCoins</strong>.
                </p>

                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <Link to="/Login" style={{ flex: 1 }}>
                    <button className="primary-button" style={{ width: "100%" }}>
                      Fazer Login
                    </button>
                  </Link>
                  <button className="secondary-button" style={{ flex: 1 }} onClick={fecharModal}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}