import { FiMapPin, FiPhone, FiMail, FiCheckCircle } from "react-icons/fi";
import { FaBuilding, FaTag } from "react-icons/fa";
import "./EmpresasParceiras.css";

type EmpresaMock = {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  segmento: string;
  descricao: string;
  email: string;
  telefone: string;
  endereco: string;
  vantagens: string[];
};

const EMPRESAS_MOCK: EmpresaMock[] = [
  {
    id: 1,
    nomeFantasia: "Livraria Universitária",
    razaoSocial: "Comércio de Livros Acadêmicos Ltda",
    cnpj: "12.345.678/0001-90",
    segmento: "Educação & Cultura",
    descricao: "Sua fonte principal de livros didáticos, técnicos e artigos de papelaria com descontos exclusivos para estudantes.",
    email: "contato@livrariauni.com.br",
    telefone: "(31) 3244-1020",
    endereco: "Av. dos Estudantes, 150 - Coração Eucarístico, Belo Horizonte - MG",
    vantagens: [
      "10% de desconto em qualquer livro técnico",
      "Kit papelaria básica por 30 moedas",
      "Cupom de R$ 15,00 para compras acima de R$ 50,00"
    ]
  },
  {
    id: 2,
    nomeFantasia: "Sabores do Campus",
    razaoSocial: "Restaurante e Lanchonete Universitária S.A.",
    cnpj: "98.765.432/0001-10",
    segmento: "Alimentação",
    descricao: "Alimentação saudável e rápida dentro e no entorno do campus. O ponto de encontro oficial para seu almoço ou café.",
    email: "gerencia@saboresdocampus.com.br",
    telefone: "(31) 98877-6655",
    endereco: "Praça de Alimentação, Bloco G, Campus Coração Eucarístico - BH",
    vantagens: [
      "Almoço completo (Prato Feito) por 80 moedas",
      "Café expresso + pão de queijo por 25 moedas",
      "15% de desconto no buffet de saladas"
    ]
  },
  {
    id: 3,
    nomeFantasia: "DevLearn Tech",
    razaoSocial: "Plataforma Online de Ensino de Tecnologia Ltda",
    cnpj: "45.678.901/0001-23",
    segmento: "Cursos & Tecnologia",
    descricao: "Cursos online práticos de programação, design, dados e inteligência artificial para acelerar sua carreira.",
    email: "suporte@devlearn.com.br",
    telefone: "0800 700 8090",
    endereco: "Plataforma 100% Online (Acesso Nacional)",
    vantagens: [
      "1 mês de acesso Premium Grátis por 100 moedas",
      "3 meses de assinatura por 220 moedas",
      "Curso específico de Git & GitHub com certificado por 40 moedas"
    ]
  },
  {
    id: 4,
    nomeFantasia: "Inova PUCMG Hub",
    razaoSocial: "Associação de Startups e Inovação Acadêmica",
    cnpj: "32.109.876/0001-54",
    segmento: "Eventos & Carreira",
    descricao: "Hub de inovação que conecta estudantes a mentores do mercado de tecnologia e realiza eventos de empreendedorismo.",
    email: "hub@inovapucmg.org",
    telefone: "(31) 3409-9000",
    endereco: "Prédio da Reitoria, 2º Andar - Belo Horizonte - MG",
    vantagens: [
      "Mentoria individual de carreira (45min) por 150 moedas",
      "Ingresso cortesia para o Startup Challenge por 90 moedas",
      "Manual de preparação para entrevistas de tecnologia por 20 moedas"
    ]
  },
  {
    id: 5,
    nomeFantasia: "SoundStream",
    razaoSocial: "Distribuidora de Streaming Digital Brasil",
    cnpj: "65.432.109/0001-87",
    segmento: "Entretenimento",
    descricao: "Música, podcasts e vídeos sem anúncios para acompanhar suas longas sessões de estudo.",
    email: "universitarios@soundstream.com",
    telefone: "(11) 4004-9090",
    endereco: "Atendimento Virtual",
    vantagens: [
      "2 meses de assinatura grátis por 120 moedas",
      "Playlist personalizada de foco/estudo por 10 moedas"
    ]
  }
];

export default function EmpresasParceiras() {
  return (
    <main className="empresas-page">
      <section className="empresas-hero glass-card">
        <span className="badge">Rede de Vantagens</span>
        <h1>
          Empresas <span>Parceiras</span>
        </h1>
        <p>
          Conheça os parceiros integrados ao StudentCoin. Alunos podem trocar suas 
          moedas por benefícios reais e exclusivos nessas empresas parceiras.
        </p>
      </section>

      <section className="empresas-list">
        {EMPRESAS_MOCK.map((empresa) => (
          <article key={empresa.id} className="empresa-card glass-card">
            <div className="empresa-card-header">
              <div className="empresa-icon-container">
                <FaBuilding className="empresa-icon" />
              </div>
              <div>
                <span className="badge-segment">{empresa.segmento}</span>
                <h2>{empresa.nomeFantasia}</h2>
                <small className="cnpj-text">CNPJ: {empresa.cnpj} | {empresa.razaoSocial}</small>
              </div>
            </div>

            <p className="empresa-descricao">{empresa.descricao}</p>

            <div className="empresa-details">
              <div className="detail-item">
                <FiMapPin className="detail-icon" />
                <span>{empresa.endereco}</span>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <FiPhone className="detail-icon" />
                  <span>{empresa.telefone}</span>
                </div>
                <div className="detail-item">
                  <FiMail className="detail-icon" />
                  <span>{empresa.email}</span>
                </div>
              </div>
            </div>

            <div className="empresa-vantagens-section">
              <h3>
                <FaTag className="tag-icon" /> Benefícios Oferecidos:
              </h3>
              <ul>
                {empresa.vantagens.map((vantagem, index) => (
                  <li key={index}>
                    <FiCheckCircle className="check-icon" />
                    <span>{vantagem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
