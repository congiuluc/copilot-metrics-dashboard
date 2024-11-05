"use client";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { useDashboard } from "./seats-state";
import { Card, CardContent } from "@/components/ui/card";
import { ChartHeader } from "../common/chart-header";



export const SeatsTable = () => {
    const { filteredData } = useDashboard();
    const currentData = filteredData[0];

    return (
        <Card className="col-span-4">
            <ChartHeader
                title="Assigned Seats"
                description=""
            />

            <CardContent>
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Create Date</TableHead>
                            <TableHead>Update Date</TableHead>
                            <TableHead>Last Activity Date</TableHead>
                            <TableHead>Last Activity Editor</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Pending Cancellation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            currentData?.seats?.map((data, index) => {
                                const createdAt = new Date(data.created_at);
                                const updatedAt = new Date(data.updated_at);
                                const lastActivityAt = new Date(data.last_activity_at);
                                const pendingCancellationDate = data.pending_cancellation_date ? new Date(data.pending_cancellation_date) : null;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{data.assignee.login}</TableCell>
                                        <TableCell>{createdAt.toLocaleDateString()}</TableCell>
                                        <TableCell>{updatedAt.toLocaleDateString()}</TableCell>
                                        <TableCell>{lastActivityAt.toLocaleDateString()}</TableCell>
                                        <TableCell>{data.last_activity_editor}</TableCell>
                                        <TableCell>{data.plan_type}</TableCell>
                                        <TableCell>{pendingCancellationDate ? pendingCancellationDate.toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 col-span-4">

        </div>
    );
};
