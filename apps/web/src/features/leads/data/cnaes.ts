export interface CnaeOption {
  code: string;
  description: string;
  sector: string;
}

export const CNAE_OPTIONS: CnaeOption[] = [
  // Tecnologia
  { code: '6201501', description: 'Desenvolvimento de programas de computador sob encomenda', sector: 'Tecnologia' },
  { code: '6201502', description: 'Web design', sector: 'Tecnologia' },
  { code: '6202300', description: 'Desenvolvimento e licenciamento de programas customizáveis', sector: 'Tecnologia' },
  { code: '6203100', description: 'Desenvolvimento e licenciamento de programas não-customizáveis', sector: 'Tecnologia' },
  { code: '6204000', description: 'Consultoria em tecnologia da informação', sector: 'Tecnologia' },
  { code: '6209100', description: 'Suporte técnico e manutenção em TI', sector: 'Tecnologia' },
  { code: '6311900', description: 'Tratamento de dados e hospedagem', sector: 'Tecnologia' },
  { code: '6319400', description: 'Portais e provedores de conteúdo na internet', sector: 'Tecnologia' },
  // Comércio
  { code: '4711301', description: 'Comércio varejista de mercadorias em geral (supermercado)', sector: 'Comércio' },
  { code: '4711302', description: 'Mercado de pequeno porte e armazém', sector: 'Comércio' },
  { code: '4712100', description: 'Mercearia e armazém', sector: 'Comércio' },
  { code: '4721101', description: 'Padaria e confeitaria', sector: 'Comércio' },
  { code: '4741500', description: 'Comércio de tintas e materiais para pintura', sector: 'Comércio' },
  { code: '4744001', description: 'Comércio de ferragens e ferramentas', sector: 'Comércio' },
  { code: '4781400', description: 'Comércio de artigos do vestuário e acessórios', sector: 'Comércio' },
  { code: '4761001', description: 'Comércio de livros, jornais, revistas e papelaria', sector: 'Comércio' },
  // Serviços Profissionais
  { code: '6911701', description: 'Serviços advocatícios', sector: 'Serviços' },
  { code: '6920601', description: 'Atividades de contabilidade', sector: 'Serviços' },
  { code: '7111100', description: 'Serviços de arquitetura', sector: 'Serviços' },
  { code: '7112000', description: 'Serviços de engenharia', sector: 'Serviços' },
  { code: '7410201', description: 'Atividades de design gráfico', sector: 'Serviços' },
  { code: '7410202', description: 'Design de interiores', sector: 'Serviços' },
  { code: '7490101', description: 'Serviços de tradução e interpretação', sector: 'Serviços' },
  { code: '8599604', description: 'Treinamento e desenvolvimento profissional', sector: 'Serviços' },
  // Saúde
  { code: '8630501', description: 'Atividade médica ambulatorial com recursos para cirurgia', sector: 'Saúde' },
  { code: '8630502', description: 'Atividade médica ambulatorial sem recursos para cirurgia', sector: 'Saúde' },
  { code: '8640201', description: 'Laboratórios de anatomia patológica e citológica', sector: 'Saúde' },
  { code: '8640202', description: 'Laboratórios clínicos', sector: 'Saúde' },
  { code: '8650001', description: 'Atividades de enfermagem', sector: 'Saúde' },
  { code: '8650002', description: 'Atividades de profissionais da nutrição', sector: 'Saúde' },
  { code: '8660700', description: 'Atividades de fisioterapia', sector: 'Saúde' },
  { code: '8690901', description: 'Atividades de práticas integrativas e complementares', sector: 'Saúde' },
  // Educação
  { code: '8511200', description: 'Educação infantil - creche', sector: 'Educação' },
  { code: '8512100', description: 'Educação infantil - pré-escola', sector: 'Educação' },
  { code: '8513900', description: 'Ensino fundamental', sector: 'Educação' },
  { code: '8520100', description: 'Ensino médio', sector: 'Educação' },
  { code: '8531700', description: 'Educação superior - graduação', sector: 'Educação' },
  { code: '8599602', description: 'Cursos de idiomas', sector: 'Educação' },
  { code: '8599603', description: 'Treinamento em informática', sector: 'Educação' },
  // Logística e Transporte
  { code: '4930201', description: 'Transporte rodoviário de carga, exceto produtos perigosos', sector: 'Logística' },
  { code: '4930202', description: 'Transporte rodoviário de produtos perigosos', sector: 'Logística' },
  { code: '5212500', description: 'Carga e descarga', sector: 'Logística' },
  { code: '5229001', description: 'Serviços de apoio ao transporte por táxi', sector: 'Logística' },
  { code: '5310501', description: 'Atividades do Correio Nacional', sector: 'Logística' },
  // Alimentação
  { code: '5611201', description: 'Restaurante e similares', sector: 'Alimentação' },
  { code: '5611203', description: 'Lanchonete, casa de chá, de sucos e similares', sector: 'Alimentação' },
  { code: '5611204', description: 'Bar e similar', sector: 'Alimentação' },
  { code: '5620101', description: 'Fornecimento de alimentos preparados para consumo domiciliar', sector: 'Alimentação' },
  { code: '5620102', description: 'Serviços de alimentação para eventos - bufê', sector: 'Alimentação' },
  // Construção Civil
  { code: '4120400', description: 'Construção de edifícios', sector: 'Construção Civil' },
  { code: '4211101', description: 'Construção de rodovias e ferrovias', sector: 'Construção Civil' },
  { code: '4311801', description: 'Demolição de edifícios e estruturas', sector: 'Construção Civil' },
  { code: '4321500', description: 'Instalação e manutenção elétrica', sector: 'Construção Civil' },
  { code: '4399101', description: 'Administração de obras', sector: 'Construção Civil' },
  // Imobiliário
  { code: '6811601', description: 'Compra e venda de imóveis próprios', sector: 'Imobiliário' },
  { code: '6821801', description: 'Corretagem na compra e venda de imóveis', sector: 'Imobiliário' },
  { code: '6821802', description: 'Corretagem no aluguel de imóveis', sector: 'Imobiliário' },
  { code: '6822600', description: 'Gestão e administração da propriedade imobiliária', sector: 'Imobiliário' },
  // Indústria
  { code: '1011201', description: 'Frigorífico - abate de bovinos', sector: 'Indústria' },
  { code: '1094500', description: 'Fabricação de massas alimentícias', sector: 'Indústria' },
  { code: '2211101', description: 'Fabricação de pneumáticos e câmaras-de-ar', sector: 'Indústria' },
  { code: '2599301', description: 'Serviços de ferraria e serralheria', sector: 'Indústria' },
];

export const CNAE_SECTORS = [...new Set(CNAE_OPTIONS.map((c) => c.sector))];
