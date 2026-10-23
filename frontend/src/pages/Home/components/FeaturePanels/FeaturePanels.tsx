import { Container } from '@/components/layout'
import { featurePanelsContent } from '../../home.content'
import { FeaturePanel } from './FeaturePanel'
import { BuyVisual } from './visuals/BuyVisual'
import { SellVisual } from './visuals/SellVisual'
import { TrackVisual } from './visuals/TrackVisual'

export function FeaturePanels() {
  const { buy, sell, track } = featurePanelsContent

  return (
    <Container className="flex flex-col gap-8 pb-20 pt-8 md:pb-28">
      <FeaturePanel tone="primary" visual={<BuyVisual />} {...buy} />
      <FeaturePanel tone="secondary" visual={<SellVisual />} reverse {...sell} />
      <FeaturePanel tone="accent" visual={<TrackVisual />} {...track} />
    </Container>
  )
}
