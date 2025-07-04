import Dashboard, { IProps } from "@/features/premium/premium-page";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: "GitHub Copilot Premium Requests Dashboard",
  description: "GitHub Copilot Premium Requests Dashboard",
};

export const dynamic = "force-dynamic";

export default function Home(props: IProps) {
  let id = "initial-premium-dashboard";

  return (
    <Suspense fallback={<Loading />} key={id}>
      <Dashboard {...props} />
    </Suspense>
  );
}