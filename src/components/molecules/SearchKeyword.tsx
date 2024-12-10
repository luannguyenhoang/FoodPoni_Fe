import { Button, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";

const SearchKeyword = () => {
  const navigate = useNavigate();

  const search = (value: string): void => {
    navigate("/products?search=" + value);
  };

  return (
    <Space.Compact className="w-full md:flex">
      <Input size="large" placeholder="Bạn tìm gì hôm nay?" />
      <Button size="large" type="primary" onClick={() => search("")}>
        Tìm kiếm
      </Button>
    </Space.Compact>
  );
};

export default SearchKeyword;
