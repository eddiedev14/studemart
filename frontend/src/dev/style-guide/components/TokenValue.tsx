type TokenValueProps = {
  token: string
}

export function TokenValue({ token }: TokenValueProps) {
  return (
    <span
      ref={(node) => {
        if (node) {
          node.textContent = getComputedStyle(document.documentElement)
            .getPropertyValue(token)
            .trim()
            .toUpperCase()
        }
      }}
    />
  )
}
