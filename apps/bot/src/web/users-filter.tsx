import { useState } from 'react';

import { Icon } from '@/web/primitives.tsx';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type {
  Web_UsersFilter_UsersFilter_AnyLabel,
  Web_UsersFilter_UsersFilter_Choose,
  Web_UsersFilter_UsersFilter_Choose_Next,
  Web_UsersFilter_UsersFilter_Choose_Returns,
  Web_UsersFilter_UsersFilter_ClassName,
  Web_UsersFilter_UsersFilter_Label,
  Web_UsersFilter_UsersFilter_OnChange,
  Web_UsersFilter_UsersFilter_Open,
  Web_UsersFilter_UsersFilter_OpenState,
  Web_UsersFilter_UsersFilter_Options,
  Web_UsersFilter_UsersFilter_Props,
  Web_UsersFilter_UsersFilter_Returns,
  Web_UsersFilter_UsersFilter_Selected,
  Web_UsersFilter_UsersFilter_SetOpen,
  Web_UsersFilter_UsersFilter_Value,
} from '@/types/web/users-filter.d.ts';

/**
 * Users Filter - Users Filter.
 *
 * A header menu that narrows the Users list to one choice, or shows everyone again.
 * The button reads the chosen option, so an active filter is visible without opening it.
 *
 * @param {Web_UsersFilter_UsersFilter_Props} props - Props.
 *
 * @returns {Web_UsersFilter_UsersFilter_Returns}
 *
 * @since 4.0.0
 */
export const UsersFilter = (props: Web_UsersFilter_UsersFilter_Props): Web_UsersFilter_UsersFilter_Returns => {
  const anyLabel: Web_UsersFilter_UsersFilter_AnyLabel = props['anyLabel'];
  const className: Web_UsersFilter_UsersFilter_ClassName = props['className'];
  const label: Web_UsersFilter_UsersFilter_Label = props['label'];
  const onChange: Web_UsersFilter_UsersFilter_OnChange = props['onChange'];
  const options: Web_UsersFilter_UsersFilter_Options = props['options'];
  const value: Web_UsersFilter_UsersFilter_Value = props['value'];
  const openState: Web_UsersFilter_UsersFilter_OpenState = useState<Web_UsersFilter_UsersFilter_Open>(false);
  const open: Web_UsersFilter_UsersFilter_Open = openState[0];
  const setOpen: Web_UsersFilter_UsersFilter_SetOpen = openState[1];
  const selected: Web_UsersFilter_UsersFilter_Selected = options.find((option) => option['value'] === value);

  useEscapeKey(() => setOpen(false), open);

  /**
   * Users Filter - Choose.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_UsersFilter_UsersFilter_Choose_Next} next - Next.
   *
   * @returns {Web_UsersFilter_UsersFilter_Choose_Returns}
   *
   * @since 4.0.0
   */
  const choose: Web_UsersFilter_UsersFilter_Choose = (next: Web_UsersFilter_UsersFilter_Choose_Next): Web_UsersFilter_UsersFilter_Choose_Returns => {
    setOpen(false);
    onChange(next);

    return;
  };

  return (
    <div className={`users-filter ${className}`}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={(selected === undefined) ? 'users-filter-button' : 'users-filter-button users-filter-button-active'}
        onClick={() => setOpen(open === false)}
        type="button"
      >
        <span>{(selected === undefined) ? label : selected['label']}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {(open === true) ? (
        <>
          <button
            aria-label="Close menu"
            className="menu-scrim"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div aria-label={label} className="menu users-filter-menu" role="menu">
            <button
              aria-checked={selected === undefined}
              onClick={() => choose('')}
              role="menuitemradio"
              type="button"
            >
              <span className="users-filter-option">{anyLabel}</span>
              {(selected === undefined) ? <Icon name="check" size={16} /> : null}
            </button>
            <hr />
            {options.map((option) => (
              <button
                aria-checked={option['value'] === value}
                key={option['value']}
                onClick={() => choose(option['value'])}
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
