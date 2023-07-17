import { useEffect, useCallback, useState } from 'react'
import { evaluateCssExp } from '../util/css-parse'
import { logger } from '../util/logger'


const getConstants = () => {
  const style = getComputedStyle(document.body)

  const fontSize0 = evaluateCssExp(style.getPropertyValue('--font-size-0'))
  const fontStep = 1.2
  const paddingRatio = 2 / 3
  const fontSizeX1 = fontSize0 * Math.pow(fontStep, -1)
  const fontSizeX2 = fontSize0 * Math.pow(fontStep, -2)
  const fontSize1 = fontSize0 * Math.pow(fontStep, 1)
  const fontSize2 = fontSize0 * Math.pow(fontStep, 2)
  const fontSize3 = fontSize0 * Math.pow(fontStep, 3)
  const fontSize4 = fontSize0 * Math.pow(fontStep, 4)
  const fontSize5 = fontSize0 * Math.pow(fontStep, 5)
  const fontSize6 = fontSize0 * Math.pow(fontStep, 6)
  const fontSize7 = fontSize0 * Math.pow(fontStep, 7)
  const fontSize8 = fontSize0 * Math.pow(fontStep, 8)

  const paddingXS = fontSizeX2 * paddingRatio
  const paddingS = fontSizeX1 * paddingRatio
  const paddingM = fontSize0 * paddingRatio
  const paddingL = fontSize1 * paddingRatio
  const paddingXL = fontSize2 * paddingRatio
  const computed = {
    fontStep,
    paddingRatio,
    fontSize: fontSize0,
    fontSizeTitle: fontSize1,
    fontSizeSubscript: fontSizeX1,
    fontWeightBold: style.getPropertyValue('--font-weight-bold'),
    fontWeightLight: style.getPropertyValue('--font-weight-light'),

    fontSizeXS: fontSizeX2,
    fontSizeS: fontSizeX1,
    fontSizeM: fontSize0,
    fontSizeL: fontSize1,
    fontSizeXL: fontSize2,
    fontSizeBodyS: fontSizeX1,
    fontSizeBodyM: fontSize0,
    fontSizeBodyL: fontSize1,
    fontSizeLabelS: fontSizeX2,
    fontSizeLabelM: fontSizeX1,
    fontSizeLabelL: fontSize0,
    fontSizeTitleS: fontSize0,
    fontSizeTitleM: fontSize1,
    fontSizeTitleL: fontSize2,
    fontSizeHeadlineS: fontSize3,
    fontSizeHeadlineM: fontSize4,
    fontSizeHeadlineL: fontSize5,
    fontSizeDisplayS: fontSize6,
    fontSizeDisplayM: fontSize7,
    fontSizeDisplayL: fontSize8,
    fontSizeX1,
    fontSizeX2,
    fontSize0,
    fontSize1,
    fontSize2,
    fontSize3,
    fontSize4,
    fontSize5,
    fontSize6,
    fontSize7,
    fontSize8,
    colorContentDark: style.getPropertyValue('--color-content-dark'),
    colorContentLight: style.getPropertyValue('--color-content-light'),

    colorContentLowContrastDark: style.getPropertyValue('--color-content-low-contrast-dark'),
    colorContentLowContrastLight: style.getPropertyValue('--color-content-low-contrast-light'),

    colorBackgroundDark: style.getPropertyValue('--color-background-dark'),
    colorBackgroundDarkAlt: style.getPropertyValue('--color-background-dark-alt'),
    colorBackgroundLight: style.getPropertyValue('--color-background-light'),
    colorBackgroundLightAlt: style.getPropertyValue('--color-background-light-alt'),

    colorAccent: style.getPropertyValue('--color-accent'),
    colorGreen: style.getPropertyValue('--color-green'),
    colorRed: style.getPropertyValue('--color-red'),
    colorYellow: style.getPropertyValue('--color-yellow'),

    paddingXS,
    paddingS,
    paddingM,
    paddingL,
    paddingXL,
  }
  return computed
}

const useUnits = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (document.getElementById('viewport-height-cheat')) {
      setReady(true)
    }
  }, [setReady])
  return ready
}

const getConstantsWithStepFunctions = () => {
  const constants = getConstants()
  const toReturn = {
    ...constants,
    stepToFontSize: (step: number) => constants.fontSize0 * Math.pow(constants.fontStep, step),
    stepToPaddingSize: (step: number) => constants.fontSize0 * constants.paddingRatio * Math.pow(constants.fontStep, step),
  }
  // logger.debug('sending constants...', toReturn)
  return toReturn
}

export const useConstants = () => {
  const [constants, updateConstants] = useState(getConstantsWithStepFunctions())
  const updateState = useCallback(() => updateConstants(getConstantsWithStepFunctions()), [])

  const ready = useUnits()

  useEffect(() => {
    if (ready) updateConstants(getConstantsWithStepFunctions())
  }, [updateConstants, ready])

  useEffect(() => {
    const eventListener = () => {
      updateState()
    }
    window.addEventListener('resize', eventListener)
    return () => window.removeEventListener('resize', eventListener)
  }, [updateState])

  return constants
}


const constants = {
  fontSize: 'clamp(1rem, min(2.5vh, 4vw), 2rem)',
  fontSizeTitle: 'clamp(1.5rem, min(3vh, 5.25vw), 3rem)',
  fontSizeSubscript: 'clamp(0.5rem, min(2vh, 2.75vw), 1rem)',
  fontWeightBold: 'bolder',
  fontWeightLight: 'lighter',

  fontSizeXS: 'clamp(0.25rem, min(1.5vh, 1.50vw), 0.5rem)',
  fontSizeS: 'clamp(0.5rem, min(2vh, 2.75vw), 1rem)',
  fontSizeM: 'clamp(1rem, min(2.5vh, 4vw), 2rem)',
  fontSizeL: 'clamp(1.5rem, min(3vh, 5.25vw), 3rem)',
  fontSizeXL: 'clamp(2rem, min(3.5vh, 6.50vw), 4rem)',

  colorContentDark: '#93a1a1',
  colorContentLight: '#586e75',

  colorContentLowContrastDark: '#657b83',
  colorContentLowContrastLight: '#839496',

  colorBackgroundDark: '#002b36',
  colorBackgroundDarkAlt: '#073642',
  colorBackgroundLight: '#eee8d5',
  colorBackgroundLightAlt: '#fdf6e3',

  colorAccent: '#268bd2',
  colorGreen: '#2aa198',
  colorRed: '#dc322f',
  colorYellow: '#b58900',

  paddingXS: 'calc(2 / 3 * clamp(0.25rem, min(1.5vh, 1.50vw), 0.5rem))',
  paddingS: 'calc(2 / 3 * clamp(0.5rem, min(2vh, 2.75vw), 1rem))',
  paddingM: 'calc(2 / 3 * clamp(1rem, min(2.5vh, 4vw), 2rem))',
  paddingL: 'calc(2 / 3 * clamp(1.5rem, min(3vh, 5.25vw), 3rem))',
  paddingXL: 'calc(2 / 3 * clamp(2rem, min(3.5vh, 6.50vw), 4rem))',
}

export default constants
