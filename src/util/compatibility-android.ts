import type { EnumType } from "./types"

export const HighestSupportedMinimumVersion = 20017

export const BreakingChanges = {
  Base64EncodedMultiplayerBoard: 20017
} as const

export type BreakingChangesType = EnumType<typeof BreakingChanges>
