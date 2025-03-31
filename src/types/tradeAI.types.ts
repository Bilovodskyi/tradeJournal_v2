interface TradingComments {
    generalObservations: string[];
    recommendations: string[];
}

export interface ApiResponse {
    claudeComments: TradingComments;
}

export interface dialogWindowType {
    type: "user" | "system";
    content: string[];
}

export type ReportType = {
    moneyManagement: dialogWindowType[];
    instruments: dialogWindowType[];
    timeManagement: dialogWindowType[] | null;
};

export type autoGeneratedReportType = {
    moneyManagement: string[];
    instruments: string[];
};

export type Category = "moneyManagement" | "instruments" | "timeManagement";

export type ReportsEntry = {
    createdAt: string;
    reportId: string;
    numberOfMessages: number;
    isFavorite: boolean;
};
