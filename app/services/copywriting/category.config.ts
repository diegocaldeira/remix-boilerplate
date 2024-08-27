import type { Category } from "@prisma/client"

export const enum CATEGORY_TYPES {
  ARTICLE = "article",
  EMAIL = "email",
  ADVERTISEMENT = "advertisement",
  HISTORY = "history",
  ANSWERS_QUESTIONS = "answers-questions",
  SOCIAL_MEDIA = "social-media",
}

export const DEFAULT_CATEGORY: {
  [key in CATEGORY_TYPES]: Category
} = {
  [CATEGORY_TYPES.ARTICLE]: {
    id: "article",
    keyname: "article",
    icon: "",
    name: "Artigos de Blog",
    description:
      "Compartilhe seu conhecimento e posicione sua marca como líder do setor. Crie artigos de blog envolventes que eduquem, inspirem e engajem seu público.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [CATEGORY_TYPES.EMAIL]: {
    id: "email",
    keyname: "email",
    icon: "",
    name: "E-mails",
    description:
      "Aproxime-se dos seus clientes com campanhas de e-mail personalizadas. Construa conexões fortes e aumente suas conversões com mensagens eficazes e direcionadas.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [CATEGORY_TYPES.ADVERTISEMENT]: {
    id: "advertisement",
    keyname: "advertisement",
    icon: "",
    name: "Anúncios",
    description:
      "Capture a atenção do seu público-alvo com anúncios impactantes. Crie campanhas publicitárias que destacam sua oferta e geram resultados reais.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [CATEGORY_TYPES.HISTORY]: {
    id: "history",
    keyname: "history",
    icon: "",
    name: "Histórias",
    description:
      "Conecte-se emocionalmente com seu público. Conte histórias cativantes que ressoam com os valores e desejos de seus clientes, fortalecendo sua marca.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [CATEGORY_TYPES.ANSWERS_QUESTIONS]: {
    id: "answers-questions",
    keyname: "answers-questions",
    icon: "",
    name: "Perguntas e Respostas",
    description:
      "Antecipe as dúvidas do seu público e responda com clareza. Crie sessões de perguntas e respostas que informem e construam confiança.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [CATEGORY_TYPES.SOCIAL_MEDIA]: {
    id: "social-media",
    keyname: "social-media",
    icon: "",
    name: "Conteúdos para Redes Sociais",
    description:
      "Engaje e cresça sua audiência nas redes sociais. Crie conteúdos que chamem a atenção, promovam interação e mantenham sua marca sempre em destaque.",
    isActive: true,
    listOfFeatures: [],
    projectId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}
