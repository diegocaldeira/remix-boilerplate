import type { Feature } from "@prisma/client"

export const enum FEATURE_TYPES {
  _4C = "4C",
  _3R = "3R",
  FAB = "FAB",
  STAR = "STAR",
  PAS = "PAS",
  AIDPPC = "AIDPPC",
  EMOTIONAL_TRIGGERS = "EMOTIONAL_TRIGGERS",
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
    observations:
      "A Fórmula de Redação 4C significa Claro, Conciso, Credível e Atraente. É uma fórmula de direitos autorais que enfatiza: Claro: Apresentar informações de forma direta e compreensível. Conciso: comunicar a mensagem de forma sucinta, sem detalhes desnecessários. Credível: Fornecer informações confiáveis ​​e confiáveis ​​apoiadas por evidências. Atraente: Criar conteúdo que cative e convença o público a agir.",
    example:
      "A fórmula dos 4C garante que o texto seja eficaz, envolvente e impactante. Fórmula de Redação 4C: Exemplo Simples Claro: Nosso produto foi projetado para simplificar suas tarefas diárias. Conciso: Economize tempo e esforço com nossa solução fácil de usar. Credível: Apoiado por anos de pesquisa e depoimentos de clientes. Atraente: Transforme sua produtividade e simplifique seu fluxo de trabalho hoje mesmo!",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES._3R]: {
    id: "3R",
    keyname: "3R",
    name: "Fórmula 3R's",
    description:
      "Nosso Gerador de Redação AI 3R (Rapport, Razões e Resultados) ajuda você a criar conteúdo impactante que conecta seus leitores e os inspira a agir.",
    observations:
      "A Fórmula de Redação dos 3 R significa Rapport-Razões-Resultados. É uma estrutura de copywriting que se concentra em guiar o público através de diferentes etapas: Rapport: Estabelecer uma conexão ou vínculo com o público. Razões: Fornecer razões lógicas ou justificativas para agir. Resultados: Destacar os resultados ou benefícios potenciais da ação.",
    example:
      "A fórmula dos 3 R ajuda a construir confiança, credibilidade e persuasão em direitos autorais. A fórmula de redação dos 3 R: exemplo simples: Rapport: 'Olá, colega entusiasta do fitness!' Razões: 'Aqui estão três razões comprovadas pela ciência pelas quais nossa proteína em pó é a melhor escolha para você.' Resultados: 'Experimente aumento de massa muscular, recuperação mais rápida e melhor desempenho em apenas algumas semanas!'",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.FAB]: {
    id: "FAB",
    keyname: "FAB",
    name: "FAB Formula",
    description:
      "Nosso AI FAB (recursos, vantagens, benefícios) Copywriting Generator ajuda você a comunicar o verdadeiro valor de seus produtos ou serviços de uma forma que ressoe com seu público.",
    observations:
      "FAB é outra fórmula eficaz de direitos autorais, que significa: Características: Destaque as características do produto ou serviço. Vantagens: Explique como esses recursos beneficiam o cliente. Benefícios: Enfatize os benefícios ou resultados finais experimentados pelo cliente. A fórmula FAB ajuda a comunicar claramente a proposta de valor e a persuadir o público a agir.",
    example:
      "Fórmula de redação FAB: exemplo simples <br />Características: câmera de 25 MP, armazenamento de 128 GB Vantagens: Capture fotos em alta resolução e armazene todas as suas memórias com segurança. Benefícios: Preserve seus momentos preciosos com detalhes nítidos e nunca se preocupe em ficar sem espaço.",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.STAR]: {
    id: "STAR",
    keyname: "STAR",
    name: "STAR Formula",
    description:
      "Conte histórias convincentes com o método STAR – situação, tarefa, ação, resultado. Use nosso AI STAR Copywriting Generator para criar narrativas poderosas que destacam conquistas e impulsionam o engajamento.",
    observations:
      "STAR é um acrônimo para Situação-Tarefa-Ação-Resultado. É uma estrutura de copywriting que se concentra em guiar o público através de diferentes etapas: Situação: Definir o contexto ou antecedentes do problema ou necessidade. Tarefa: Descreva o desafio ou objetivo específico a ser abordado. Ação: Explicar as ações tomadas para resolver o problema ou atingir o objetivo. Resultado: Destacando o resultado ou benefícios alcançados com as ações. A fórmula STAR ajuda na criação de textos claros e concisos que comunicam com eficácia a proposta de valor.",
    example:
      "Fórmula de redação STAR: exemplo simples Situação: 'Em um ambiente de negócios acelerado...' Tarefa: 'Nossa equipe precisava de uma solução para agilizar a comunicação...' Ação: 'Implementamos uma nova ferramenta de colaboração...' Resultado: 'Resultando em maior produtividade e eficiência.'",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.EMOTIONAL_TRIGGERS]: {
    id: "EMOTIONAL_TRIGGERS",
    keyname: "EMOTIONAL_TRIGGERS",
    name: "Emotional Triggers",
    description:
      "Explore as emoções do seu público com nosso Gerador de Redação de Gatilhos Emocionais de IA. Crie conteúdo que ressoe em um nível mais profundo e estimule o envolvimento por meio do apelo emocional.",
    observations:
      "O Copywriting de gatilhos emocionais concentra-se em explorar as emoções do público para evocar sentimentos ou reações específicas. Envolve: Identificando emoções: compreender os gatilhos emocionais que repercutem no público-alvo. Criando conexões emocionais: elaborando textos que se conectam com o público em um nível emocional. Elicitar emoções desejadas: usar palavras, frases e técnicas de contar histórias para evocar a resposta emocional desejada. A redação de gatilhos emocionais é eficaz na criação de conteúdo impactante e memorável que ressoa com as emoções do público.",
    example:
      "Redação de gatilhos emocionais: exemplo simples Medo: 'Não perca esta oferta por tempo limitado antes que seja tarde demais!' Alegria: 'Experimente a pura alegria de atingir seus objetivos de condicionamento físico com nosso revolucionário programa de exercícios.' Confiança: 'Junte-se a milhares de clientes satisfeitos que confiaram em nós para fornecer produtos e serviços de qualidade.'",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.BAB]: {
    id: "BAB",
    keyname: "BAB",
    name: "BAB Formula",
    description:
      "Escreva conteúdo persuasivo com a fórmula BAB – antes, depois, ponte. Nosso AI BAB Copywriting Generator ajuda você a criar histórias atraentes que mostram a transformação e cativam seus leitores.",
    observations:
      "BAB significa Antes-Depois-Ponte. É uma fórmula de copywriting que envolve: Antes: Apresentar a atual situação indesejável ou problema enfrentado pelo público. Depois: descrever o estado ou resultado desejado que o público deseja alcançar. Ponte: apresentar seu produto ou serviço como solução preenche a lacuna entre o antes e o depois.",
    example:
      "A fórmula BAB é eficaz para captar a atenção, criar o desejo de mudança e apresentar a sua solução como o meio para alcançá-la. Fórmula de redação BAB: exemplo simples Antes: Você está cansado de acordar cansado todas as manhãs? Depois: Imagine sentir-se energizado e revigorado, pronto para enfrentar o dia com entusiasmo. Bridge: Nosso suplemento energético fornece a vitalidade que você precisa para começar cada dia sentindo-se revigorado e cheio de vida.",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.PAS]: {
    id: "PAS",
    keyname: "PAS",
    name: "PAS Formula",
    description:
      "Domine a técnica PAS – problema, agitação, solução. Deixe nosso AI PAS Copywriting Generator ajudá-lo a criar conteúdo persuasivo que atenda aos pontos fracos do seu público e ofereça soluções eficazes.",
    observations:
      "PAS significa Problema-Agitar-Solução. É uma fórmula de copywriting que envolve:​<ul class='mt-4 mb-4'><li><span class='font-bold'>Problema:</span> Identificar um problema enfrentado pelo público.</li><li><span class='font-bold'>Agitar:</span> Agite o problema deixando claro como isso os afeta.</li><li><span class='font-bold'>Solução:</span> Apresentar seu produto ou serviço como solução.</li></ul><p class='mt-6'>A fórmula PAS capta efetivamente a atenção do público, envolve-o emocionalmente e oferece uma solução para o seu problema.</p>",
    example:
      "Fórmula de redação PAS: exemplo simples <p class= 'mt-6'><ul class='mt-4 mb-4'><li><span class='font-bold'>Problema:</span> Você está cansado de acordar cansado todas as manhãs?</li><li><span class='font-bold'>Agite:</span> Imagine lutar durante o dia, lutando constantemente contra a fadiga e os baixos níveis de energia.</li><li><span class='font-bold'> Solução: </span> Nosso suplemento que aumenta a energia oferece uma solução natural para ajudá-lo a se sentir revitalizado e revigorado todos os dias.</li></ul></p>",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.ACCA]: {
    id: "ACCA",
    keyname: "ACCA",
    name: "ACCA Formula",
    description:
      "Transforme sua cópia com o método ACCA – consciência, compreensão, convicção e ação. Use nosso AI ACCA Copywriting Generator para produzir conteúdo persuasivo que orienta seu público em todas as etapas do processo de tomada de decisão.",
    observations:
      "Transforme sua redação com IA: conheça o gerador de fórmulas de redação ACCA Cansado de olhar para uma página em branco? Diga adeus ao bloqueio de escritor com nosso gerador de fórmulas de redação ACCA com tecnologia de IA! Projetada para criar conteúdo atraente, confiável, atraente e voltado para a ação, esta ferramenta é perfeita para empresas e profissionais de marketing que buscam elevar seu jogo de redação. O melhor de tudo é que é gratuito e de código aberto. Comece hoje e veja a diferença que a IA pode fazer! ACCA significa Conscientização-Compreensão-Convicção-Ação. É uma fórmula de copywriting que envolve: Conscientização: Captar a atenção do público destacando um problema ou necessidade.​ Compreensão: Ajudar o público a entender melhor o problema por meio de informações e exemplos.​ Convicção: persuadir o público de que sua solução é a melhor opção, apresentando benefícios e abordando objeções.​ Ação: Motivar o público a agir, como fazer uma compra ou inscrever-se.",
    example:
      "The ACCA formula guides copywriters in creating persuasive content that leads the audience from awareness to action. Example of ACCA Copywriting Formula​ Awareness: Are you tired of waking up tired every morning?​ Comprehension: Imagine struggling through the day, constantly battling fatigue and low energy levels.​ Conviction: Our energy-boosting supplement provides a natural solution to help you feel revitalized and refreshed every day.​ Action: Order now and start your journey to better energy levels!",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.AIDA]: {
    id: "AIDA",
    keyname: "AIDA",
    name: "AIDA Formula",
    description:
      "Domine a fórmula AIDA – atenção, interesse, desejo e ação. Deixe nosso AI AIDA Copywriting Generator ajudá-lo a criar textos envolventes e focados na conversão que cativam seu público do início ao fim.",
    observations:
      "A fórmula AIDA é uma abordagem clássica e amplamente utilizada em marketing e publicidade. Significa: Atenção: Chame a atenção do público com um título cativante ou uma declaração de abertura. Interesse: gere interesse fornecendo informações atraentes ou abordando pontos problemáticos. Desejo: Crie um sentimento de desejo ou necessidade do produto/serviço, enfatizando os benefícios. Ação: estimule o público a agir, como fazer uma compra ou inscrever-se.",
    example:
      "A fórmula AIDA orienta os redatores na condução do público por uma sequência lógica de etapas, resultando em última análise na ação desejada. Fórmula de redação AIDA: exemplo simples Manchete (Atenção): Transforme seu sorriso hoje! Corpo (Interesse): 'Cansado de esconder seu sorriso? Nosso kit de clareamento dental oferece resultados profissionais em casa.' Corpo (Desejo): Imagine abrir um sorriso deslumbrante que ilumina a sala. Com nosso kit, você terá dentes mais brancos em poucos dias. Call to Action (Ação): Pronto para um sorriso radiante? Faça seu pedido agora e comece sua jornada para dentes mais brilhantes e felizes!",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.AIDPPC]: {
    id: "AIDPPC",
    keyname: "AIDPPC",
    name: "AIDPPC Formula",
    description:
      "Eleve sua cópia com AIDPPC – atenção, interesse, descrição, persuasão, prova e fechamento. Use nosso AI AIDPPC Copywriting Generator para criar conteúdo de alta conversão que impulsiona a ação.",
    observations:
      "Fórmula de Redação AIDPPC significa Atenção-Interesse-Descrição-Persuasão-Prova-Fecho. É uma fórmula abrangente de direitos autorais que envolve: Atenção: Prenda a atenção do público com um título ou declaração de abertura atraente. Interesse: Gerar interesse destacando os benefícios ou resolvendo um problema para o público. Descrição: Descrever detalhadamente o produto ou serviço, enfatizando suas características e pontos de venda exclusivos. Persuasão: Persuadir o público a agir apresentando argumentos ou incentivos convincentes. Prova: Forneça prova social ou evidência para apoiar as afirmações feitas na cópia. Fechar: estimulando o público a dar a etapa final, como fazer uma compra ou inscrever-se.",
    example:
      "Exemplo: Atenção: você está cansado de lutar para criar campanhas de marketing eficazes que envolvam seu público? Interesse: Imagine ter acesso a uma ferramenta poderosa que cria textos atraentes sem esforço, economizando tempo e esforço. Descrição: Apresentando AI Caldeira - Seu Gerador de IA para Redação Fórmula AIDPPC. Com Alwrity, você pode criar campanhas de marketing persuasivas que impulsionam ações de forma eficaz. Persuasão: não deixe que direitos autorais ineficazes atrapalhem seus negócios. Experimente o Alwrity hoje e revolucione seus esforços de marketing! Prova: com a confiança de milhares de usuários, o Alwrity ajudou empresas como a sua a atingir seus objetivos de marketing. Fechar: Comece a criar uma cópia persuasiva com Alwrity agora e veja a diferença que isso faz em suas campanhas de marketing!",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.OATH]: {
    id: "OATH",
    keyname: "OATH",
    name: "OATH Formula",
    description:
      "Crie textos atraentes com o método OATH - alheio, apático, pensativo, doloroso. Nosso AI OATH Copywriting Generator ajuda você a produzir conteúdo persuasivo que motiva seu público a agir imediatamente.",
    observations:
      "Fórmula de Redação OATH para Ferir o Pensamento Apático-Apático. É uma fórmula de copywriting que se concentra em guiar o público através de diferentes estágios de consciência e resposta emocional: Alheio: Dirigir-se ao público que pode não estar ciente do problema ou necessidade. Apático: Envolver-se com o público que pode saber do problema, mas é indiferente ou apático. Pensamento: Conectar-se com o público que está pensando ativamente sobre o problema e as soluções potenciais. Ferir: Alcançar o público que está sentindo dor ou urgência relacionada ao problema.",
    example:
      "Fórmula de redação OATH: exemplo simples Alheio: 'Você sabia que a má postura pode causar dores crônicas nas costas?' Apático: 'Embora você já tenha ouvido falar sobre a importância de uma boa postura, é fácil ignorar seu impacto na sua saúde'. Pensando: 'Ao considerar os efeitos a longo prazo da má postura, você pode estar se perguntando como melhorá-la'. Doendo: 'Se você está cansado de lidar com dores constantes nas costas, é hora de agir e priorizar sua postura'.",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [FEATURE_TYPES.APP]: {
    id: "APP",
    keyname: "APP",
    name: "APP Formula",
    description:
      "Use o método APP – concordar, prometer, visualizar – para escrever um texto envolvente. Nosso AI APP Copywriting Generator ajuda você a criar conteúdo que atrai os leitores e define expectativas claras.",
    observations:
      "APP Copywriting Formula significa Concordar, Promessa, Visualização. É uma fórmula de copywriting que envolve: Concordo: Estabelecer um terreno comum com o público ou reconhecer um problema comum. Promessa: Fazer uma promessa convincente ou oferecer uma solução para o problema do público. Antevisão: Fornece uma prévia do que o público pode esperar do seu produto ou serviço.",
    example:
      "A fórmula do APP é eficaz na construção de relacionamento, captando a atenção e estimulando o público a aprender mais. Fórmula de redação de APP: exemplo simples Concordo: 'Está lutando para escrever textos de marketing cativantes?' Promessa: 'Descubra como nossa ferramenta com tecnologia de IA pode transformar seu processo de redação.' Antevisão: 'Prepare-se para a criação de cópias sem esforço e maior envolvimento!'",
    isActive: true,
    listOfFeatures: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}
