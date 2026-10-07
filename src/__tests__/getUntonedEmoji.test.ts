import { getUntonedEmoji } from '../utils/skinToneSelectorUtils'

const VS16 = String.fromCodePoint(0xfe0f)

const emoji = (value: string, name: string) => ({ emoji: value, name, v: '1.0', toneEnabled: true })

describe('getUntonedEmoji', () => {
  it('strips the tone from a plain base emoji', () => {
    expect(getUntonedEmoji(emoji('👍🏾', 'thumbs up'))).toBe('👍')
  })

  it('restores the variation selector that the tone replaced', () => {
    // ✌🏾 (270C 1F3FE) → ✌️ (270C FE0F), NOT a bare 270C
    expect(getUntonedEmoji(emoji('✌🏾', 'victory hand'))).toBe(`✌${VS16}`)
  })

  it('falls back to stripping the tone for emojis outside the bundled data', () => {
    expect(getUntonedEmoji(emoji('👍🏾', 'custom thumbs up'))).toBe('👍')
  })
})
