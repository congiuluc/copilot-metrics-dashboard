"use client";

import { ErrorPage } from "../common/error-page";
import { PremiumStats } from "./charts/premium-stats";
import { ModelsForRequests } from "./charts/models-for-requests";
import { ModelsUsage } from "./charts/models-usage";
import { DataProvider } from "./premium-state";
import { Header } from "./header";
import { FileUpload } from "./file-upload";
import { useState } from "react";
import { PremiumRequestRecord } from "@/features/common/models";

export interface IProps {
  searchParams?: any;
}

export default function PremiumDashboard(props: IProps) {
  const [data, setData] = useState<PremiumRequestRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoad = (loadedData: PremiumRequestRecord[], loadError?: string) => {
    if (loadError) {
      setError(loadError);
      setData([]);
    } else {
      setError(null);
      setData(loadedData);
    }
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <DataProvider premiumData={data}>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
        <Header />
        <div className="mx-auto w-full max-w-6xl container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-4">
              <FileUpload onDataLoad={handleDataLoad} />
            </div>
            {data.length > 0 && (
              <>
                <PremiumStats />
                <ModelsForRequests />
                <ModelsUsage />
              </>
            )}
          </div>
        </div>
      </main>
    </DataProvider>
  );
}