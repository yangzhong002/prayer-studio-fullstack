type TagOption = {
  id: string;
  label: string;
  description: string;
};

export function TagSelector({
  options,
  value,
  onChange,
}: {
  options: TagOption[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
      return;
    }
    onChange([...value, id]);
  }

  return (
    <div className="tagGrid">
      {options.map((option) => {
        const active = value.includes(option.id);
        return (
          <button
            type="button"
            key={option.id}
            className={`tag ${active ? 'tagActive' : ''}`}
            onClick={() => toggle(option.id)}
            title={option.description}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
