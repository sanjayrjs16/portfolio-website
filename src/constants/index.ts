export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export const NOTIFICATION_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

export const NOTIFICATION_EMOJIS = {
  [NOTIFICATION_TYPES.SUCCESS]: '✅',
  [NOTIFICATION_TYPES.ERROR]: '❌',
  [NOTIFICATION_TYPES.INFO]: 'ℹ️',
  [NOTIFICATION_TYPES.WARNING]: '⚠️',
} as const;

export const DEFAULT_DURATION = 3000;
export const SMOKE_DURATION = 600;
export const SCROLL_ANIMATION_DURATION = 400; 