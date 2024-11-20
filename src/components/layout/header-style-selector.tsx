import { useHeaderStyle } from "@/hooks/use-header-style";
import { headerLayouts } from "@/config/layouts";
import { Select } from "@/components/ui/select";

export function HeaderStyleSelector() {
  const { style, setStyle } = useHeaderStyle();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="header-style" className="text-sm font-medium">
        Estilo do Header
      </label>
      <Select
        id="header-style"
        value={style}
        onValueChange={setStyle}
      >
        {headerLayouts.map((layout) => (
          <Select.Option key={layout.id} value={layout.id}>
            {layout.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
