import { Error } from "@/type/types";
import { getMessage } from "@/utils/constraint";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IconType } from "antd/es/notification/interface";
import { AxiosError } from "axios";

export type MessageState = {
  readonly content: {
    readonly type: IconType;
    readonly message: string;
  } | null;
  readonly validate: Record<string, string>;
};

const initialState: MessageState = {
  content: null,
  validate: {},
};

const SLICE_NAME = "message";

const messageSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    addMessageSuccess: (
      state,
      action: PayloadAction<{ error: AxiosError<Error> }>
    ) => {
      if (action.payload.error.response) {
        if (action.payload.error.response.data.details) {
          return {
            ...state,
            validate: action.payload.error.response.data.details,
          };
        }
        return {
          ...state,
          content: {
            type: "error",
            message: getMessage(action.payload.error.response.data.code),
          },
        };
      }

      return {
        ...state,
        content: {
          type: "error",
          message: action.payload.error.message,
        },
      };
    },
    clearValidateSuccess: (state) => ({
      ...state,
      validate: {},
    }),
  },
});

export const { addMessageSuccess, clearValidateSuccess } = messageSlice.actions;

export default messageSlice.reducer;
