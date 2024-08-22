import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"

import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { getAllPlans } from "@/models/plan"
import { getUserCurrencyFromRequest } from "@/utils/currency"

import Faqs from "./faq"
import { FeatureSection } from "./feature-section"
import FeatureWithImage from "./feature-with-image"
import FeaturesVariantB from "./features-variant-b"
import Footer from "./footer"
import { HeroSection } from "./hero-section"
import { LogoCloud } from "./logo-cloud"
import { Pricing } from "./pricing"

const loginFeatures = [
  "Geração de conteúdo com tecnologia de IA: Usamos algoritmos avançados para criar conteúdo original e envolvente para vários formatos, incluindo postagens em blogs, artigos, postagens em mídias sociais e muito mais.",
  "Múltiplas opções de tom e estilo: Se você precisa de um tom profissional, casual ou bem-humorado, nos adaptamos às suas necessidades específicas.",
  "Otimização de SEO: Ajudamos você a ter uma classificação mais elevada nos resultados de mecanismos de pesquisa, sugerindo palavras-chave relevantes e otimizando seu conteúdo para mecanismos de pesquisa.",
  "Verificador de plágio: certifique - se de que seu conteúdo seja 100% original com o verificador de plágio integrado.",
]

const advantagesFeatures = [
  "Economize tempo e esforço: geramos conteúdo em segundos, liberando seu tempo para se concentrar em outras tarefas importantes.",
  "Aumente sua produtividade: elimine o bloqueio do escritor e produza consistentemente conteúdo de alta qualidade.",
  "Melhore a qualidade do conteúdo: ajudamos você a criar conteúdo bem escrito, envolvente e informativo que repercute em seu público.",
  "Aumente seu alcance: alcance um público mais amplo e atraia mais visitantes para seu site com conteúdo otimizado para SEO.",
]

const benefitsFeatures = [
  "Concentre-se no que importa: gaste menos tempo escrevendo e mais tempo em tarefas estratégicas que fazem seu negócio crescer.",
  "Alcance seus objetivos de conteúdo: se você deseja aumentar o conhecimento da marca, direcionar tráfego ou gerar leads, podemos ajudá-lo a atingir seus objetivos de marketing de conteúdo.",
  "Reduza o estresse e a frustração: diga adeus ao estresse do bloqueio de escritor e à frustração de olhar para uma página em branco.",
  "Fique à frente da concorrência: fique à frente da curva e mantenha um calendário de conteúdo consistente com a ajuda da IA.",
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard/projects",
  })

  let plans = await getAllPlans()

  const defaultCurrency = getUserCurrencyFromRequest(request)

  plans = plans
    .map((plan) => {
      return {
        ...plan,
        prices: plan.prices
          .filter((price) => price.currency === defaultCurrency)
          .map((price) => ({
            ...price,
            amount: price.amount / 100,
          })),
      }
    })
    .sort((a, b) => a.prices[0].amount - b.prices[0].amount)

  return {
    plans,
    defaultCurrency,
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Home Page" }]
  }
)

export default function Index() {
  return (
    <div className="h-full">
      <HeroSection />
      <div className="relative z-10">
        <LogoCloud />
        <FeatureSection />
        <FeatureWithImage
          features={loginFeatures}
          title="Facilite sua vida"
          darkFeatureImage="/login-dark.jpeg"
          lightFeatureImage="/login-light.jpeg"
        />

        <FeatureWithImage
          features={advantagesFeatures}
          title="Vantagens"
          darkFeatureImage="/login-dark.jpeg"
          lightFeatureImage="/login-light.jpeg"
        />

        <FeatureWithImage
          features={benefitsFeatures}
          title="Benefícios"
          darkFeatureImage="/login-dark.jpeg"
          lightFeatureImage="/login-light.jpeg"
        />
        <FeaturesVariantB />
        <Pricing />
        <Faqs />
        <Footer />
      </div>
    </div>
  )
}
