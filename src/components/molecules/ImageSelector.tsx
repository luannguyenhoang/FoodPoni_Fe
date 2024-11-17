import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { getThumbnail } from "@/utils/common";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Popconfirm, Tooltip } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ScrollPane } from "../atoms/ScrollPane";
import { FileContent } from "../organisms/FileContent";
import { FileTree } from "../organisms/FileTree";

export const ImageSelector = ({
  value,
  onOke,
  className,
}: {
  value?: string;
  onOke: (value: string) => void;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>();

  return (
    <>
      <div className="relative">
        <Button
          type="dashed"
          className={`${className} relative p-1`}
          onClick={() => setOpenDialog(true)}
        >
          {value ? (
            <img
              className="h-full w-full object-cover"
              src={getThumbnail(value)}
            />
          ) : (
            "Choose"
          )}
        </Button>
        {value && (
          <Tooltip title="Click to delete thumbnail">
            <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => onOke("")}
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
        )}
      </div>
      <Modal
        title="Choose thumbnail"
        open={openDialog}
        width={800}
        onCancel={() => setOpenDialog(false)}
        footer={[
          <Button key="back" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>,
          <Button
            key="link"
            type="primary"
            disabled={!selectedItem || selectedItem === value}
            onClick={() => {
              if (selectedItem) {
                onOke(selectedItem);
                setOpenDialog(false);
              }
            }}
          >
            Choose
          </Button>,
        ]}
      >
        <Flex>
          <FileTree />
          <ScrollPane maxHeight="h-[calc(100vh - 200px)]">
            <FileContent
              defaultSelectedValues={value ? [value] : []}
              fetchFileUploads={() =>
                dispatch(fetchFileUploadsAction({ queryParams: {} }))
              }
              onSelected={(items) => {
                setSelectedItem(items[0]);
              }}
              multiple={false}
            />
          </ScrollPane>
        </Flex>
      </Modal>
    </>
  );
};
