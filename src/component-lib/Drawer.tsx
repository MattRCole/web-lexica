/* eslint-disable no-duplicate-case */
import { useCallback, useEffect, useRef } from "react"
import { WithChildren } from "../util/types"
import { makeClasses } from '../util/classes'

import './Drawer.css'

export enum DrawerEnterFrom {
  HorizontalReadingDirection = 'horizontal-reading-direction',
  HorizontalAntiReadingDirection = 'horizontal-anti-reading-direction',
  LeftToRight = DrawerEnterFrom.HorizontalReadingDirection,
  RightToLeft = DrawerEnterFrom.HorizontalAntiReadingDirection,
  TopToBottom = 'top-to-bottom',
  BottomToTop = 'bottom-to-top',
  ForceLeftToRight = 'force-left-to-right',
  ForceRightToLeft = 'force-right-to-left',
}


export type DrawerProps = WithChildren<{
  enterFrom: DrawerEnterFrom
  /** @default {false} */
  open: boolean
  drawerRef?: React.MutableRefObject<HTMLDivElement | null>
  className?: string
}>

/**
 * Closes the drawer if an element outside of the drawer is closed.
 * @param drawerRef Reference to the drawer DOM node
 * @param setClosed Should be a stable function that is called if the drawer should be closed
 */
export const useTemporaryDrawer = (drawerRef: React.MutableRefObject<HTMLDivElement | null>, setClosed: () => void) => {
  const eventRef = useRef<React.MouseEvent | undefined>()
  useEffect(() => {
    const eventListener = (e: MouseEvent) => {
      if (drawerRef.current === null) return
      if (eventRef?.current?.nativeEvent === e) return

      if (drawerRef.current.classList.contains("drawer-inactive")) return

      console.log(`firing event for: ${drawerRef.current.classList}`)
      if (!drawerRef.current.contains(e.target as any)) {
        setClosed()
      }
    }

    document.body.addEventListener('click', eventListener)
    return () => {
      document.body.removeEventListener('click', eventListener)
    }
  }, [drawerRef, setClosed, eventRef])

  return useCallback((fn: React.MouseEventHandler<Element>) => (event: React.MouseEvent<HTMLDivElement>) => { eventRef.current = event; return fn(event) }, [eventRef])
}

const getLocaleDirection = (enterFrom: DrawerEnterFrom): string => {
  const documentDirection = getComputedStyle(document.body).direction
  switch (enterFrom) {
    case DrawerEnterFrom.TopToBottom:
    case DrawerEnterFrom.BottomToTop:
      return enterFrom
    case DrawerEnterFrom.ForceLeftToRight:
      return 'left-to-right'
    case DrawerEnterFrom.ForceRightToLeft:
      return 'right-to-left'
    case DrawerEnterFrom.LeftToRight:
    case DrawerEnterFrom.HorizontalReadingDirection:
      if (['rtl', 'rl'].includes(documentDirection)) return 'right-to-left'
      else return 'left-to-right'
    case DrawerEnterFrom.RightToLeft:
    case DrawerEnterFrom.HorizontalAntiReadingDirection:
      if (['ltr', 'lr'].includes(documentDirection)) return 'right-to-left'
      else return 'right-to-left'
    default:
      return enterFrom
  }
}

const Drawer = (props: DrawerProps): JSX.Element => {
  const {
    children,
    enterFrom,
    open,
    drawerRef: ref,
    className,
  } = props

  return <div
    ref={ref}
    className={makeClasses(
      className,
      'drawer-component',
      getLocaleDirection(enterFrom),
      { condition: open, true: 'drawer-active', false: 'drawer-inactive' },
    )}
  >
    {children}
  </div>
}

export default Drawer
