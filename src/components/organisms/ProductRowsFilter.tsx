import { Action } from "redux";
import { ProductRows } from "@/components/organisms/ProductRows";
import MenuFilter from "../molecules/MenuFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProductFilterRowProps {
  action: Action;
}

export function ProductRowsFilter({ action }: ProductFilterRowProps) {
  const { productKeywordSearch } = useSelector(
    (state: RootState) => state.product
  );

  return (
    <ProductRows action={action} hasBorder={true}>
      {!productKeywordSearch && <MenuFilter />}
    </ProductRows>
  );
}
