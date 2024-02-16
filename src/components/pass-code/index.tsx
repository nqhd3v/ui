import React, { useEffect, useState } from "react";
import PassCodeInput from "./input";
import { twMerge } from "tailwind-merge";

export interface IPassCodeProps {
  length?: number;
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  onFullFilled?: (value: string) => void;
  inputElement?: React.ReactElement;
  className?: string;
  inputsClassName?: string;
  inputClassName?: string;
}

const PassCode: React.FC<IPassCodeProps> = ({
  length = 8,
  name = "nqh",
  value,
  inputElement,
  className,
  inputsClassName,
  inputClassName,
  onChange,
  onFullFilled,
}) => {
  const [internalValue, setInternalValue] = useState<string[]>(
    value ? value.split("") : Array(length).fill("")
  );

  const onItemChange = (index: number) => (newItemValue: string) => {
    setInternalValue((p) => {
      const newList = [...p];
      newList[index] = newItemValue;
      return newList;
    });
  };

  const handleFullFilled = () => {
    onFullFilled?.(internalValue.map((v) => v || " ").join(""));
  };

  useEffect(() => {
    if (value) {
      setInternalValue(value.split(""));
    }
  }, [value]);

  useEffect(() => {
    onChange?.(internalValue.map((i) => i || " ").join(""));
  }, [internalValue]);

  return (
    <div className={className}>
      <div className={twMerge("flex items-center gap-2", inputsClassName)}>
        {internalValue.map((itemValue, itemIndex) => (
          <PassCodeInput
            value={itemValue}
            onChange={onItemChange(itemIndex)}
            onRemovePrevious={() => onItemChange(itemIndex - 1)("")}
            onLastInputted={handleFullFilled}
            key={[name, "pass-code-inp", itemIndex].join("#")}
            element={inputElement}
            className={inputClassName}
          />
        ))}
      </div>
    </div>
  );
};

export default PassCode;
