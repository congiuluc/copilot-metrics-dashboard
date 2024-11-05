import Dashboard, { IProps } from "@/features/seats/seats-page";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: "GitHub Copilot Seats Dashboard",
  description: "GitHub Copilot Seats Dashboard",
};
export const dynamic = "force-dynamic";
export default function Home(props: IProps) {

  let id = "initial-seats-dashboard";

  if (props.searchParams.startDate && props.searchParams.endDate) {
    id = `${id}-${props.searchParams.startDate}-${props.searchParams.endDate}`;
  }

  return (
    <Suspense fallback={<Loading />} key={id}>
      <Dashboard {...props} />
    </Suspense>
  );
}
