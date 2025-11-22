
import { BrowserRouter, Route, Routes,  } from 'react-router-dom'
import { logger } from './util/logger'

import GameModes from './pages/GameModes'
import Home from './pages/Home'
import Lexicle from './pages/Lexicle'
import Multiplayer from './pages/Multiplayer'
import Preferences from './pages/Preferences'
import SinglePlayer from './pages/SinglePlayer'

import './App.css'
import './style/scrollbar.css'
import Banner, {
  RenderInBanner,
  useBannerContext
} from './components/Banner'
import Lexicons from './pages/Lexicons'
import NewGameMode from './pages/NewGameMode'
import SavedGames from './pages/SavedGames'
import { useTranslation } from 'react-i18next'
import { MouseEventHandler, useCallback, useMemo, useRef, useState } from 'react'
import { Translations } from './translations'
import { LanguageTitlesFn, TranslationsFn } from './translations/types'
import Languages from './pages/Languages'
import AndroidIntegration from './pages/AndroidIntegration'
import Button from './component-lib/Button'
import Drawer, { DrawerEnterFrom, useTemporaryDrawer } from './component-lib/Drawer'

const directions = ['top', 'bottom', 'left', 'right'] as const
const directionMap = {
  'top': DrawerEnterFrom.TopToBottom,
  'bottom': DrawerEnterFrom.BottomToTop,
  'left': DrawerEnterFrom.LeftToRight,
  'right': DrawerEnterFrom.RightToLeft
}
type Directions = (typeof directions)[number]
function DrawerTest() {

  const [drawerState, setDrawerState] = useState({ top: false, bottom: false, left: false, right: false})

  const closeDirections = useMemo(
    () => directions.reduce(
      (acc, d) => ({ ...acc, [d]: () => {console.log(`closing ${d}`); setDrawerState(p => ({ ...p, [d]: false }))}}),
      {} as {[D in Directions]: () => {}}
    ),
    [setDrawerState])
  const refs: { [D in Directions]: React.MutableRefObject<HTMLDivElement | null> } = {
    top: useRef(null),
    bottom: useRef(null),
    left: useRef(null),
    right: useRef(null)
  }

  const eventWrappers: { [D in Directions]: (fn: MouseEventHandler<Element>) => MouseEventHandler<any> } = {
    top: useTemporaryDrawer(refs.top, closeDirections.top),
    bottom: useTemporaryDrawer(refs.bottom, closeDirections.bottom),
    left: useTemporaryDrawer(refs.left, closeDirections.left),
    right: useTemporaryDrawer(refs.right, closeDirections.right),
  }

  return <div
    className='Page drawer-test'
  >
    {directions.map(direction => <Button key={direction} prompt={direction} onClick={eventWrappers[direction](() => setDrawerState(p => ({ ...p, [direction]: true })))}/>)}
    {directions.map(d => <Drawer className={d} enterFrom={directionMap[d]} open={drawerState[d]} key={d} drawerRef={refs[d]}>{d}</Drawer>)}
  </div>
}

function App() {
  logger.debug('loading app...')

  const { t: translationsFnUnwrapped, i18n: translationsI18n, ready: translationsReady } = useTranslation('translations', { useSuspense: false })
  const { t: languageTitlesFnUnwrapped, i18n: languageTitlesI18n, ready: languageTitlesReady } = useTranslation('language-titles', { useSuspense: false })
  const ready = translationsReady && languageTitlesReady

  const translationsFn = useCallback<TranslationsFn>((key, options) => {
    if (!ready) return key as any
    return translationsFnUnwrapped(key, options as any)
  }, [ready, translationsFnUnwrapped])
  const languageTitlesFn = useCallback<LanguageTitlesFn>((key, options) => {
    if (!ready) return key as any
    return languageTitlesFnUnwrapped(key, options as any)
  }, [ready, languageTitlesFnUnwrapped])

  const changeLanguage = useCallback((languageCode: string) => {
    translationsI18n.changeLanguage(languageCode)
    languageTitlesI18n.changeLanguage(languageCode)
  }, [translationsI18n, languageTitlesI18n])

  const { renderState, context } = useBannerContext()

  return (
      <div className="App">
        <Translations.Provider
          value={{ translationsFn, languageTitlesFn, changeLanguage, ready }}
        ><RenderInBanner.Provider
          value={context}
        >
          <BrowserRouter basename="/web-lexica">
            <Routes>
              <Route  path="/" element={<Home />}/>
              <Route path="/*" element={<>
                <Banner { ...renderState}/>
                <Routes>
                  <Route path="/game-modes" element={ <GameModes />} />
                  <Route path="/new-game-mode" element={ <NewGameMode />} />
                  <Route path="/lexicons" element={ <Lexicons />} />
                  <Route path="/languages" element={ <Languages />} />
                  <Route path="/multiplayer" element={ <Multiplayer />} />
                  <Route path="/preferences" element={ <Preferences />} />
                  <Route path="/android-integration" element={ <AndroidIntegration /> } />
                  <Route path="/singleplayer" element={ <SinglePlayer />} />
                  <Route path="/lexicle/*" element={ <Lexicle/>} />
                  <Route path='/saved-games' element={ <SavedGames />} />
                  <Route path='/drawer-test' element={ <DrawerTest />} />
                </Routes>
              </>} />
            </Routes>
          </BrowserRouter>
        </RenderInBanner.Provider>
        </Translations.Provider>
      </div>
  )
}

export default App
