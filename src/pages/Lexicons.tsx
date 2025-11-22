import { useCallback, useContext } from 'react'

import {
  MetadataV1,
  setLanguageInLocalStorage,
  useLanguageCodeFromLocalStorage,
  useMultipleLanguageMetadata
} from '../game/language'
import { Translations } from '../translations'
import { makeClasses } from '../util/classes'
import { logger } from '../util/logger'
import { useSafeNavigateBack } from '../util/url'

import './Lexicons.css'
import { RMouseEvent } from '../util/elements'

const getBetaLabel = (metadata?: MetadataV1, betaLabel: string = '') => {
  const getLabel = (text: string) => <div className="lexicons-lexicon-beta-label">{text}</div>
  if (metadata?.isBeta === undefined) return getLabel('Loading...')
  return metadata.isBeta ? getLabel(betaLabel) : <></>
}

type LexiconProps = {
  languageCode: string,
  metadata?: MetadataV1,
  onClick: (langaugeCode: string, event: RMouseEvent) => void,
}

const Lexicon = ({
  languageCode,
  metadata,
  onClick,
}: LexiconProps): JSX.Element => {
  const translations = useContext(Translations)
  const title = translations.languageTitlesFn(languageCode as any)
  const beta = getBetaLabel(metadata, translations.translationsFn('pages.lexicons.isBeta'))
  const currentCode = useLanguageCodeFromLocalStorage()

  const classes = makeClasses('lexicons-lexicon', {
    condition: currentCode === languageCode,
    name: 'lexicons-lexicon-selected'
  })

  return <div
    className={classes}
    onClick={e => onClick(languageCode, e)}
  >
    <div className="lexicons-lexicon-title">{title}</div>
    {beta}
  </div>
}

export const LexiconList = (props: { onClick?: (languageCode: string, event: RMouseEvent) => void, className?: string } ): JSX.Element => {
  const { onClick: onClickProp, className = 'lexicons' } = props
  const { translationsFn } = useContext(Translations)
  const { loading, metadata } = useMultipleLanguageMetadata()
  const languages = Object.keys(metadata)

  const back = useSafeNavigateBack()

  const handleOnClick = useCallback((languageCode: string, e: RMouseEvent) => {
    logger.debug('setting lexicon code...', languageCode)
    setLanguageInLocalStorage(languageCode)
    if (onClickProp) {
      onClickProp(languageCode, e)
      return
    }
    back()
  }, [onClickProp, back])


  const getLexicon = (languageCode: string) => <Lexicon
      languageCode={languageCode}
      key={languageCode}
      metadata={metadata[languageCode]}
      onClick={handleOnClick}
    />

  if (loading) return <div className={makeClasses(className, "lexicons-loading")}>{translationsFn('general.loading')}</div>

  return <div className={className}>
    {languages.map(l => getLexicon(l))}
  </div>
}

export default function() {
  return <LexiconList className="Page lexicons scrollbar" />
}
