'use client';

import { SECONDARY_BUTTON_CLASS } from './authFormStyles';

interface GoogleButonuProps {
  onClick: () => void;
  disabled?: boolean;
}

/** "Google ile devam et" — auth formlarındaki ikincil eylem. */
export function GoogleButonu({ onClick, disabled = false }: GoogleButonuProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={SECONDARY_BUTTON_CLASS}
    >
      Google ile devam et
    </button>
  );
}
