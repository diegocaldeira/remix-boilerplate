// app/routes/save-content.tsx
import { Form } from "@remix-run/react"
import ReactMarkdown from "react-markdown"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

// Função para salvar o conteúdo no banco de dados

interface ContentFormProps {
  content: string
  feature: string
  category: string
  session: string
}

// Componente da rota
export default function SaveContentRoute({
  content,
  feature,
  category,
  session,
}: ContentFormProps) {
  return (
    <Form method="post">
      <AuthenticityTokenInput />
      {/* Esses valores estão ocultos, pois são passados como props */}
      <input type="hidden" name="feature_id" value={feature} />
      <input type="hidden" name="category_id" value={category} />
      <input type="hidden" name="session_id" value={session} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="intent" defaultValue="savingContent" />
      {/* Apenas exibindo o campo de conteúdo */}
      <ReactMarkdown>{content}</ReactMarkdown>

      <button type="submit">Salvar</button>
    </Form>
  )
}
