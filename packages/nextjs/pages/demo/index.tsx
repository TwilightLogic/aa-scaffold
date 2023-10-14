import { NextPage } from "next";
import { useAAWallet } from "~~/hooks/aa";

const Demo: NextPage = () => {
  const { address, createPasskey } = useAAWallet();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      address: {address}
      {!address && (
        <button
          onClick={() => {
            createPasskey();
          }}
        >
          Create Account
        </button>
      )}
    </div>
  );
};

export default Demo;
