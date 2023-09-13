import { useEthers, Sepolia } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "./useContracts";
import { utils } from 'ethers';
import { toast } from "react-toastify";
const chain = process.env.REACT_APP_CHAIN as string;

export const useRequestGameHash = () => {
  const { GameContract } = useContracts();
  const { switchNetwork, account, activateBrowserWallet } = useEthers();

  return useCallback(
    async (bid: string, percent: string, isGreater: boolean) => {
      if (!GameContract) return;
      await switchNetwork(Number(chain));
      activateBrowserWallet();
      try {
        const txPromise = await GameContract.requestGameHash(utils.parseEther(bid), percent, isGreater);
        const tx = await txPromise.wait();
        toast.success('Requested!', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
        return tx;
      } catch (error: any) {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Check console logs for error";
        console.error(error);
        console.error(errorMessage);
        toast.error('Err! See console', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
      }
    },
    [GameContract, switchNetwork, account]
  );
};