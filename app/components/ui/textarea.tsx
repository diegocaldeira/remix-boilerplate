import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  error?: JSX.Element | string
  rows?: number
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ rows, className, type, error, ...props }, ref) => {
    return (
      <>
        <textarea
          rows={rows}
          cols={50}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            error ? "border-error focus-visible:ring-error" : ""
          )}
          ref={ref}
          {...props}
        />
        {error && <div className="mt-1 text-sm text-error">{error}</div>}
      </>
    )
  }
)
TextArea.displayName = "TextArea"

export { TextArea }
