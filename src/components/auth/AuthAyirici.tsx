/** "veya" ayırıcısı — birinci ve ikinci auth yöntemi arasında. */
export function AuthAyirici() {
  return (
    <div className="my-[24px] flex items-center gap-[14px]">
      <span className="h-px flex-1 bg-lm-card-border" />
      <span className="font-inter text-helper text-lm-dim">veya</span>
      <span className="h-px flex-1 bg-lm-card-border" />
    </div>
  );
}
