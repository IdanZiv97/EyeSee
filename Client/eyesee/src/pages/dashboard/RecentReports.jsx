import Reports from "pages/reports/reports";
import React, { useEffect, useState } from "react";
import ReportsError from "pages/reports/reports-error"; // Adjust path as needed
import LoadingReports from "pages/reports/loading-reports";
import UserSession from "pages/utils/UserSession";
import config from "config";

export default function RecentReports({ store }) {
    async function fetchData(userId, storeName) {
        try {
            const response = await fetch(`${config.SERVER_DOMAIN}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    storeName: storeName,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Unknown server error");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    const [component, setComponent] = useState(<LoadingReports />);

    useEffect(() => {
        // Reset the component to loading state when store changes
        setComponent(<LoadingReports />);

        fetchData(UserSession.getUserId(), store)
            .then((rsp) => {
                if (!rsp || rsp.success === false || !rsp.data) {
                    const serverMessage = rsp?.message?.trim(); // Check if server message exists and is non-empty
                    setComponent(
                        <ReportsError
                            message={serverMessage || "Failed to fetch reports."}
                        />
                    );
                    return;
                }

                // Validate and normalize data
                const normalizedData = Array.isArray(rsp.data)
                    ? rsp.data
                    : rsp.data
                    ? [rsp.data]
                    : []; // Wrap single item in array or fallback to empty array

                if (normalizedData.length === 0) {
                    setComponent(<ReportsError message="No reports available." />);
                } else {
                    setComponent(
                        <Reports
                            data={normalizedData}
                            defaultReportsPerPage={3}
                            showButtons={false}
                        />
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);

                // Check for a specific error message from the server or show fallback
                const errorMessage =
                    (error.message && error.message.trim()) || "Failed to fetch";
                setComponent(<ReportsError message={errorMessage} />);
            });
    }, [store]); // Add `store` as a dependency to re-fetch on changes

    return component;
}
