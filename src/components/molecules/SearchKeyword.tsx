import { searchProductsByCustomerAction } from "@/redux/modules/product";
import { Button, Input, Space } from "antd";
import { useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const SearchKeyword = () => {
  const dispatch = useDispatch();

  return (
    <Space.Compact className="w-full md:flex">
      <Input
        size="large"
        placeholder="Bạn tìm gì hôm nay?"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch(searchProductsByCustomerAction({ keyword: e.target.value }))
        }
      />
      <Button size="large" type="primary" icon={<SearchOutlined />}>
        Tìm kiếm
      </Button>
    </Space.Compact>
  );
};

export default SearchKeyword;
