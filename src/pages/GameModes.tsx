import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Add } from '@material-design-icons/svg/round/add.svg'

import { Ruleset, Rulesets, setCurrentRuleset, useRulesets, useRulesFromStorage } from '../game/rules'
import GameModeDetails from '../components/GameModeDetails'
import constants, { useConstants } from "../style/constants"
import { makeClasses } from '../util/classes'
import { useBannerBadge } from '../components/Banner'
import { Translations } from '../translations'
import { logger } from '../util/logger'
import { RMouseEvent } from '../util/elements'

import './GameModes.css'

type ModeProps = {
  rulesetTuple: [string, Ruleset]
  handleOnClick: (id: string, event: RMouseEvent) =>  void,
  isSelected: boolean
}

const Mode = ({
  rulesetTuple,
  handleOnClick,
  isSelected
}: ModeProps): JSX.Element => {

  const [id, ruleset] = rulesetTuple

  const { fontSizeSubscript } = useConstants()

  const classNames = makeClasses(
    'game-modes-ruleset',
    { condition: isSelected, name: 'game-modes-ruleset-selected' }
  )

  return <div
    className={classNames}
    onClick={(e) => handleOnClick(id, e)}
  >
    <div className="game-mode-ruleset-name">
      {ruleset.name}
    </div>
    {isSelected ? <GameModeDetails
      ruleset={rulesetTuple[1]}
      size={fontSizeSubscript}
      color={constants.colorContentDark}
      /> : ''}
  </div>
}

type ModesListProps = {
  rulesets: Rulesets,
  selectedRulesetId: string
  handleOnClick: (id: string, event: RMouseEvent) => void
}

const ModesList = ({
  rulesets: rulesetsObject,
  selectedRulesetId,
  handleOnClick
}: ModesListProps): JSX.Element => {
  const rulesets = Object.entries(rulesetsObject)

  logger.debug(rulesets)

  const getMode = (ruleset: typeof rulesets[number]) => <Mode
    rulesetTuple={ruleset}
    isSelected={ruleset[0] === selectedRulesetId}
    key={ruleset[0]}
    handleOnClick={handleOnClick}
  />

  return <div className="game-modes-ruleset-list">
    {rulesets.map(getMode)}
  </div>
}

const GameModes = (props: { onSelect?: (gameModeId: string, event: RMouseEvent) => void }): JSX.Element => {
  const { onSelect: onClickProp } = props
  const { translationsFn } = useContext(Translations)

  const rulesets = useRulesets()
  const selectedRulesetId = useRulesFromStorage()[1]
  const navigate = useNavigate()

  const handleAddGameModeOnClick = useCallback(() => navigate('/new-game-mode'), [navigate])

  useBannerBadge({
    svgTitle: translationsFn('pages.gameModes.addGameMode'),
    svg: Add,
    onClick: handleAddGameModeOnClick,
    prompt: translationsFn('pages.gameModes.addGameMode')
  })


  const handleOnClick = useCallback((id: string, e: RMouseEvent) => {
    if (id === selectedRulesetId) {
      onClickProp ? onClickProp(id, e) : navigate('/')
      return
    }

    setCurrentRuleset(id)
  }, [selectedRulesetId, navigate, onClickProp])

  return <div className="Page game-modes">
    <ModesList
      rulesets={rulesets}
      selectedRulesetId={selectedRulesetId}
      handleOnClick={handleOnClick}
    />
  </div>
}

export default GameModes
