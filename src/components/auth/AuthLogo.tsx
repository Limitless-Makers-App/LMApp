/* eslint-disable @next/next/no-img-element */

/**
 * Auth ekranlarının logo bloğu. Giriş/kayıt ekranlarında mark + wordmark,
 * şifre sıfırlama ekranında yalnızca mark gösterilir.
 */
export function AuthLogo({ wordmark = true }: { wordmark?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <img src="/figma/logo-mark.svg" alt="" className="w-[191.2px]" />
      {wordmark && (
        <img
          src="/figma/logo-wordmark.svg"
          alt="Limitless Makers"
          className="mt-[11.3px] w-[195.6px]"
        />
      )}
    </div>
  );
}
