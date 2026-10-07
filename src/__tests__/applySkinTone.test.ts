import { applySkinTone } from '../utils/skinToneSelectorUtils'

const codepoints = (s: string) =>
  Array.from(s)
    .map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ')

const MEDIUM_DARK = String.fromCodePoint(0x1f3fe) // 🏾

describe('applySkinTone', () => {
  it('appends the tone to a plain base emoji', () => {
    // 👍 (1F44D) → 👍🏾 (1F44D 1F3FE)
    expect(codepoints(applySkinTone('👍', MEDIUM_DARK))).toBe('U+1F44D U+1F3FE')
  })

  it('replaces a trailing variation selector rather than following it', () => {
    // ☝️ (261D FE0F) → ☝🏾 (261D 1F3FE), NOT 261D 1F3FE FE0F
    expect(codepoints(applySkinTone('☝️', MEDIUM_DARK))).toBe('U+261D U+1F3FE')
  })

  it('does not leave a VS16 after the skin-tone modifier', () => {
    expect(applySkinTone('☝️', MEDIUM_DARK)).not.toContain(String.fromCodePoint(0xfe0f))
  })

  it('inserts the tone before a ZWJ in a ZWJ sequence', () => {
    // 👩‍🚀 (1F469 200D 1F680) → 👩🏾‍🚀 (1F469 1F3FE 200D 1F680)
    expect(codepoints(applySkinTone('👩‍🚀', MEDIUM_DARK))).toBe('U+1F469 U+1F3FE U+200D U+1F680')
  })

  it('replaces the variation selector of the leading component of a ZWJ sequence', () => {
    // 🕵️‍♀️ (1F575 FE0F 200D 2640 FE0F) → 🕵🏾‍♀️ (1F575 1F3FE 200D 2640 FE0F),
    // NOT 1F575 FE0F 1F3FE 200D 2640 FE0F. The VS16 on the trailing ♀ stays.
    expect(codepoints(applySkinTone('🕵️‍♀️', MEDIUM_DARK))).toBe(
      'U+1F575 U+1F3FE U+200D U+2640 U+FE0F',
    )
  })

  it('tones only the leading component of a multi-ZWJ sequence', () => {
    // 🚶‍♀️‍➡️ (1F6B6 200D 2640 FE0F 200D 27A1 FE0F) → 🚶🏾‍♀️‍➡️
    // (1F6B6 1F3FE 200D 2640 FE0F 200D 27A1 FE0F). Both trailing VS16s stay.
    expect(codepoints(applySkinTone('🚶‍♀️‍➡️', MEDIUM_DARK))).toBe(
      'U+1F6B6 U+1F3FE U+200D U+2640 U+FE0F U+200D U+27A1 U+FE0F',
    )
  })

  it('tones both people in a multi-person sequence', () => {
    // 🧑‍🤝‍🧑 (1F9D1 200D 1F91D 200D 1F9D1) → 🧑🏾‍🤝‍🧑🏾 (1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FE).
    // The RGI set only has this sequence with both people toned.
    expect(codepoints(applySkinTone('🧑‍🤝‍🧑', MEDIUM_DARK))).toBe(
      'U+1F9D1 U+1F3FE U+200D U+1F91D U+200D U+1F9D1 U+1F3FE',
    )
    // 👩‍❤️‍💋‍👨 (1F469 200D 2764 FE0F 200D 1F48B 200D 1F468) → 👩🏾‍❤️‍💋‍👨🏾
    expect(codepoints(applySkinTone('👩‍❤️‍💋‍👨', MEDIUM_DARK))).toBe(
      'U+1F469 U+1F3FE U+200D U+2764 U+FE0F U+200D U+1F48B U+200D U+1F468 U+1F3FE',
    )
  })
})
