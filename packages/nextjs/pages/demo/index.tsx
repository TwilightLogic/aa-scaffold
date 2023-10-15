import dynamic from "next/dynamic";
import { NextPage } from "next";

const AACard = dynamic(async () => await import("~~/components/aaCard"), { ssr: false });
const Demo: NextPage = () => {
  return <AACard />;
};

export default Demo;
