import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

export const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList>
      <TabsTrigger value="0">Mensal</TabsTrigger>
      <TabsTrigger value="1">Anual</TabsTrigger>
    </TabsList>
  </Tabs>
)
