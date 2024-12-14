import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Popconfirm, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FileCard } from "../atoms/FileCard";
import { ScrollPane } from "../atoms/ScrollPane";
import { FileContent } from "../organisms/FileContent";
import { FileTree } from "../organisms/FileTree";

export const ImagesSelector = ({
  value,
  onOke,
  className,
}: {
  value?: Array<string>;
  onOke: (value: Array<string>) => void;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);

  useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  return (
    <>
      <div className="flex gap-2 items-center flex-wrap">
        {value &&
          value.map((it, index) => (
            <div key={`${it}-${index}`} className="relative ">
              <FileCard key={index} url={it} isCheck={false} />
              <Tooltip title="Nhấp để xóa hình ảnh">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa hình này không?"
                  onConfirm={() => onOke(value.filter((prev) => prev !== it))}
                >
                  <Button
                    className="absolute -top-2 -right-2"
                    size="small"
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            </div>
          ))}
        <Button
          type="dashed"
          className={`${className} p-1`}
          onClick={() => setOpenDialog(true)}
        >
          Chọn
        </Button>
      </div>

      <Modal
        title="Chọn ảnh"
        open={openDialog}
        width={800}
        onCancel={() => {
          setSelectedItems(value || []);
          setOpenDialog(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setSelectedItems(value || []);
              setOpenDialog(false);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="link"
            type="primary"
            disabled={selectedItems.length === 0}
            onClick={() => {
              if (selectedItems.length > 0) {
                onOke(selectedItems);
                setOpenDialog(false);
              }
            }}
          >
            Chọn
          </Button>,
        ]}
      >
        <Flex>
          <FileTree />
          <ScrollPane maxHeight="h-[calc(100vh - 200px)]">
            <FileContent
              defaultSelectedValues={selectedItems}
              fetchFileUploads={() =>
                dispatch(fetchFileUploadsAction({ queryParams: {} }))
              }
              onSelected={(items) => {
                setSelectedItems(items);
              }}
              multiple={true}
            />
          </ScrollPane>
        </Flex>
      </Modal>
    </>
  );
};
