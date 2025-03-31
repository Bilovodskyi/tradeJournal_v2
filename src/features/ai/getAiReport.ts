import { Trades } from "@/types";
import { getOtherDataForGridPageOne } from "../statistics/getDataForSummary";
import { autoGeneratedReportType } from "@/types/tradeAI.types";

// type Instruments = {
//     onlyNegativeWorstTradesSummary: Record<string, number>
//     best: RankedInstrument[]
//     worst: RankedInstrument[]
// }

type RankedInstrument = {
    instrumentName: string;
    totalResult: number;
};

export const getAIReport = (trades: Trades[]) => {
    const { chartTwo, chartThree } = getOtherDataForGridPageOne(trades);
    const report: autoGeneratedReportType = {
        moneyManagement: [],
        instruments: [],
    };

    const getMoneyManagementMessage = (
        position: number,
        type: string
    ): string => {
        if (position === 0) {
            return `Your percentage of successful ${type} positions is 0%`;
        } else if (position > 50) {
            return `The percentage of your successful ${type} positions is ${position}%, which means that even with a 1:1 gain-to-loss ratio, you are still able to earn money. However, make sure your ratio is at least 2:1.`;
        } else if (position >= 30 && position <= 50) {
            return `The percentage of your successful ${type} positions is ${position}%, which means that your money management should have a risk-reward ratio of at least ${Math.ceil(
                (1 - position / 100) / (position / 100)
            )}:1 in order to be profitable.`;
        } else if (position < 30 && position > 0) {
            return `The percentage of your successful ${type} positions is ${position}%, which is very low. You should consider either stopping ${type} positions altogether or maintaining a risk-reward ratio of at least ${Math.ceil(
                (1 - position / 100) / (position / 100)
            )}:1 in order to be profitable.`;
        }
        return "";
    };

    const getBestInstrumentsMessage = (
        instruments: RankedInstrument[]
    ): string[] => {
        if (instruments.length === 0) {
            return ["You didn't open profitable positions."];
        }
        const heading =
            "Here is a list of instruments with the most successful positions: ";

        const lines = instruments.map((instr) => {
            return `${instr.instrumentName}(${instr.totalResult}), `;
        });

        const suggestion =
            "I would suggest focusing on these instruments. It is important to remember to adjust your money management based on the profit/loss ratio.";

        return [heading, ...lines, suggestion];
    };

    const getWorstInstrumentsMessage = (
        instruments: Record<string, number>
    ): string[] => {
        if (instruments.length === 0) {
            return ["You didn't open unprofitable positions."];
        }
        const heading =
            "Here is a list of instruments you should potentially avoid: ";

        const lines = Object.keys(instruments).map((key) => {
            return key + " ";
        });

        const potentialSave = Object.values(instruments).reduce(
            (val, acc) => val + acc,
            0
        );

        const suggestion =
            "If you didn't open positions on this instruments. You would safe: ";

        return [
            heading,
            ...lines,
            suggestion,
            Math.abs(potentialSave).toString(),
        ];
    };

    const compareMoneyManagement = (
        positionSell: number,
        positionBuy: number
    ): string => {
        if (positionBuy > positionSell) {
            return "Your buy positions were more successful; you should consider opening more buy positions.";
        } else if (positionBuy < positionSell) {
            return "Your sell positions were more successful; you should consider opening more sell positions.";
        } else {
            return "Your sell and buy positions have the same returns.";
        }
    };

    function getBestAndWorstInstruments(trades: Trades[]) {
        const bestInstrumentTotals: Record<string, number> = {};
        const worstInstrumentTotals: Record<string, number> = {};

        for (const trade of trades) {
            const { instrumentName, result } = trade;
            if (Number(result) > 0) {
                if (!bestInstrumentTotals[instrumentName]) {
                    bestInstrumentTotals[instrumentName] = 0;
                }
                bestInstrumentTotals[instrumentName] += 1;
            } else if (Number(result) < 0) {
                if (!worstInstrumentTotals[instrumentName]) {
                    worstInstrumentTotals[instrumentName] = 0;
                }
                worstInstrumentTotals[instrumentName] += 1;
            }
        }

        const bestInstrumentTop3: RankedInstrument[] = Object.entries(
            bestInstrumentTotals
        ).map(([instrumentName, totalResult]) => ({
            instrumentName,
            totalResult,
        }));

        const worstInstrumentTop3: RankedInstrument[] = Object.entries(
            worstInstrumentTotals
        ).map(([instrumentName, totalResult]) => ({
            instrumentName,
            totalResult,
        }));

        bestInstrumentTop3.sort((a, b) => b.totalResult - a.totalResult);
        worstInstrumentTop3.sort((a, b) => b.totalResult - a.totalResult);

        const best3 = bestInstrumentTop3.slice(0, 3);
        const worst3 = worstInstrumentTop3.slice(0, 3);

        const worst3InstrumentNames = worst3.map((item) => item.instrumentName);

        const worstTradesSummary: Record<string, number> = {};

        for (const trade of trades) {
            const { instrumentName, result } = trade;

            if (worst3InstrumentNames.includes(instrumentName)) {
                if (!worstTradesSummary[instrumentName]) {
                    worstTradesSummary[instrumentName] = 0;
                }
                worstTradesSummary[instrumentName] += Number(result);
            }
        }

        const onlyNegativeWorstTradesSummary = Object.fromEntries(
            Object.entries(worstTradesSummary).filter(
                ([instrument, total]) => total < 0
            )
        );

        return {
            onlyNegativeWorstTradesSummary,
            best: best3,
            worst: worst3,
        };
    }

    const instruments = getBestAndWorstInstruments(trades);

    const messageSell = getMoneyManagementMessage(
        chartThree.succesfullSellPositions,
        "sell"
    );
    const messageBuy = getMoneyManagementMessage(
        chartTwo.succesfullBuyPositions,
        "buy"
    );
    const compareMessage = compareMoneyManagement(
        chartThree.succesfullSellPositions,
        chartTwo.succesfullBuyPositions
    );

    const bestInstrumentsMessage = getBestInstrumentsMessage(instruments.best);
    const worstInstrumentsMessage = getWorstInstrumentsMessage(
        instruments.onlyNegativeWorstTradesSummary
    );

    if (messageSell) report.moneyManagement.push(messageSell);
    if (messageBuy) report.moneyManagement.push(messageBuy);
    if (compareMessage) report.moneyManagement.push(compareMessage);

    if (bestInstrumentsMessage)
        report.instruments.push(...bestInstrumentsMessage);
    if (worstInstrumentsMessage)
        report.instruments.push(...worstInstrumentsMessage);

    return report;
};
