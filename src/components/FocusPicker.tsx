import {
  FOCUS_AREAS,
  toggleFocusArea,
  type FocusAreaId,
} from "../user-focus";

export interface FocusPickerProps {
  selected: FocusAreaId[];
  onChange: (next: FocusAreaId[]) => void;
}

export function FocusPicker({ selected, onChange }: FocusPickerProps) {
  return (
    <section className="focus-picker" aria-labelledby="focus-heading">
      <h2 id="focus-heading">我关心的方向</h2>
      <p className="focus-picker-lede">
        只展示对你<strong>有帮助</strong>、你也<strong>愿意看</strong>的内容。可随时调整，至少保留一项。
      </p>
      <div className="focus-chips" role="group" aria-label="选择关心的人生方向">
        {FOCUS_AREAS.map((area) => {
          const active = selected.includes(area.id);
          return (
            <button
              key={area.id}
              type="button"
              className={`focus-chip${active ? " focus-chip--active" : ""}`}
              aria-pressed={active}
              onClick={() => onChange(toggleFocusArea(selected, area.id))}
            >
              <span className="focus-chip-label">{area.label}</span>
              <span className="focus-chip-hint">{area.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
