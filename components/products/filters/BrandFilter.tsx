import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/lib/brands-api";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterSection } from "@/components/products/filters/FilterSection";

export function BrandFilter({
  selectedBrandIds,
  onToggle,
}: {
  selectedBrandIds: string[];
  onToggle: (brandId: string) => void;
}) {
  const { data: brands } = useQuery({ queryKey: ["brands"], queryFn: getBrands });

  if (!brands || brands.length === 0) return null;

  return (
    <FilterSection title="Thương hiệu">
      <ul className="space-y-2.5">
        {brands.map((brand) => (
          <li key={brand.id}>
            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={selectedBrandIds.includes(brand.id)}
                  onCheckedChange={() => onToggle(brand.id)}
                />
                {brand.name}
              </span>
              <span className="text-xs text-muted-foreground">{brand.productCount}</span>
            </label>
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}
