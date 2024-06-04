import React from 'react';
import MultipleSelector, {
  type Option,
} from '@/components/ui/multiple-selector';

export default function NftTokenSelector({
  placeholder,
  values,
  setValues,
  options,
}: {
  placeholder: string;
  values: Option[];
  setValues: (values: Option[]) => void;
  options: Option[];
}) {
  return (
    <div className="w-full ">
      <MultipleSelector
        className="w-full py-3 px-1 z-30 relative bg-background text-[16px] md:text-sm"
        // defaultOptions={options}
        options={options}
        value={values}
        onChange={setValues}
        placeholder={placeholder}
        creatable
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
}
