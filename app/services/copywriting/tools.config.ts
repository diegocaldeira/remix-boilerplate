import type { Tool } from "@prisma/client"

export const enum TOOL_TYPES {
  _AI_WRITER = "ai-writer",
  _AI_COPYWRITER = "ai-copywriter",
  _AI_SOCIAL = "ai-social",
}

export const DEFAULT_TOOLS: {
  [key in TOOL_TYPES]: Tool
} = {
  [TOOL_TYPES._AI_WRITER]: {
    id: "ai-writer",
    keyname: "ai-writer",
    icon: "",
    name: "AI Writers",
    description:
      "Escritores de IA especializados e focados em seu negócio, nossa ferramenta economiza tempo e esforço e aumenta a produtividade.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [TOOL_TYPES._AI_COPYWRITER]: {
    id: "ai-copywriting",
    keyname: "ai-copywriting",
    icon: "",
    name: "AI Copywriting",
    description:
      "Transforme suas ideias em conteúdo de marketing cativante sem esforço, nossas poderosas ferramentas de IA estão aqui para ajudá-lo a criar textos atraentes com facilidade.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [TOOL_TYPES._AI_SOCIAL]: {
    id: "ai-social",
    keyname: "ai-social",
    icon: "",
    name: "AI Social",
    description:
      "Descubra o futuro do marketing de mídia social com nossa IA, crie postagens e legendas sem esforço e eleve sua presença nas redes sociais.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}
