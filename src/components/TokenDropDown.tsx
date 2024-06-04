import { useAccountProvider } from '@/Providers/AccountProvider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { utils } from 'ethers';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { SendyProcess } from '@/types';

export default function TokenDropDown() {
  const { loadingTokens, fetchingTokens, tokensWithBalances } =
    useAccountProvider();

  const {
    setSelectedTokenId,
    setCurrentSendyProcess,
    selectedTokenId,
    selectedTokenSymbol,
    setSelectedTokenSymbol,
    assetTotals,
  } = useSendyProvider();

  const handleSelectValue = (val: string) => {
    const [tokenId, slug] = val.split('-sendy-');

    setSelectedTokenId(tokenId ? parseInt(tokenId) : 0);
    setSelectedTokenSymbol(slug!);
    if (val === '') {
      setCurrentSendyProcess(SendyProcess.StageOne);
    } else {
      setCurrentSendyProcess(SendyProcess.StageTwo);
    }
  };

  if (loadingTokens || fetchingTokens) {
    return (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Loading Tokens..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      onValueChange={val => handleSelectValue(val)}
      value={
        selectedTokenId
          ? `${selectedTokenId.toString()}-sendy-${selectedTokenSymbol.toLowerCase()}`
          : ''
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {tokensWithBalances &&
          tokensWithBalances.length > 0 &&
          tokensWithBalances.map(token => (
            <SelectItem
              key={token.tokenId}
              value={`${token.tokenId.toString()}-sendy-${token.slug.toLowerCase()}`}
            >
              {token.name} ({token.tokenId}) -{' '}
              {utils.formatUnits(
                token.balance - (assetTotals?.[token.tokenId] ?? 0n),
                token.decimals
              )}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
