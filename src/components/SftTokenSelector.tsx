import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { Select } from './ui/select';

import type { Dispatch, SetStateAction } from 'react';

export default function SftTokenSelector({
  placeholder,
  value,
  setValue,
  options,
  values,
  setValues,
  quantity,
  setQuantity,
  quantities,
  setQuantities,
}: {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
  values: Array<string>;
  setValues: Dispatch<SetStateAction<Array<string>>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  quantities: Array<number>;
  setQuantities: Dispatch<SetStateAction<Array<number>>>;
}) {
  return (
    <div className="w-full ">
      <Select onValueChange={setValue} value={value}>
        <SelectTrigger className="w-full py-3 px-1 z-30 relative bg-background text-[16px] md:text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
