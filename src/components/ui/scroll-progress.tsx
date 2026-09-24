"use client"

import { motion, useScroll, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Le dégradé violet/rose/orange d'origine (Magic UI) est le tell le plus
        // reconnaissable d'une UI générée ; §2.10 l'interdit. Remplacé par
        // l'accent du projet, qui se décline correctement en thème sombre.
        "bg-signal fixed inset-x-0 top-0 z-50 h-px origin-left",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
