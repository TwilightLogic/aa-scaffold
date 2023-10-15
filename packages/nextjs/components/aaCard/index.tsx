"use client";

import { useAAWallet } from "~~/hooks/aa";

export default function AACard() {
  const { address, passkey, sessionKey, createPasskey, createAccount, createSessionKey, mintNFT } = useAAWallet();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      address: {address}
      {!passkey && (
        <button
          onClick={() => {
            createPasskey();
          }}
        >
          Create Passkey
        </button>
      )}
      {!address && (
        <button
          onClick={() => {
            createAccount();
          }}
        >
          Create Account
        </button>
      )}
      {address && passkey && (
        <button
          onClick={() => {
            createSessionKey();
          }}
        >
          Create SessionKey
        </button>
      )}
      {address && passkey && sessionKey && (
        <button
          onClick={() => {
            mintNFT();
          }}
        >
          {" "}
          Mint NFT
        </button>
      )}
    </div>
  );
}
