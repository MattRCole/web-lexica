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
import { useContext } from 'react'
import { FontSize, FontSizeModifier, PaddingSizeModifier } from '../style/style'
import { ScreenOrientation, useOrientation } from '../util/hooks'
import { MaybeRender } from '../util/elements'
import { useLanguageCodeFromLocalStorage } from '../game/language'

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
        svgTitle={translations.translationsFn('pages.gameModes.title')}
        prompt={ruleset.name}
      />
    </div>
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
      prompt={preferences}
      svg={Info}
    />
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
        </div>
        <div className="home-side-b">
          <GameSettings />
        </div>
      </div>
    {/* </MaybeRender> */}
  </div>
}

export default Home
