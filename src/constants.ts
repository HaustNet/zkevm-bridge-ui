import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

import { Chain, Currency, Token } from "src/domain";
import { erc20Tokens } from "src/assets/erc20-tokens";
import { ReactComponent as EthChainIcon } from "src/assets/icons/chains/ethereum.svg";
import { ReactComponent as PolygonHermezChainIcon } from "src/assets/icons/chains/polygon-hermez-chain.svg";
import { cleanupCustomTokens } from "src/adapters/storage";

export const PREFERRED_CURRENCY_KEY = "currency";

export const PREFERRED_CURRENCY = Currency.USD;

export const PREFERRED_CURRENCY_PRECISION = 2;

export const SNACKBAR_AUTO_HIDE_DURATION = 5000;

export const AUTO_REFRESH_RATE = 15000;

export const REPORT_ERROR_FORM_ENTRIES = {
  url: "entry.2056392454",
  network: "entry.1632331664",
  platform: "entry.259085709",
  error: "entry.1383309652",
};

export const REPORT_ERROR_FORM_URL =
  "https://docs.google.com/forms/d/1YOvhK2RfTQmYO8DGMRqN7FYxRhBZd9jB6PZ7InJirTk/viewform";

export const BRIDGE_CALL_GAS_INCREASE_PERCENTAGE = 10;

export const ETH_TOKEN_LOGO_URI =
  "https://raw.githubusercontent.com/Uniswap/interface/main/src/assets/images/ethereum-logo.png";

export const getChains = ({
  ethereum,
  polygonHermez,
}: {
  ethereum: {
    rpcUrl: string;
    explorerUrl: string;
    contractAddress: string;
  };
  polygonHermez: {
    rpcUrl: string;
    explorerUrl: string;
    contractAddress: string;
    networkId: number;
  };
}): Promise<[Chain, Chain]> => {
  const ethereumProvider = new JsonRpcProvider(ethereum.rpcUrl);
  const polygonHermezProvider = new JsonRpcProvider(polygonHermez.rpcUrl);
  return Promise.all([ethereumProvider.getNetwork(), polygonHermezProvider.getNetwork()]).then(
    ([ethereumNetwork, polygonHermezNetwork]) => [
      {
        key: "ethereum",
        networkId: 0,
        Icon: EthChainIcon,
        provider: ethereumProvider,
        chainId: ethereumNetwork.chainId,
        contractAddress: ethereum.contractAddress,
        explorerUrl: ethereum.explorerUrl,
      },
      {
        key: "polygon-hermez",
        networkId: polygonHermez.networkId,
        Icon: PolygonHermezChainIcon,
        provider: polygonHermezProvider,
        chainId: polygonHermezNetwork.chainId,
        contractAddress: polygonHermez.contractAddress,
        explorerUrl: polygonHermez.explorerUrl,
      },
    ]
  );
};

export const getEtherToken = (chain: Chain): Token => {
  return {
    name: "Ether",
    address: ethers.constants.AddressZero,
    chainId: chain.chainId,
    symbol: "ETH",
    decimals: 18,
    logoURI: ETH_TOKEN_LOGO_URI,
  };
};

export const getChainTokens = (chain: Chain): Token[] => {
  const chainErc20Tokens: Token[] = erc20Tokens.filter((token) => token.chainId === chain.chainId);
  const tokens = [getEtherToken(chain), ...chainErc20Tokens];
  cleanupCustomTokens(tokens);
  return tokens;
};

export const getUsdtToken = ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}): Token => ({
  name: "Tether USD",
  address,
  chainId,
  symbol: "USDT",
  decimals: 6,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
});
