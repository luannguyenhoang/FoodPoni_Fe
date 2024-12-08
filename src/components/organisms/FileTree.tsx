import { Button, Col, Menu } from "antd";
import { FolderOutlined, UploadOutlined } from "@ant-design/icons";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setShowModalFileUpload } from "@/redux/modules/fileUploads";

export const FileTree = () => {
  const dispatch = useDispatch();
  const { isUploadLoading } = useSelector((state: RootState) => state.fileUpload);

  return (
    <Col flex="200px">
      <Button
        loading={isUploadLoading}
        className="bg-primary text-white w-full mb-4"
        icon={<UploadOutlined />}
        onClick={() => dispatch(setShowModalFileUpload(true))}
      >
        Tải ảnh lên
      </Button>
      <Menu
        theme="light"
        mode="inline"
        defaultOpenKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <FolderOutlined />,
            label: "/public",
          },
          {
            key: "2",
            icon: <FolderOutlined />,
            label: "/folder-01",
          },
        ]}
      />
    </Col>
  );
};
