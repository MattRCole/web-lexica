export enum FontSize {
  Display = 'display',
  Headline = 'headline',
  Title = 'title',
  Label = 'label',
  Body = 'body'
}

export enum FontSizeModifier {
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

export const fontSizeStepMap = {
  [FontSize.Display]: {
    [FontSizeModifier.Large]: 8,
    [FontSizeModifier.Medium]: 7,
    [FontSizeModifier.Small]: 6,
  },
  [FontSize.Headline]: {
    [FontSizeModifier.Large]: 5,
    [FontSizeModifier.Medium]: 4,
    [FontSizeModifier.Small]: 3,
  },
  [FontSize.Title]: {
    [FontSizeModifier.Large]: 2,
    [FontSizeModifier.Medium]: 1,
    [FontSizeModifier.Small]: 0,
  },
  [FontSize.Body]: {
    [FontSizeModifier.Large]: 1,
    [FontSizeModifier.Medium]: 0,
    [FontSizeModifier.Small]: -1,
  },
  [FontSize.Label]: {
    [FontSizeModifier.Large]: 0,
    [FontSizeModifier.Medium]: -1,
    [FontSizeModifier.Small]: -2,
  }
}

export enum PaddingSizeModifier {
  Small = 'small',
  Normal = 'medium',
  Large = 'large'
}
