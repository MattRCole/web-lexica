import { MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import Svg, { SvgComponent } from './Svg'

import { makeClasses } from '../util/classes'
import { WithChildren } from '../util/types'
import constants, { useConstants } from '../style/constants'
import { FontSize, FontSizeModifier, PaddingSizeModifier, fontSizeStepMap } from '../style/style'

import './Button.css'

export enum ButtonThemeType {
  Standard = 'standard',
  AltStandard = 'alternative-standard',
  Emphasis = 'emphasis'
}



export type ButtonProps = {
  /** @default {false} */
  disabled?: boolean,
  onClick?: MouseEventHandler<HTMLDivElement>,
  to?: string,
  /** @default {true} */
  roundedEdges?: boolean,
  /** @default {ButtonThemeType.Standard} */
  themeType?: ButtonThemeType,
  svg?: SvgComponent,
  /** @default prompt is used */
  svgTitle?: string,
  prompt: string,
  /** @default {FontSize.Body} */
  fontSize?: FontSize
  /** @default {FontSizeModifier.Medium} */
  fontSizeModifier?: FontSizeModifier
  /** @default {PaddingSizeModifier.Normal} */
  paddingSizeModifier?: PaddingSizeModifier,
  /** @default {true} */
  nowrap?: boolean
  /** @default {false} */
  svgToSide?: boolean
}

const contentColors: { [P in ButtonThemeType]: { enabled: string, disabled: string } } = {
  [ButtonThemeType.Emphasis]: { enabled: constants.colorBackgroundLight, disabled: constants.colorContentLowContrastDark },
  [ButtonThemeType.Standard]: { enabled: constants.colorContentDark, disabled: constants.colorContentLowContrastDark },
  [ButtonThemeType.AltStandard]: { enabled: constants.colorContentDark, disabled: constants.colorContentLowContrastDark }
}

const Button = (props: ButtonProps): JSX.Element => {
  const {
    svgTitle = props.prompt,
    to = '',
    fontSize = FontSize.Body,
    fontSizeModifier = FontSizeModifier.Medium,
    paddingSizeModifier = PaddingSizeModifier.Normal,
    themeType = ButtonThemeType.Standard,
    disabled = false,
    roundedEdges = true,
    nowrap = false,
    svgToSide = false,
  } = props
  const constants = useConstants()
  const usingLink = to !== '' && !props.disabled
  const universalClasses = makeClasses(
    themeType,
    `font-${fontSize}`,
    `font-mod-${fontSizeModifier}`,
    `padding-mod-${paddingSizeModifier}`,
    { condition: disabled, name: 'disabled' },
    { condition: roundedEdges, name: 'rounded-edges' },
    { condition: nowrap, name: 'nowrap'},
    { condition: svgToSide, true: 'with-svg-spread', false: 'with-svg-centered' }
  )

  const contentColor = contentColors[themeType][disabled ? 'disabled' : 'enabled']
  const fontSizeStep = fontSizeStepMap[fontSize][fontSizeModifier]
  const svgSize = constants.stepToFontSize(fontSizeStep)

  const Wrapper = usingLink
    ? ({ children }: WithChildren) => <Link
      to={to}
      className={makeClasses('button-component-link', universalClasses)}
      >
        {children}
      </Link>
    : ({ children }: WithChildren) => <>{children}</>

  return <div
    className={makeClasses('button-component', universalClasses)}
    onClick={props.disabled ? undefined : props.onClick}
  >
    <Wrapper>
      {props.svg ? <Svg.Customizable
        svg={props.svg}
        props={{
          title: svgTitle,
          height: `${svgSize}px`,
          width: `${svgSize}px`,
          fill: contentColor
        }}
      /> : ''}
      {props.prompt}
    </Wrapper>
  </div>
}

export default Button
