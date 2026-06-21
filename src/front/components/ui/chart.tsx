import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/front/lib/utils"

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const ChartContext = React.createContext<{
  config: ChartConfig
}>({
  config: {},
})

const useChart = () => {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    theme?: {
      light?: string
      dark?: string
    }
    color?: string
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          "flex aspect-auto justify-center text-xs",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  )

  if (colorConfig.length === 0) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: [
          `#${id} {`,
          colorConfig
            .map(([key, itemConfig]) => {
              const color =
                itemConfig.theme?.light || itemConfig.color
              return color ? `  --color-${key}: ${color};` : null
            })
            .join("\n"),
          "}",
          `[data-theme="dark"] #${id} {`,
          colorConfig
            .map(([key, itemConfig]) => {
              const color =
                itemConfig.theme?.dark || itemConfig.color
              return color ? `  --color-${key}: ${color};` : null
            })
            .join("\n"),
          "}",
        ]
          .filter(Boolean)
          .join("\n"),
      }}
    />
  )
}
ChartStyle.displayName = "ChartStyle"

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipPayloadItem = {
  color?: string;
  name?: string;
  value?: string | number;
};

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    labelFormatter?: (label: string | number) => React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
  }
>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      className,
      labelFormatter,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart()

    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null
    }

    const items = payload.map(({ color: _, name, value }: TooltipPayloadItem) => {
      const fakeValue = String(value)
      const itemConfig = config[name as keyof typeof config] || {}
      const indicatorColor = itemConfig.color

      return (
        <div
          key={`${name}-${fakeValue}`}
          className={cn(
            "flex w-full flex-shrink-0 flex-col items-start gap-1 rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          )}
        >
          <span className="text-muted-foreground">
            {itemConfig?.label || name}
          </span>
          <span className="font-mono font-medium text-foreground">
            {fakeValue}
          </span>
        </div>
      )
    })

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] grid-cols-1 gap-1.5",
          className,
        )}
        {...props}
      >
        {!hideLabel && label && (
          <div className="text-muted-foreground text-xs">
            {labelFormatter?.(label) || label}
          </div>
        )}
        {items}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap justify-center gap-4",
      className,
    )}
    {...props}
  />
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
}
