import { slice } from 'lodash';
import Link from 'next/link';
import { shortenAddress } from '../../utils/';

interface CellProps {
  value: string;
  type: 'tx' | 'address';
  txChain?: string | undefined;
}

const Cell = ({ value, type, txChain }: CellProps) => {
  const ethUrl = `https://etherscan.io/${type}/${value}`;
  const polyUrl = `https://polygonscan.com/${type}/${value}`;

  return <Link
    href={txChain === 'ETH' ? ethUrl : polyUrl}
    replace={false}
    target='_blank'
  >{shortenAddress(value)}</Link>;
};

export default Cell;
