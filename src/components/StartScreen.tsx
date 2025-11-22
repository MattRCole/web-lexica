import { useCallback, useContext, useMemo } from 'react'
import { ReactComponent as PlayCircle } from '@material-design-icons/svg/round/play_circle.svg'
import { ReactComponent as Refresh } from '@material-design-icons/svg/round/refresh.svg'
import { ReactComponent as Android } from '@material-design-icons/svg/round/android.svg'
import { ReactComponent as CheckBox } from '@material-design-icons/svg/round/check_box.svg'
import { ReactComponent as CheckBoxOutlineBlank } from '@material-design-icons/svg/round/check_box_outline_blank.svg'

import GameModeDetails from './GameModeDetails'

import { Dictionary } from '../game/dictionary'
import { Translations } from '../translations'
import { Language } from '../game/language'

import './StartScreen.css'
import ShareGameQrCode, { Platform } from './game/ShareGameQrCode'
import { Rules } from '../game/rules'
import { Board } from '../game/board/hooks'
import Button, { ButtonThemeType } from '../component-lib/Button'
import { TranslationsFn } from '../translations/types'
import { isAndroidClient, memoizedRedirectToApp, useAndroidInteropSettings, redirectToApp } from '../util/android-interop'
import { useStaticValue } from '../util/hooks'
import { logger } from '../util/logger'
import { MaybeRender } from '../util/elements'
import { FontSize } from '../style/style'

export type StartScreenProps = {
  handleStart: () => any
  loading: boolean,
  error: boolean,
  showQrCode?: boolean,
  handleBoardRefresh?: () => void,
  pageTitle: string
}

const getTranslatedStrings = (joiningGame: boolean, translationsFn: TranslationsFn) => {
  return joiningGame ? {
    startGameButtonPrompt: translationsFn('pages.multiplayer.joinGame'),
    startGameHint: translationsFn('pages.multiplayer.joinGameHint'),
  } : {
    startGameButtonPrompt: translationsFn('pages.multiplayer.startGame'),
    startGameHint: translationsFn('pages.multiplayer.startGameHint'),
  }
}

const RedirectToAndroid = (props: {
  handleRedirect: () => void
}): JSX.Element => {
  const {
    handleRedirect
  } = props

  const { translationsFn } = useContext(Translations)
  const { autoAppRedirect, setAutoAppRedirect } = useAndroidInteropSettings()

  const openInAppPrompt = translationsFn('pages.multiplayer.openInAppPrompt')
  const alwaysOpenInAppPrompt = translationsFn('pages.multiplayer.alwaysOpenInAppPrompt')
  const alwaysOpenInAppConfirmation = translationsFn('pages.multiplayer.alwaysOpenInAppConfirmation')

  return (
    <>
      <div className='start-screen-android-app-redirect-options'>
        <Button
          svg={Android}
          prompt={openInAppPrompt}
          svgTitle={openInAppPrompt}
          onClick={handleRedirect}
        />
        <Button
          svg={autoAppRedirect ? CheckBox : CheckBoxOutlineBlank}
          prompt={alwaysOpenInAppPrompt}
          svgTitle={alwaysOpenInAppPrompt}
          onClick={() => setAutoAppRedirect(!autoAppRedirect)}
          nowrap
        />
      </div>
      <MaybeRender maybeRender={autoAppRedirect} >
        <div className="start-screen-auto-redirect-hint">
          {alwaysOpenInAppConfirmation}
        </div>
      </MaybeRender>
    </>
  )
}

const StartScreen: React.FC<StartScreenProps> = ({
  handleStart,
  loading,
  error,
  showQrCode,
  pageTitle,
  handleBoardRefresh
}) => {
  const languageContext = useContext(Language)
  const language = languageContext.metadata.name
  const { translationsFn, languageTitlesFn } = useContext(Translations)
  const translations = useMemo(() => getTranslatedStrings(!showQrCode, translationsFn), [showQrCode, translationsFn])
  const dictionary = useContext(Dictionary)
  const rules = useContext(Rules)
  const board = useContext(Board)

  const showRefreshButton = loading === false && error === false && showQrCode
  const disabled = loading || error
  const wordCount = loading
    ? translationsFn('general.loading')
    : error
    ? translationsFn('general.error')
    : translationsFn('pages.multiplayer.wordCount', { count: dictionary.boardDictionary.length })

  const languageTitle = languageTitlesFn(language as any)

  const { autoAppRedirect } = useAndroidInteropSettings()

  const showBigRedirectButton = useStaticValue(!showQrCode && autoAppRedirect)

  const handleAppRedirect = useCallback(() => {
    logger.debug('calling app redirect')
    redirectToApp({ ruleset: rules, board, language })
  }, [board, language, rules])

  const showAppRedirectOption = !showQrCode && isAndroidClient()

  if (showBigRedirectButton) {
    memoizedRedirectToApp({ ruleset: rules, board, language })

    return <div className="start-screen">
      <div className="start-screen-auto-open-in-app-button" >
        <Button
          fontSize={FontSize.Title}
          onClick={handleAppRedirect}
          prompt={translationsFn('pages.multiplayer.openInAppPrompt')}
          roundedEdges
          svg={Android}
          themeType={ButtonThemeType.Emphasis}
        />
      </div>
    </div>
  }

  return <div className="start-screen">
    <div className="start-screen-title">{pageTitle}</div>
    <div className="start-screen-language">{languageTitle}</div>
    <div className="start-screen-split-screen-helper">
      <div className="start-screen-side-a">
        <div className="start-screen-game-mode-title">
          {rules.name}
        </div>
        <GameModeDetails/>
        <div className="start-screen-action-bar">
          <div className="start-screen-word-count">{wordCount}</div>
          <MaybeRender
            maybeRender={showRefreshButton}
          >
            <Button onClick={handleBoardRefresh} prompt='Refresh Board' svg={Refresh} />
          </MaybeRender>
        </div>
      </div>
      <div className="start-screen-side-b">
        <MaybeRender maybeRender={!loading && showQrCode} >
          <div className="start-screen-share-game-qr-code">
            <ShareGameQrCode
              rules={rules}
              language={language}
              board={board}
              platform={Platform.Android}
            />
          </div>
        </MaybeRender>
        <MaybeRender maybeRender={showAppRedirectOption} >
          <RedirectToAndroid handleRedirect={handleAppRedirect} />
        </MaybeRender>
      </div>
    </div>
    <div className="start-screen-start-prompt">{translations.startGameHint}</div>
    <Button
      fontSize={FontSize.Title}
      svg={PlayCircle}
      prompt={translations.startGameButtonPrompt}
      onClick={handleStart}
      roundedEdges={false}
      themeType={ButtonThemeType.Emphasis}
      disabled={disabled}
    />
  </div>
}

export default StartScreen
