import { useState } from 'react';

import { Icon } from '@/web/primitives.tsx';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type { ReactElement } from 'react';

import type {
  Web_Components_UsersFilter_Option,
  Web_Components_UsersFilter_Props,
} from '@/types/web/components.d.ts';

/**
 * Users Filter.
 *
 * A header menu that narrows the Users list to one choice, or shows everyone again.
 * The button reads the chosen option, so an active filter is visible without opening it.
 *
 * @since 4.0.0
 */
export const UsersFilter = ({
  anyLabel,
  className,
  label,
  onChange,
  options,
  value,
}: Web_Components_UsersFilter_Props): ReactElement => {
  const [
    open,
    setOpen,
  ] = useState<boolean>(false);
  const selected: Web_Components_UsersFilter_Option | undefined = options.find((option: Web_Components_UsersFilter_Option): boolean => option['value'] === value);

  useEscapeKey((): void => setOpen(false), open);

  /**
   * Users Filter - Choose.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const choose = (next: string): void => {
    setOpen(false);
    onChange(next);
  };

  return (
    <div className={`users-filter ${className}`}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={(selected === undefined) ? 'users-filter-button' : 'users-filter-button users-filter-button-active'}
        onClick={(): void => setOpen(!open)}
        type="button"
      >
        <span>{(selected === undefined) ? label : selected['label']}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {(open) ? (
        <>
          <button
            aria-label="Close menu"
            className="menu-scrim"
            onClick={(): void => setOpen(false)}
            type="button"
          />
          <div aria-label={label} className="menu users-filter-menu" role="menu">
            <button
              aria-checked={selected === undefined}
              onClick={(): void => choose('')}
              role="menuitemradio"
              type="button"
            >
              <span className="users-filter-option">{anyLabel}</span>
              {(selected === undefined) ? <Icon name="check" size={16} /> : null}
            </button>
            <hr />
            {options.map((option: Web_Components_UsersFilter_Option): ReactElement => (
              <button
                aria-checked={option['value'] === value}
                key={option['value']}
                onClick={(): void => choose(option['value'])}
                role="menuitemradio"
                type="button"
              >
                <span className="users-filter-option">{option['label']}</span>
                {(option['value'] === value) ? <Icon name="check" size={16} /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
