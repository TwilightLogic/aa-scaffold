"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { BigNumber, ethers } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";
import { SessionKeySigner, SmartAccount } from "smart-accounts";
import { Client, Presets } from "userop";
import AAconfig from "~~/public/AAconfig.json";
import { WebauthnSigner } from "~~/utils/aa/userop";
import { createPasskeyCredential } from "~~/utils/aa/webauthn";

export function useAAWallet() {
  const [address, setAddress] = useLocalStorage<string | null>(`smart-accounts:account:${AAconfig.chainId}`, null);
  const [passkey, setPasskey] = useLocalStorage<string | null>(`smart-accounts:key`, null);
  const [sessionKey, setSessionKey] = useLocalStorage<string | null>(`smart-accounts:SessionKey`, null);

  const createPasskey = async () => {
    setPasskey(JSON.stringify(await createPasskeyCredential("SmartAccounts")));
    setAddress(null);
  };

  const createAccount = async () => {
    if (!passkey) {
      throw Error("create passkeys first");
    }
    try {
      const signer = new WebauthnSigner(JSON.parse(passkey).registration, AAconfig.webauthnValidator);

      const client = await Client.init(AAconfig.rpc, {
        entryPoint: AAconfig.entrypoint,
        overrideBundlerRpc: AAconfig.bundler,
      });

      const accountBuilder = await SmartAccount.init(signer, AAconfig.rpc, {
        overrideBundlerRpc: AAconfig.bundler,
        entryPoint: AAconfig.entrypoint,
        factory: AAconfig.accountFactory,
        paymasterMiddleware: Presets.Middleware.verifyingPaymaster(AAconfig.paymaster, { type: "payg" }),
      });

      const response = await client.sendUserOperation(accountBuilder);
      await response.wait();
      setAddress(accountBuilder.getSender());
    } catch (e) {
      console.error(e);
    }
  };

  const createSessionKey = async () => {
    if (!passkey || !address) {
      throw Error("create passkeys or account first");
    }
    try {
      const ecdsaWallet = ethers.Wallet.createRandom();
      setSessionKey(ecdsaWallet._mnemonic().phrase);
      const signer = new WebauthnSigner(JSON.parse(passkey).registration, AAconfig.webauthnValidator);

      const client = await Client.init(AAconfig.rpc, {
        entryPoint: AAconfig.entrypoint,
        overrideBundlerRpc: AAconfig.bundler,
      });
      const accountBuilder = await SmartAccount.init(signer, AAconfig.rpc, {
        overrideBundlerRpc: AAconfig.bundler,
        entryPoint: AAconfig.entrypoint,
        factory: AAconfig.accountFactory,
        paymasterMiddleware: Presets.Middleware.verifyingPaymaster(AAconfig.paymaster, { type: "payg" }),
      });

      const validAfter = Math.floor(new Date().getTime() / 1000);
      // three hours
      const validUntil = validAfter + 10800;

      const validatorData = ethers.utils.solidityPack(
        ["bytes20", "bytes6", "bytes6"],
        [
          ecdsaWallet.address,
          hexZeroPad(BigNumber.from(validUntil).toHexString(), 6),
          hexZeroPad(BigNumber.from(validAfter).toHexString(), 6),
        ],
      );

      const enableValidator = new ethers.utils.Interface(["function enableValidator(address,bytes)"]);
      const enableValidatorCallData = enableValidator.encodeFunctionData("enableValidator", [
        AAconfig.sessionKeyValidator,
        validatorData,
      ]);
      const execute = new ethers.utils.Interface(["function execute(address,uint256,bytes)"]);
      const executeCallData = execute.encodeFunctionData("execute", [address, 0, enableValidatorCallData]);
      accountBuilder.setCallData(executeCallData);

      const response = await client.sendUserOperation(accountBuilder);
      console.log({ text: `create session key opHash: ${response.userOpHash}` });
      const userOperationEvent = await response.wait();
      console.log({
        text: "create session key txHash: ",
        link: {
          // @ts-ignore
          text: userOperationEvent!.transactionHash,
          href: `https://testnet.iotexscan.io/tx/${userOperationEvent?.transactionHash}`,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const mintNFT = async () => {
    if (!address || !passkey || !sessionKey) {
      throw Error("create passkeys or account first");
    }
    try {
      const signer = new SessionKeySigner(ethers.Wallet.fromMnemonic(sessionKey), AAconfig.sessionKeyValidator);

      const client = await Client.init(AAconfig.rpc, {
        entryPoint: AAconfig.entrypoint,
        overrideBundlerRpc: AAconfig.bundler,
      });
      const accountBuilder = await SmartAccount.new(address, signer, AAconfig.rpc, {
        overrideBundlerRpc: AAconfig.bundler,
        entryPoint: AAconfig.entrypoint,
        factory: AAconfig.accountFactory,
        paymasterMiddleware: Presets.Middleware.verifyingPaymaster(AAconfig.paymaster, { type: "payg" }),
      });
      const execute = new ethers.utils.Interface(["function execute(address,uint256,bytes)"]);
      const executeCallData = execute.encodeFunctionData("execute", [AAconfig.nftAddr, 0, "0x1249c58b"]);
      accountBuilder.setCallData(executeCallData);

      const response = await client.sendUserOperation(accountBuilder);
      console.log({ text: `mint nft opHash: ${response.userOpHash}` });
      const userOperationEvent = await response.wait();
      console.log({
        text: "mint nft txHash: ",
        link: {
          text: userOperationEvent!.transactionHash,
          href: `https://testnet.iotexscan.io/tx/${userOperationEvent?.transactionHash}`,
        },
      });
    } finally {
    }
  };

  return { address, passkey, sessionKey, createPasskey, createAccount, createSessionKey, mintNFT };
}
