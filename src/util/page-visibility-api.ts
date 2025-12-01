import { useEffect, useState } from "react"
import type { EnumType } from "./types"

export const VisibilityState = {
    Visible: 'visible',
    Hidden: 'hidden'
} as const

export type VisibilityStateType = EnumType<typeof VisibilityState>

const getVisibilityState = () => document.visibilityState === 'hidden' ? VisibilityState.Hidden : VisibilityState.Visible

export const usePageVisibility = (): VisibilityStateType => {
    const [visibilityState, setVisibilityState] = useState<VisibilityStateType>(getVisibilityState())

    useEffect(() => {
        const eventHandler = () => setVisibilityState(getVisibilityState())
        document.addEventListener('visibilitychange', eventHandler)
        return () => document.removeEventListener('visibilitychange', eventHandler)
    }, [setVisibilityState])

    return visibilityState
}
