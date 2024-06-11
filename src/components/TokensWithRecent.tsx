import { useQueryClient } from '@tanstack/react-query';
import TokenDropDown from './TokenDropDown';

export const TokensWithRecent = () => {
  const queryClient = useQueryClient();

  return (
    <div className="text-foreground">
      <h2>Select tokens in your wallet</h2>
      <div className=" pt-2 inner relative">
        <div
          className="absolute top-7 right-8 -translate-x-2 -translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
          onClick={async () => {
            await queryClient.invalidateQueries({ queryKey: ['tokens'] });
          }}
        >
          REFRESH TOKEN LIST
        </div>
        <TokenDropDown />
      </div>
    </div>
  );
};
