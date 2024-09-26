// app/routes/save-content.tsx
import { Form } from "@remix-run/react"
import ReactMarkdown from "react-markdown"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import { Button } from "@/components/ui/button"

// Função para salvar o conteúdo no banco de dados

interface ContentFormProps {
  project: string
  content: string
  feature: string
  category: string
  session: string
}

// Componente da rota
export default function SaveContentRoute({
  project,
  content,
  feature,
  category,
  session,
}: ContentFormProps) {
  return (
    <Form method="post">
      <AuthenticityTokenInput />
      {/* Esses valores estão ocultos, pois são passados como props */}
      <input type="hidden" name="project_id" value={project} />
      <input type="hidden" name="feature_id" value={feature} />
      <input type="hidden" name="category_id" value={category} />
      <input type="hidden" name="session_id" value={session} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="intent" defaultValue="savingContent" />
      {/* Apenas exibindo o campo de conteúdo */}
      <ReactMarkdown>{content}</ReactMarkdown>

      <div className="w-full space-y-6">
        <Button
          className="isolate grid h-full max-w-md auto-cols-max grid-flow-col grid-cols-2 justify-items-start rounded-lg border-slate-300 text-left hover:border-solid hover:bg-rose-500"
          type="submit"
        >
          Salvar
        </Button>
      </div>
    </Form>
  )
}
