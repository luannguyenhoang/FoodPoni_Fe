import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateRoomCodeInputting } from "@/redux/modules/cartGroup.ts";
import "./CodeInput.scss";

export const CodeInput = () => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    dispatch(updateRoomCodeInputting({ value: code }));
  }, [code]);

  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="number"
          className="h-10 w-10 md:h-12 md:w-12 rounded-lg border-2 border-orange-400 bg-gray-200 p-3 text-center text-xl font-bold text-gray-800 outline-none hover:border-orange-500 focus:border-orange-600 focus:bg-white focus:ring-2 focus:ring-orange-300"
          maxLength={1}
          onChange={(e) => {
            const value = e.target.value;
            setCode((prevCode) => {
              const newCode = prevCode.split("");
              newCode[index] = value;
              return newCode.join("");
            });
            if (value && index < 6) {
              inputRefs.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            const index = inputRefs.current.findIndex((el) => el === e.target);
            if (e.key === "Backspace" && !code[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData("text").slice(0, 6);
            setCode(pasteData);
            pasteData.split("").forEach((value, index) => {
              if (inputRefs.current[index]) {
                inputRefs.current[index]!.value = value;
              }
            });
            const nextIndex = Math.min(pasteData.length, 5);
            inputRefs.current[nextIndex]?.focus();
          }}
          onFocus={(e) => {
            e.target.select();
          }}
          value={code[index] || ""}
        />
      ))}
    </div>
  );
};