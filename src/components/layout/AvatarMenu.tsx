/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AvatarMenuProps {
  className?: string;
}

const ITEM_CLASS =
  'w-full rounded-[10px] px-[10px] py-[9px] text-left font-inter text-label ' +
  'transition-colors hover:bg-lm-pill focus-visible:bg-lm-pill focus-visible:outline-none';

/**
 * Başlıktaki hesap ikonu ve açılır menüsü (Profil / Ayarlar / Çıkış Yap).
 *
 * Figma'daki tek hesap ikonunun yerini alır: 60.5px daire, kullanıcının
 * fotoğrafı varsa o, yoksa Figma'dan gelen nötr kişi silüeti gösterilir.
 * Dışarı tıklama ve ESC ile kapanır; açıldığında ilk öğeye odaklanır.
 */
export function AvatarMenu({ className }: AvatarMenuProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  // Dışarı tıklama ve ESC ile kapat
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Açılınca ilk öğeye odaklan
  useEffect(() => {
    if (open) {
      firstItemRef.current?.focus();
    }
  }, [open]);

  const displayName =
    user?.displayName || user?.email?.split('@')[0] || 'Kullanıcı';
  const email = user?.email ?? '';
  const photoURL = user?.photoURL ?? '';

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push('/login');
  };

  const goTo = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Kullanıcı menüsü"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex h-[60.5px] w-[60.5px] shrink-0 items-center justify-center overflow-hidden',
          'rounded-full transition-opacity hover:opacity-80',
          'focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-lm-accent',
        )}
      >
        {photoURL ? (
          <img src={photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          // Figma'nın hesap ikonu: beyaz daire + koyu kişi silüeti.
          <img src="/figma/user.svg" alt="" className="h-full w-full" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Kullanıcı menüsü"
          className={cn(
            'absolute top-full right-0 z-50 mt-[10px]',
            'min-w-[200px] max-w-[calc(100vw-24px)] overflow-hidden',
            'rounded-[14.4px] border-[1.5px] border-lm-card-border bg-lm-popover',
            'shadow-[0_15.4px_19.1px_rgba(0,0,0,0.25)]',
          )}
        >
          <div className="px-[16px] py-[13px]">
            <p className="truncate font-inter text-label font-semibold text-lm-text">
              {displayName}
            </p>
            {email && (
              <p className="mt-[2px] truncate font-inter text-helper text-lm-muted">
                {email}
              </p>
            )}
          </div>

          <div className="h-px bg-lm-card-border" />

          <div className="flex flex-col gap-[2px] p-[6px]">
            <button
              ref={firstItemRef}
              type="button"
              role="menuitem"
              onClick={() => goTo('/profil')}
              className={cn(ITEM_CLASS, 'text-lm-text')}
            >
              Profil
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => goTo('/ayarlar')}
              className={cn(ITEM_CLASS, 'text-lm-text')}
            >
              Ayarlar
            </button>
          </div>

          <div className="h-px bg-lm-card-border" />

          <div className="p-[6px]">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className={cn(ITEM_CLASS, 'text-lm-danger')}
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
