import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import clsx from "clsx"

export type FeatureType = {
  name: string
  isActive: boolean
  inProgress: boolean
}

export const Feature = ({ name, isActive, inProgress }: FeatureType) => (
  <li
    className={clsx(
      inProgress && "text-muted",
      "flex gap-x-3 text-muted-foreground"
    )}
  >
    {/* If in progress return disabled */}
    {!isActive ? (
      <Cross2Icon className={"h-6 w-5 flex-none"} aria-hidden="true" />
    ) : (
      <CheckIcon className={"h-6 w-5 flex-none"} aria-hidden="true" />
    )}
    {name}{" "}
    {inProgress && (
      <span className="text-xs font-semibold leading-6 text-muted-foreground">
        (Coming Soon)
      </span>
    )}
  </li>
)

type FeatureTitleProps = {
  children: React.ReactNode
}

export const FeatureTitle = ({ children }: FeatureTitleProps) => {
  return (
    <div className="text-base text-lg font-semibold text-stone-800">
      {children}
    </div>
  )
}

type FeatureDescriptionProps = {
  children: React.ReactNode
}

export const FeatureDescription = ({ children }: FeatureDescriptionProps) => {
  return (
    <p className="wrap-balance mt-1 text-sm font-light leading-5 text-stone-600">
      {children}
    </p>
  )
}

type FeaturePriceProps = {
  interval: string
  price: string
}

export const FeaturePrice = ({ interval, price }: FeaturePriceProps) => {
  return (
    <h4 className="mt-6 text-4xl font-bold tracking-tight">
      {price}
      <span className="text-sm font-semibold leading-6 text-muted-foreground">
        /{interval}
      </span>
    </h4>
  )
}
