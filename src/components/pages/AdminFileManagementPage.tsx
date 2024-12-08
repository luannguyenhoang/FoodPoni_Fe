import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { Flex } from "antd";
import { useDispatch } from "react-redux";
import { FileContent } from "../organisms/FileContent";
import { FileTree } from "../organisms/FileTree";
import { AdminLayout } from "../templates/AdminLayout";

export const AdminFileManagementPage = () => {
  const dispatch = useDispatch();

  return (
    <AdminLayout>
      <Flex gap="16px">
        <FileTree />
        <FileContent
          fetchFileUploads={() =>
            dispatch(fetchFileUploadsAction({ queryParams: {} }))
          }
        />
      </Flex>
    </AdminLayout>
  );
};
