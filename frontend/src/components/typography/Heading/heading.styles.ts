export type HeadingVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'displayCaps'
  | 'h1Caps'
  | 'h2Caps'

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'

export const headingVariantClasses: Record<HeadingVariant, string> = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  displayCaps: 'display-caps',
  h1Caps: 'h1-caps',
  h2Caps: 'h2-caps',
}

export const headingDefaultTags: Record<HeadingVariant, HeadingTag> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  displayCaps: 'h1',
  h1Caps: 'h1',
  h2Caps: 'h2',
}
