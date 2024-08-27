import type { Feature } from "@prisma/client"

export const enum FEATURE_TYPES {
  _4C = "4C",
  _3R = "3R",
  FAB = "FAB",
  STAR = "STAR",
  PAS = "PAS",
  AIDPPC = "AIDPPC",
  EMOTIONAL = "EMOTIONAL",
  ACCA = "ACCA",
  OATH = "OATH",
  BAB = "BAB",
  AIDA = "AIDA",
  APP = "APP",
}

export const DEFAULT_FEATURES: {
  [key in FEATURE_TYPES]: Feature
} = {
  [FEATURE_TYPES._4C]: {
    id: "4C",
    keyname: "4C",
    name: "Fórmula 4C's",
    description:
      "Experimente nosso Gerador de Redação AI 4C (claro, conciso, confiável e atraente) para criar conteúdo persuasivo que fala diretamente ao seu público e impulsiona o engajamento.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "A Fórmula de Redação 4C significa <b>Claro, Conciso, Credível e Atraente</b>. <ul class='mt-4 mb-4'>É uma fórmula de direitos autorais que enfatiza: <li><b class='font-bold'>Claro</b>: Apresentar informações de forma direta e compreensível.</li> <li><b class='font-bold'>Conciso</b>: comunicar a mensagem de forma sucinta, sem detalhes desnecessários.</li><li><b class='font-bold'>Credível</b>: Fornecer informações confiáveis ​​e confiáveis ​​apoiadas por evidências.</li> <li><b class='font-bold'>Atraente</b>: Criar conteúdo que cative e convença o público a agir.</li></ul>",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "<h1>A fórmula dos 4C garante que o texto seja eficaz, envolvente e impactante.</h1> <ul class='mt-4 mb-4'>Exemplo Simples <li><b class='font-bold'>Claro</b>: Nosso produto foi projetado para simplificar suas tarefas diárias.</li> <li><b class='font-bold'>Conciso</b>: Economize tempo e esforço com nossa solução fácil de usar.</li> <li><b class='font-bold'>Credível</b>: Apoiado por anos de pesquisa e depoimentos de clientes.</li> <li><b class='font-bold'>Atraente</b>: Transforme sua produtividade e simplifique seu fluxo de trabalho hoje mesmo!</li></ul>",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES._3R]: {
    id: "3R",
    keyname: "3R",
    name: "Fórmula 3R's",
    description:
      "Nosso Gerador de Redação AI 3R (Rapport, Razões e Resultados) ajuda você a criar conteúdo impactante que conecta seus leitores e os inspira a agir.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "A Fórmula de Redação dos 3 R significa Rapport-Razões-Resultados. É uma estrutura de copywriting que se concentra em guiar o público através de diferentes etapas: Relacionamento/Afinidade: Estabelecer uma conexão ou vínculo com o público. Razões: Fornecer razões lógicas ou justificativas para agir. Resultados: Destacar os resultados ou benefícios potenciais da ação.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "A fórmula dos 3 R ajuda a construir confiança, credibilidade e persuasão em direitos autorais. A fórmula de redação dos 3 R: exemplo simples: Relacionamento/Afinidade: 'Olá, colega entusiasta do fitness!' Razões: 'Aqui estão três razões comprovadas pela ciência pelas quais nossa proteína em pó é a melhor escolha para você.' Resultados: 'Experimente aumento de massa muscular, recuperação mais rápida e melhor desempenho em apenas algumas semanas!'",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.FAB]: {
    id: "FAB",
    keyname: "FAB",
    name: "FAB Formula",
    description:
      "Nossa fórmula FAB (recursos, vantagens, benefícios) ajuda você a comunicar o verdadeiro valor de seus produtos ou serviços de uma forma que ressoe com seu público.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "<ul>FAB é outra fórmula eficaz de direitos autorais, que significa: <li><b class='font-bold'>Características</b>: Destaque as características do produto ou serviço. </li><li><b class='font-bold'>Vantagens</b>: Explique como esses recursos beneficiam o cliente.</li><li><b class='font-bold'>Benefícios</b>: Enfatize os benefícios ou resultados finais experimentados pelo cliente.</li><li> A fórmula FAB ajuda a comunicar claramente a proposta de valor e a persuadir o público a agir.</li></ul>",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "<ul>Exemplo Simples <li><b class='font-bold'>Características</b>: câmera de 25 MP, armazenamento de 128 GB </li><li><b class='font-bold'>Vantagens</b>: Capture fotos em alta resolução e armazene todas as suas memórias com segurança. </li><li><b class='font-bold'>Benefícios</b>: Preserve seus momentos preciosos com detalhes nítidos e nunca se preocupe em ficar sem espaço.</li></ul>",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.STAR]: {
    id: "STAR",
    keyname: "STAR",
    name: "STAR Formula",
    description:
      "Conte histórias convincentes com o método STAR – Situação, Tarefa, Ação, Resultado. Use nosso AI STAR Copywriting Generator para criar narrativas poderosas que destacam conquistas e impulsionam o engajamento.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "<b>STAR</b> é um acrônimo para <b>Situação-Tarefa-Ação-Resultado</b>. <ul class='mb-4'>É uma estrutura de copywriting que se concentra em guiar o público através de diferentes etapas: <li class='mt-4'><b>Situação:</b> Definir o contexto ou antecedentes do problema ou necessidade. </li> <li><b>Tarefa:</b> Descreva o desafio ou objetivo específico a ser abordado.</li><li><b>Ação:</b> Explicar as ações tomadas para resolver o problema ou atingir o objetivo.</li><li><b>Resultado:</b> Destacando o resultado ou benefícios alcançados com as ações.</li></ul> A fórmula STAR ajuda na criação de textos claros e concisos que comunicam com eficácia a proposta de valor.",
      },
      {
        id: "2",
        name: "Exemplo Simples de uma Fórmula de Redação STAR",
        description:
          "<ul class='mt-4'><li><b>Situação:</b> Em um ambiente de negócios acelerado...</li> <li><b>Tarefa:</b> Nossa equipe precisava de uma solução para agilizar a comunicação...</li><li> <b>Ação:</b> Implementamos uma nova ferramenta de colaboração... <b>Resultado:</b> Resultando em maior produtividade e eficiência.</li>",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.EMOTIONAL]: {
    id: "EMOTIONAL",
    keyname: "EMOTIONAL",
    name: "Emotional Triggers",
    description:
      "Explore as emoções do seu público com nosso Gerador de Redação de Gatilhos Emocionais de IA. Crie conteúdo que ressoe em um nível mais profundo e estimule o envolvimento por meio do apelo emocional.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "O Copywriting de gatilhos emocionais concentra-se em explorar as emoções do público para evocar sentimentos ou reações específicas. Envolve: Identificando emoções: compreender os gatilhos emocionais que repercutem no público-alvo. Criando conexões emocionais: elaborando textos que se conectam com o público em um nível emocional. Elicitar emoções desejadas: usar palavras, frases e técnicas de contar histórias para evocar a resposta emocional desejada. A redação de gatilhos emocionais é eficaz na criação de conteúdo impactante e memorável que ressoa com as emoções do público.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "Redação de gatilhos emocionais: exemplo simples Medo: 'Não perca esta oferta por tempo limitado antes que seja tarde demais!' Alegria: 'Experimente a pura alegria de atingir seus objetivos de condicionamento físico com nosso revolucionário programa de exercícios.' Confiança: 'Junte-se a milhares de clientes satisfeitos que confiaram em nós para fornecer produtos e serviços de qualidade.'",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.BAB]: {
    id: "BAB",
    keyname: "BAB",
    name: "BAB Formula",
    description:
      "Escreva conteúdo persuasivo com a fórmula BAB – antes, depois, ponte. Nosso AI BAB Copywriting Generator ajuda você a criar histórias atraentes que mostram a transformação e cativam seus leitores.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "BAB significa Antes-Depois-Ponte. É uma fórmula de copywriting que envolve: Antes: Apresentar a atual situação indesejável ou problema enfrentado pelo público. Depois: descrever o estado ou resultado desejado que o público deseja alcançar. Ponte: apresentar seu produto ou serviço como solução preenche a lacuna entre o antes e o depois.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "A fórmula BAB é eficaz para captar a atenção, criar o desejo de mudança e apresentar a sua solução como o meio para alcançá-la. Fórmula de redação BAB: exemplo simples Antes: Você está cansado de acordar cansado todas as manhãs? Depois: Imagine sentir-se energizado e revigorado, pronto para enfrentar o dia com entusiasmo. Bridge: Nosso suplemento energético fornece a vitalidade que você precisa para começar cada dia sentindo-se revigorado e cheio de vida.",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.PAS]: {
    id: "PAS",
    keyname: "PAS",
    name: "PAS Formula",
    description:
      "Domine a técnica PAS – problema, agitação, solução. Deixe nosso AI PAS Copywriting Generator ajudá-lo a criar conteúdo persuasivo que atenda aos pontos fracos do seu público e ofereça soluções eficazes.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "PAS significa Problema-Agitar-Solução. É uma fórmula de copywriting que envolve:​<ul class='mt-4 mb-4'><li><span class='font-bold'>Problema:</span> Identificar um problema enfrentado pelo público.</li><li><span class='font-bold'>Agitar:</span> Agite o problema deixando claro como isso os afeta.</li><li><span class='font-bold'>Solução:</span> Apresentar seu produto ou serviço como solução.</li></ul><p class='mt-6'>A fórmula PAS capta efetivamente a atenção do público, envolve-o emocionalmente e oferece uma solução para o seu problema.</p>",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "Fórmula de redação PAS: exemplo simples <p class= 'mt-6'><ul class='mt-4 mb-4'><li><span class='font-bold'>Problema:</span> Você está cansado de acordar cansado todas as manhãs?</li><li><span class='font-bold'>Agite:</span> Imagine lutar durante o dia, lutando constantemente contra a fadiga e os baixos níveis de energia.</li><li><span class='font-bold'> Solução: </span> Nosso suplemento que aumenta a energia oferece uma solução natural para ajudá-lo a se sentir revitalizado e revigorado todos os dias.</li></ul></p>",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.ACCA]: {
    id: "ACCA",
    keyname: "ACCA",
    name: "ACCA Formula",
    description:
      "Transforme sua cópia com o método ACCA – consciência, compreensão, convicção e ação. Use nosso AI ACCA Copywriting Generator para produzir conteúdo persuasivo que orienta seu público em todas as etapas do processo de tomada de decisão.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "Cansado de olhar para uma página em branco? Diga adeus ao bloqueio de escritor com nosso gerador de fórmulas de redação ACCA com tecnologia de IA! Projetada para criar conteúdo atraente, confiável, atraente e voltado para a ação, esta ferramenta é perfeita para empresas e profissionais de marketing que buscam elevar seu jogo de redação. ACCA significa Conscientização-Compreensão-Convicção-Ação. <ul class='mt-4 mb-4'>É uma fórmula de copywriting que envolve: <li><b class='font-bold'>Conscientização</b>: Captar a atenção do público destacando um problema ou necessidade.​ </li><li><b class='font-bold'>Compreensão</b>: Ajudar o público a entender melhor o problema por meio de informações e exemplos.​ </li><li><b class='font-bold'>Convicção</b>: persuadir o público de que sua solução é a melhor opção, apresentando benefícios e abordando objeções.​ </li><li><b class='font-bold'>Ação</b>: Motivar o público a agir, como fazer uma compra ou inscrever-se.</li></ul>",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "A fórmula ACCA orienta os redatores na criação de conteúdo persuasivo que leva o público da conscientização à ação. <ul class='mt-4 mb-4'>Exemplo de fórmula de redação ACCA <li><b class='font-bold'>Conscientização</b>: Você está cansado de acordar cansado todas as manhãs? </li><li><b class='font-bold'>Compreensão</b>: Imagine lutar durante o dia, lutando constantemente contra a fadiga e os baixos níveis de energia. </li><li><b class='font-bold'>Convicção</b>: Nosso suplemento para aumentar a energia fornece uma solução natural para ajudá-lo sinta-se revitalizado e revigorado todos os dias.​ Ação: Faça seu pedido agora e comece sua jornada para melhores níveis de energia!</li></ul>",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.AIDA]: {
    id: "AIDA",
    keyname: "AIDA",
    name: "AIDA Formula",
    description:
      "Domine a fórmula AIDA – atenção, interesse, desejo e ação. Deixe nosso AI AIDA Copywriting Generator ajudá-lo a criar textos envolventes e focados na conversão que cativam seu público do início ao fim.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "A fórmula AIDA é uma abordagem clássica e amplamente utilizada em marketing e publicidade. Significa: Atenção: Chame a atenção do público com um título cativante ou uma declaração de abertura. Interesse: gere interesse fornecendo informações atraentes ou abordando pontos problemáticos. Desejo: Crie um sentimento de desejo ou necessidade do produto/serviço, enfatizando os benefícios. Ação: estimule o público a agir, como fazer uma compra ou inscrever-se.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "A fórmula AIDA orienta os redatores na condução do público por uma sequência lógica de etapas, resultando em última análise na ação desejada. Fórmula de redação AIDA: exemplo simples Manchete (Atenção): Transforme seu sorriso hoje! Corpo (Interesse): 'Cansado de esconder seu sorriso? Nosso kit de clareamento dental oferece resultados profissionais em casa.' Corpo (Desejo): Imagine abrir um sorriso deslumbrante que ilumina a sala. Com nosso kit, você terá dentes mais brancos em poucos dias. Call to Action (Ação): Pronto para um sorriso radiante? Faça seu pedido agora e comece sua jornada para dentes mais brilhantes e felizes!",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.AIDPPC]: {
    id: "AIDPPC",
    keyname: "AIDPPC",
    name: "AIDPPC Formula",
    description:
      "Eleve seu texto com AIDPPC – atenção, interesse, descrição, persuasão, prova e fechamento. Use nosso IA para criar conteúdo de alta conversão que impulsiona a ação.",
    observations: "",
    example: "",
    isActive: true,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "<ul>É uma fórmula abrangente de direitos autorais que envolve: <li><b class='font-bold'>Atenção</b>: Prenda a atenção do público com um título ou declaração de abertura atraente. </li><li><b class='font-bold'>Interesse</b>: Gerar interesse destacando os benefícios ou resolvendo um problema para o público. </li><li><b class='font-bold'>Descrição</b>: Descrever detalhadamente o produto ou serviço, enfatizando suas características e pontos de venda exclusivos. </li><li><b class='font-bold'>Persuasão</b>: Persuadir o público a agir apresentando argumentos ou incentivos convincentes. </li><li><b class='font-bold'>Prova</b>: Forneça prova social ou evidência para apoiar as afirmações feitas na cópia. </li><li><b class='font-bold'>Fechar</b>: estimulando o público a dar a etapa final, como fazer uma compra ou inscrever-se.</li></ul>",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "<ul>Exemplo Simples: <li><b class='font-bold'>Atenção</b>: você está cansado de lutar para criar campanhas de marketing eficazes que envolvam seu público? </li><li><b class='font-bold'>Interesse</b>: Imagine ter acesso a uma ferramenta poderosa que cria textos atraentes sem esforço, economizando tempo e esforço. </li><li><b class='font-bold'>Descrição</b>: Apresentando AI Caldeira - Seu Gerador de IA para Redação Fórmula AIDPPC. Você pode criar campanhas de marketing persuasivas que impulsionam ações de forma eficaz. </li><li><b class='font-bold'>Persuasão</b>: não deixe que direitos autorais ineficazes atrapalhem seus negócios. Experimente AI Caldeira hoje e revolucione seus esforços de marketing! </li><li><b class='font-bold'>Prova</b>: com a confiança de milhares de usuários, ajudamos empresas como a sua a atingir seus objetivos de marketing. </li><li><b class='font-bold'>Fechar</b>: Comece a criar uma cópia persuasiva agora e veja a diferença que isso faz em suas campanhas de marketing!</li></ul>",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.OATH]: {
    id: "OATH",
    keyname: "OATH",
    name: "OATH Formula",
    description:
      "Crie textos atraentes com o método OATH - alheio, apático, pensativo, doloroso. Nosso AI OATH Copywriting Generator ajuda você a produzir conteúdo persuasivo que motiva seu público a agir imediatamente.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "Fórmula de Redação OATH para Ferir o Pensamento Apático-Apático. É uma fórmula de copywriting que se concentra em guiar o público através de diferentes estágios de consciência e resposta emocional: Alheio: Dirigir-se ao público que pode não estar ciente do problema ou necessidade. Apático: Envolver-se com o público que pode saber do problema, mas é indiferente ou apático. Pensamento: Conectar-se com o público que está pensando ativamente sobre o problema e as soluções potenciais. Ferir: Alcançar o público que está sentindo dor ou urgência relacionada ao problema.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "Fórmula de redação OATH: exemplo simples Alheio: 'Você sabia que a má postura pode causar dores crônicas nas costas?' Apático: 'Embora você já tenha ouvido falar sobre a importância de uma boa postura, é fácil ignorar seu impacto na sua saúde'. Pensando: 'Ao considerar os efeitos a longo prazo da má postura, você pode estar se perguntando como melhorá-la'. Doendo: 'Se você está cansado de lidar com dores constantes nas costas, é hora de agir e priorizar sua postura'.",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.APP]: {
    id: "APP",
    keyname: "APP",
    name: "APP Formula",
    description:
      "Use o método APP – concordar, prometer, visualizar – para escrever um texto envolvente. Nosso AI APP Copywriting Generator ajuda você a criar conteúdo que atrai os leitores e define expectativas claras.",
    observations: "",
    example: "",
    isActive: false,
    listOfFeatures: [
      {
        id: "1",
        name: "Saiba mais...",
        description:
          "APP Copywriting Formula significa Concordar, Promessa, Visualização. É uma fórmula de copywriting que envolve: Concordo: Estabelecer um terreno comum com o público ou reconhecer um problema comum. Promessa: Fazer uma promessa convincente ou oferecer uma solução para o problema do público. Antevisão: Fornece uma prévia do que o público pode esperar do seu produto ou serviço.",
      },
      {
        id: "2",
        name: "Exemplo",
        description:
          "A fórmula do APP é eficaz na construção de relacionamento, captando a atenção e estimulando o público a aprender mais. Fórmula de redação de APP: exemplo simples Concordo: 'Está lutando para escrever textos de marketing cativantes?' Promessa: 'Descubra como nossa ferramenta com tecnologia de IA pode transformar seu processo de redação.' Antevisão: 'Prepare-se para a criação de cópias sem esforço e maior envolvimento!'",
        isActive: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}
