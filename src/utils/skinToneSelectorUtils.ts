import { TONES_CONTAINER_WIDTH } from '../components/SkinTones'

const EMOJI_PADDING = 8
const KEYBOARD_PADDING = 10
const FUNNEL_HEIGHT = 7

const sumOfPaddings = KEYBOARD_PADDING + EMOJI_PADDING

export const generateToneSelectorPosition = (
  numOfColumns: number,
  emojiIndex: number,
  windowWidth: number,
  emojiWidth: number,
  emojiHeight: number,
  extraSearchTop: number,
) => {
  // get column in the center to measure tone selector x position
  const halfOfColumns = numOfColumns / 2
  const centerColumn = Number.isInteger(halfOfColumns)
    ? halfOfColumns - 1
    : Math.floor(halfOfColumns)

  // emoji index in singleRow perspective based on emojiIndex in flatlist and numberOfColumns
  const emojiIndexInRow = emojiIndex % numOfColumns

  // maximum x at which tone selector is fully visible on the screen
  const maxXPosition = windowWidth - TONES_CONTAINER_WIDTH - sumOfPaddings * 2

  // different x position for emojis before and after center column
  const x = emojiIndexInRow < centerColumn ? emojiIndexInRow * emojiWidth : maxXPosition

  // current row number
  const rowNumber = emojiIndex / numOfColumns >= 1 ? Math.floor(emojiIndex / numOfColumns) : 0

  // tone selector y based on emoji size and search input on the top
  const y = rowNumber * emojiHeight + extraSearchTop - FUNNEL_HEIGHT

  const position = {
    x: emojiIndexInRow === 0 ? sumOfPaddings : x + sumOfPaddings,
    y,
  }

  return position
}

export const generateToneSelectorFunnelPosition = (
  numOfColumns: number,
  emojiIndex: number,
  emojiWidth: number,
) => {
  const emojiIndexInRow = emojiIndex % numOfColumns

  const funnelXPosition =
    emojiIndexInRow === 0 ? sumOfPaddings : emojiIndexInRow * emojiWidth + sumOfPaddings

  return funnelXPosition
}

export const insertAtCertainIndex = (arr: string[], index: number, newItem: string) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

export const zeroWidthJoiner = String.fromCodePoint(0x200d)
export const variantSelector = String.fromCodePoint(0xfe0f)

export const skinToneCodes = [
  String.fromCodePoint(0x1f3fb),
  String.fromCodePoint(0x1f3fc),
  String.fromCodePoint(0x1f3fe),
  String.fromCodePoint(0x1f3fd),
  String.fromCodePoint(0x1f3ff),
]

export const removeSkinToneModifier = (emoji: string) => {
  let emojiCopy = emoji
  for (let i = 0; i < skinToneCodes.length; i++) {
    const skinTone = skinToneCodes[i]

    // split/join strips every occurrence: multi-person sequences carry two tones.
    emojiCopy = skinTone ? emojiCopy.split(skinTone).join('') : emojiCopy
  }
  return emojiCopy
}

// Person components that take their own tone when they *close* a multi-person
// ZWJ sequence (🧑‍🤝‍🧑, 👩‍❤️‍👨, 👩‍❤️‍💋‍👨). The RGI set only lists these with
// both people toned, so toning the leading person alone is non-RGI.
const personComponents = [0x1f468, 0x1f469, 0x1f9d1].map((c) => String.fromCodePoint(c))

// Applies a Fitzpatrick skin-tone modifier to a base emoji, producing a
// canonical (RGI) Unicode sequence.
//
// The modifier goes before a ZWJ (so it tones the leading component of a ZWJ
// sequence), and *replaces* a variation selector (VS16, U+FE0F) rather than
// following it: the modifier already forces emoji presentation, so a trailing
// VS16 is non-conformant and fails strict emoji validation (e.g. ☝🏾 must be
// 261D 1F3FE, not 261D 1F3FE FE0F). The same rule applies to the leading
// component of a ZWJ sequence (e.g. 🕵🏾‍♀️ must be 1F575 1F3FE 200D 2640 FE0F,
// not 1F575 FE0F 1F3FE 200D 2640 FE0F). Non-leading components keep their VS16
// (the ♀️ in 🕵🏾‍♀️, the ➡️ in 🚶🏾‍♀️‍➡️). A trailing person component in a
// multi-person sequence is toned as well (🧑🏾‍🤝‍🧑🏾, not 🧑🏾‍🤝‍🧑).
export const applySkinTone = (emoji: string, tone: string): string => {
  const zwjIndex = emoji.indexOf(zeroWidthJoiner)
  if (zwjIndex > 0) {
    const [leading, ...rest] = emoji.split(zeroWidthJoiner)
    const last = rest[rest.length - 1]
    if (last !== undefined && personComponents.includes(last)) {
      rest[rest.length - 1] = last + tone
    }
    return [applySkinTone(leading ?? '', tone), ...rest].join(zeroWidthJoiner)
  }

  const selectorIndex = emoji.indexOf(variantSelector)
  if (selectorIndex > 0) {
    return emoji.slice(0, selectorIndex) + tone + emoji.slice(selectorIndex + 1)
  }

  return emoji + tone
}

export const skinTones = [
  {
    name: 'light_skin_tone',
    color: '🏻',
  },
  {
    name: 'medium_light_skin_tone',
    color: '🏼',
  },
  {
    name: 'medium_skin_tone',
    color: '🏽',
  },
  {
    name: 'medium_dark_skin_tone',
    color: '🏾',
  },
  {
    name: 'dark_skin_tone',
    color: '🏿',
  },
]
