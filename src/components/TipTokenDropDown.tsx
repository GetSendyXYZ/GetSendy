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

export default function TipTokenDropDown() {
  const {
    loadingTokens,
    fetchingTokens,
    balances,
    futurePassBalances,
    activeAccount,
  } = useAccountProvider();

  const {
    setTipTokenId,
    tipTokenId,
    tipTokenSymbol,
    setTipTokenSymbol,
    assetTotals,
  } = useSendyProvider();

  const handleSelectValue = (val: string) => {
    const [tokenId, slug] = val.split('-sendy-');

    setTipTokenId(tokenId ? parseInt(tokenId) : 0);
    setTipTokenSymbol(slug!);
  };

  const balancesToUse = activeAccount === 'eoa' ? balances : futurePassBalances;

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
        tipTokenId
          ? `${tipTokenId.toString()}-sendy-${tipTokenSymbol.toLowerCase()}`
          : ''
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {balancesToUse &&
          balancesToUse.length > 0 &&
          balancesToUse.map(token => (
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
