import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

interface IPassCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onLastInputted?: () => void;
  onRemovePrevious?: () => void;
  element?: React.ReactElement;
  className?: string;
}

const PassCodeInput = forwardRef<HTMLInputElement, IPassCodeInputProps>(
  (
    { value, element, className, onChange, onLastInputted, onRemovePrevious },
    ref
  ) => {
    const onInputChange: ChangeEventHandler<HTMLInputElement> = ({
      target,
    }) => {
      if (/[a-zA-Z0-9-]/.test(target.value) || target.value === "") {
        onChange(target.value);
      }
    };
    const onInputKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
      e.stopPropagation();
      if (
        e.key !== "ArrowRight" &&
        e.key !== "ArrowLeft" &&
        e.key !== "Backspace" &&
        (e.key.length !== 1 || !/[a-zA-Z0-9-]/.test(e.key))
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowLeft") {
        if (
          e.currentTarget.value &&
          (e.currentTarget as HTMLInputElement).selectionStart
        ) {
          return;
        }
        const bef = e.currentTarget.previousElementSibling as HTMLInputElement;
        if (!bef) return;

        bef.setSelectionRange(1, 1);
        bef.focus();
        return;
      }

      if (e.key === "Backspace") {
        // remove current
        if (value && e.currentTarget.value === "") {
          return;
        }
        const bef = e.currentTarget.previousElementSibling as HTMLInputElement;
        // current has not value & has before element
        if (value === "" && bef) {
          bef.setSelectionRange(1, 1);
          bef.focus();
          onRemovePrevious?.();
        }

        return;
      }

      if (
        e.currentTarget.value &&
        !(e.currentTarget as HTMLInputElement).selectionEnd
      ) {
        return;
      }
      const next = e.currentTarget.nextElementSibling as HTMLInputElement;
      if (!next) {
        onLastInputted?.();
        return;
      }

      if (next.value) {
        next.setSelectionRange(1, 1);
      } else {
        next.setSelectionRange(0, 0);
      }
      next.focus();
    };

    if (element) {
      return React.cloneElement(element, {
        ...element.props,
        className,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          onInputChange(e);
          element.props?.onChange?.(e);
        },
        onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => {
          onInputKeyUp(e);
          element.props?.onKeyUp?.(e);
        },
        value,
        ref,
      });
    }

    return (
      <input
        type="text"
        maxLength={1}
        className={twMerge(
          "w-10 h-10 rounded-md border border-gray-400 bg-white p-0 text-center outline-none",
          className
        )}
        onKeyUp={onInputKeyUp}
        value={value}
        onChange={onInputChange}
        ref={ref}
      />
    );
  }
);
PassCodeInput.displayName = "PassCodeInput";

export default PassCodeInput;
