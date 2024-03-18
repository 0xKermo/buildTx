import { Router as FibrousRouter } from "fibrous-router-sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers";
import { Account, Call, RpcProvider } from "starknet";

const RPC_URL = "https://starknet-mainnet.infura.io/v3/139cae58e7d249bb86c254a9eb2caeb9";
const PUBLIC_KEY = "";
const PRIVATE_KEY = "";

async function buildTxn() {
  const fibrous = new FibrousRouter();
  const tokens = await fibrous.supportedTokens();

  const tokenInAddress = tokens["usdc"].address;
  const tokenOutAddress = tokens["STRK"].address;
  const tokenInDecimals = tokens["usdc"].decimals;
  const inputAmount = BigNumber.from(parseUnits("5", tokenInDecimals));

  const slippage = 0.005;
  const destination = "";
  const swapCall = await fibrous.buildTransaction(
    inputAmount,
    tokenInAddress,
    tokenOutAddress,
    slippage,
    destination
  );

  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
  });
  const account0 = new Account(provider, PUBLIC_KEY, PRIVATE_KEY, "1");
  const approveCall: Call = await fibrous.buildApprove(
    inputAmount,
    tokenInAddress
  );
  const resp = await account0.execute([approveCall, swapCall]);
  console.log(`https://starkscan.co/tx/${resp.transaction_hash}`);
}


buildTxn();