import { TONES_CONTAINER_WIDTH } from '../components/SkinTones'
import { generateToneSelectorPosition } from '../utils/skinToneSelectorUtils'

// Same column maths as KeyboardProvider (emojiSize * 2 per column) and
// EmojiCategory (10px of horizontal padding on each side).
const selectorXByColumn = (windowWidth: number, emojiSize: number) => {
  const columns = Math.floor(windowWidth / (emojiSize * 2))
  const emojiWidth = (windowWidth - 20) / columns

  return Array.from(
    { length: columns },
    (_, column) =>
      generateToneSelectorPosition(columns, column, windowWidth, emojiWidth, emojiWidth, 0).x,
  )
}

describe('generateToneSelectorPosition', () => {
  it.each([320, 360, 390, 430])('keeps the selector on a %ipx wide screen', (windowWidth) => {
    selectorXByColumn(windowWidth, 30).forEach((x) => {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x + TONES_CONTAINER_WIDTH).toBeLessThanOrEqual(windowWidth)
    })
  })
})
