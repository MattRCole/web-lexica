import { ReactComponent as EmojiEvents } from '@material-design-icons/svg/round/emoji_events.svg'
import { ReactComponent as PlayCircle } from '@material-design-icons/svg/round/play_circle.svg'
import { ReactComponent as GroupAdd } from '@material-design-icons/svg/round/group_add.svg'
import { ReactComponent as Grid } from '@material-design-icons/svg/round/grid_on.svg'
import { ReactComponent as Settings } from '@material-design-icons/svg/round/settings.svg'
import { ReactComponent as Redo } from '@material-design-icons/svg/round/redo.svg'
import { ReactComponent as Gamepad } from '@material-design-icons/svg/round/gamepad.svg'
import { ReactComponent as Info } from '@material-design-icons/svg/round/info.svg'

import { useRulesFromStorage } from '../game/rules'
import './Home.css'
import { Translations } from '../translations'
import { useHighScore } from '../game/high-scores'
import { useSavedGameList } from '../game/save-game'
import MainTitle from '../components/MainTitle'
import Button from '../component-lib/Button'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FontSize, FontSizeModifier, PaddingSizeModifier, fontSizeStepMap } from '../style/style'
import { useOrientation } from '../util/hooks'
import { MaybeRender, RMouseEvent } from '../util/elements'
import { useLanguageCodeFromLocalStorage } from '../game/language'
import GameModeDetails from '../components/GameModeDetails'
import { useConstants } from '../style/constants'
import { makeClasses } from '../util/classes'
import GameModes from './GameModes'
import { LexiconList } from './Lexicons'

const GameSettings = (): JSX.Element => {
  const [ruleset] = useRulesFromStorage()
  const fontSize = FontSize.Body
  const fontSizeModifier = FontSizeModifier.Medium
  const gameLanguageCode = useLanguageCodeFromLocalStorage()

  const translations = useContext(Translations)

  const preferences = translations.translationsFn('pages.home.preferences')

  return <div className="home-game-options">
    <div className="home-game-options-side-a">

      <Button
        to="/lexicons"
        fontSize={fontSize}
        fontSizeModifier={fontSizeModifier}
        svg={Gamepad}
        prompt={translations.languageTitlesFn(gameLanguageCode as any)}
        svgTitle={translations.translationsFn('general.lexicon')}
      />
      <Button
        to='/game-modes'
        fontSize={fontSize}
        fontSizeModifier={fontSizeModifier}
        svg={EmojiEvents}
        svgTitle={translations.translationsFn('pages.home.gameModeSelection')}
        prompt={ruleset.name}
      />
    </div>
    <div className="home-game-options-side-b">
    <Button
      to='/preferences'
      fontSize={fontSize}
      fontSizeModifier={fontSizeModifier}
      svg={Settings}
      svgTitle={preferences}
      prompt={preferences}
    />
    <Button
      to="/about"
      fontSize={fontSize}
      fontSizeModifier={fontSizeModifier}
      prompt={translations.translationsFn('pages.home.about')}
      svg={Info}
    />
    </div>
  </div>

}

const PlayGameButtons = (): JSX.Element => {
  const savedGames = useSavedGameList()
  const fontSizing = FontSize.Title
  const fontSizeModifier = FontSizeModifier.Large

  const { translationsFn } = useContext(Translations)

  return <div className="home-game-buttons">
    <div className="home-game-buttons-side-a">
      <Button
        to='/singleplayer'
        svg={PlayCircle}
        fontSize={fontSizing}
        fontSizeModifier={fontSizeModifier}
        paddingSizeModifier={PaddingSizeModifier.Small}
        prompt={translationsFn('pages.home.newGame')}
        svgToSide
      />
      <Button
        to='/multiplayer'
        svg={GroupAdd}
        fontSize={fontSizing}
        fontSizeModifier={fontSizeModifier}
        paddingSizeModifier={PaddingSizeModifier.Small}
        prompt={translationsFn('pages.home.multiplayer')}
        svgToSide
      />
    </div>
    <div className="home-game-buttons-side-b">
      <Button
        to='/lexicle'
        svg={Grid}
        fontSize={fontSizing}
        fontSizeModifier={fontSizeModifier}
        prompt={translationsFn('pages.home.tryLexicle')}
        svgToSide
      />
      <MaybeRender maybeRender={savedGames?.length > 0}>
        <Button
            to="/saved-games"
            fontSize={fontSizing}
            fontSizeModifier={fontSizeModifier}
            svg={Redo}
            prompt={translationsFn('pages.home.resumeGame')}
            svgToSide
          />
      </MaybeRender>
    </div>
  </div>
}

const HighScore = (): JSX.Element => {
  const [{ name }, currentId] = useRulesFromStorage()
  const { translationsFn } = useContext(Translations)

  const score = useHighScore(currentId)
  return <div className="home-high-score">
    <div>{translationsFn('pages.home.gameMode', { gameMode: name })}</div>
    <div>{translationsFn('pages.home.highScore', { score })}</div>
  </div>
}

const AdditionalDetails = (): JSX.Element => {
  enum DrawerContents {
    GameMode = 'game-mode',
    Lexicon = 'lexicon'
  }
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerContents, setDrawerContents] = useState(DrawerContents.GameMode)
  const [{ name: gameMode }] = useRulesFromStorage()
  const lexiconCode = useLanguageCodeFromLocalStorage()
  const translations = useContext(Translations)
  const { stepToFontSize } = useConstants()
  const fontSize = FontSize.Headline
  const fontModifier = FontSizeModifier.Small
  const gameDetailSize = stepToFontSize(fontSizeStepMap[fontSize][fontModifier] - 1)

  const onDrawerSelect = useCallback((_: string, e: RMouseEvent) => {
    e.preventDefault()
    setShowDrawer(false)
  }, [setShowDrawer])

  const dismissDrawer = useCallback((e: RMouseEvent) => {
    e.preventDefault()
    setShowDrawer(false)
  }, [setShowDrawer])

  const drawerRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      setShowDrawer(p => {
        if (p === false) return p
        document.getElementsByClassName('home-additional-details')
        if (e.target !== drawerRef.current) return false

        return p
      })
    }
    document.addEventListener('click', listener)
    return () => document.removeEventListener('click', listener)
  }, [setShowDrawer, drawerRef])

  return <>
    <div
      className={makeClasses(
        'home-additional-details',
        { condition: showDrawer, name: 'dimmed'},
      )}
      onClick={showDrawer ? dismissDrawer : undefined}
    >
      <div className="home-additional-details-game-mode">
        {translations.translationsFn('pages.home.gameModeSelection')}
        <div className="home-additional-details-game-mode-button-container">
          <Button
            prompt={gameMode}
            fontSize={FontSize.Headline}
            fontSizeModifier={FontSizeModifier.Small}
            onClick={() => {
              setDrawerContents(DrawerContents.GameMode)
              setShowDrawer(true)
            }}
            disabled={showDrawer}
          />
        </div>
        <div className="home-additional-details-game-mode-details-container">
          <GameModeDetails size={gameDetailSize}/>
        </div>

      </div>
      <div className="home-additional-details-lexicon">
        {translations.translationsFn('general.lexicon')}
        <div className="home-additional-details-lexicon-button-container">
          <Button
            prompt={translations.languageTitlesFn(lexiconCode as any)}
            fontSize={FontSize.Headline}
            fontSizeModifier={FontSizeModifier.Small}
            onClick={() => {
              setDrawerContents(DrawerContents.Lexicon)
              setShowDrawer(true)
            }}
            disabled={showDrawer}
          />
        </div>
      </div>
    </div>
    <div
      className={makeClasses(
        "home-additional-details-drawer",
        { condition: showDrawer, true: 'show-draw-active', false: 'show-drawer-inactive' }
      )}
      ref={drawerRef as any}
    >
      <MaybeRender
        maybeRender={drawerContents===DrawerContents.GameMode}
      >
        <div>
          <GameModes onSelect={onDrawerSelect}/>
        </div>
      </MaybeRender>
      <MaybeRender
        maybeRender={drawerContents===DrawerContents.Lexicon}
      >
        <LexiconList onClick={onDrawerSelect} className="lexicons scrollbar home-additional-details-drawer-lexicons"/>
      </MaybeRender>
    </div>
  </>
}

const Home = () => {
  const { translationsFn } = useContext(Translations)
  const orientation = useOrientation()
  return <div className="Page home">
    <HighScore />
    {/* <MaybeRender maybeRender={orientation === ScreenOrientation.Portrait}> */}
      {/* <MainTitle title={translationsFn('pages.home.headlineTitle')} subtitle={translationsFn('pages.home.subtitle')} />
      <div className="home-buttons-container">
        <PlayGameButtons />
        <GameSettings />
      </div> */}
    {/* </MaybeRender>
    <MaybeRender maybeRender={orientation === ScreenOrientation.Landscape}> */}
      <div className="home-side-container">
        <div className="home-side-a">
          <MainTitle title={translationsFn('pages.home.headlineTitle')} subtitle={translationsFn('pages.home.subtitle')} />
          <PlayGameButtons />
          <GameSettings />
        </div>
        <div className="home-side-b">
          <AdditionalDetails />
        </div>
      </div>
    {/* </MaybeRender> */}
  </div>
}

export default Home
