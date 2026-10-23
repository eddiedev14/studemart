import { Heading, Text } from '@/components/typography'
import { Icon } from '@/components/ui'
import { FiMinus, FiPlus } from '@/icons'

type FaqItemProps = { question: string; answer: string }

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-2xl bg-neutral-content/10 p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <Heading variant="h4" as="h3" tone="onDark">
          {question}
        </Heading>
        <Icon icon={FiPlus} size="md" className="group-open:hidden" />
        <Icon icon={FiMinus} size="md" className="hidden group-open:block" />
      </summary>
      <Text tone="onDarkMuted" className="mt-3">
        {answer}
      </Text>
    </details>
  )
}
