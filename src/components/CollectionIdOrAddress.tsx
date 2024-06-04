import { addressToCollectionId } from '@/lib/utils';
import React, { useMemo } from 'react';
import { Input } from './ui/input';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CollectionIdOrAddress: React.FC<InputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isAddress = useMemo(() => {
    return value?.startsWith('0x');
  }, [value]);

  const collectionId = useMemo(() => {
    if (isAddress) {
      const val = addressToCollectionId(value);
      return val;
    }
    return value;
  }, [isAddress, value]);

  return (
    <>
      <Input
        type="text"
        className="text-[16px] md:text-sm"
        placeholder="Collection ID or Address"
        value={value ?? ''}
        onChange={e => handleChange(e)}
        autoComplete="off"
      />
      {isAddress ? (
        <div className="flex flex-col w-full mt-2">
          <span className="pb-2 inner w-full">Collection Id from address</span>
          <div className="p-2 bg-muted w-full rounded-md">{collectionId}</div>
        </div>
      ) : null}
      {/* <Button
        type="submit"
        className="w-full bg-primary dark:bg-sendy"
        disabled={disabled}
      >
        Find Tokens
      </Button> */}
    </>
  );
};

export default CollectionIdOrAddress;
