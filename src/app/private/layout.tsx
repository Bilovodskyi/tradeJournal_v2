"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import Image from "next/image";

import { getAllTradeRecords } from "@/server/actions/trades";
import { getTradeSummary } from "@/features/calendar/getTradeSummary";
import { useAppDispatch } from "@/redux/store";
import {
    setInitialMonthViewSummary,
    setInitialTotalOfParticularYearSummary,
    setInitialYearViewSummary,
    setListOfTrades,
} from "@/redux/slices/tradeRecordsSlice";
import { useEffect } from "react";
import { SiClaude } from "react-icons/si";
import MobileNavigation from "@/components/MobileNavigation";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function PrivateLayout({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function fetchData() {
            console.log("re-run");
            const response = await getAllTradeRecords();
            dispatch(setListOfTrades(response));

            const monthViewTrades = getTradeSummary("day", response);

            dispatch(setInitialMonthViewSummary(monthViewTrades));
            const yearViewTrades = getTradeSummary("month", response);

            dispatch(setInitialYearViewSummary(yearViewTrades));
            const particularYearTrades = getTradeSummary("year", response);

            dispatch(
                setInitialTotalOfParticularYearSummary(particularYearTrades)
            );
        }
        fetchData();
    }, []);

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="flex flex-col h-svh md:h-screen bg-darkPrimary md:p-2">
                <header className="px-3 md:px-6 py-3 flex items-center justify-between bg-white md:rounded-t-3xl border-b md:border border-zinc-200">
                    <MobileNavigation />
                    <div className="hidden md:flex gap-2 items-center">
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={30}
                            height={30}
                        />
                        <p className="font-semibold text-[1rem] max-md:hidden">
                            Journal
                        </p>

                        <p className="font-semibold text-[1rem] max-md:hidden">
                            &
                        </p>
                        <SiClaude size={24} className="text-[#da7756]" />
                    </div>
                    <div className="hidden md:flex gap-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem className="px-4 py-2 text-[.8rem] text-zinc-700 rounded-md transition-colors hover:bg-zinc-100">
                                    <Link href="/private/calendar">
                                        Calendar{" "}
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="px-4 py-2 text-[.8rem] text-zinc-700 rounded-md transition-colors hover:bg-zinc-100">
                                    <Link href="/private/history">History</Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="px-4 py-2 text-[.8rem] text-zinc-700 rounded-md transition-colors hover:bg-zinc-100">
                                    <Link href="/private/statistics">
                                        Statistics
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-[.8rem] text-zinc-700">
                                        Trade AI
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <div className="test flex h-full w-full select-none flex-col justify-end rounded-md p-6">
                                                        <div className="mb-2 mt-4 text-lg text-white">
                                                            Trade AI
                                                        </div>
                                                        <p className="leading-4 text-[.75rem] text-zinc-100">
                                                            Powerful tool to
                                                            improve your results
                                                            with AI. Powered by
                                                            Claude 3.7 Sonnet.
                                                        </p>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md cursor-pointer">
                                                <Link href="/private/tradeAI">
                                                    <h1>Trade AI</h1>
                                                    <span className="leading-none text-[.75rem] text-zinc-400">
                                                        Generate an AI-powered
                                                        report.
                                                    </span>
                                                </Link>
                                            </li>
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md cursor-pointer">
                                                <Link href="/private/tokens">
                                                    <h1>Tokens</h1>
                                                    <span className="leading-none text-[.75rem] text-zinc-400">
                                                        Get more tokens to boost
                                                        your results.
                                                    </span>
                                                </Link>
                                            </li>
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md cursor-pointer">
                                                <Link href="/private/reports-history">
                                                    <h1>Archive</h1>
                                                    <span className="leading-none text-[.75rem] text-zinc-400">
                                                        View the history of your
                                                        reports.
                                                    </span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-[.8rem] text-zinc-700">
                                        Ecosystem
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md">
                                                <div className="flex gap-4 items-center">
                                                    <h1>AI Investor</h1>
                                                    <span className="text-[.8rem] bg-gradient-to-r from-emerald-400 to-blue-300 text-transparent bg-clip-text">
                                                        Coming soon...
                                                    </span>
                                                </div>
                                                <span className="leading-none text-[.75rem] text-zinc-400">
                                                    Use AI and advanced
                                                    algorithms to pick the right
                                                    investments
                                                </span>
                                            </li>
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md">
                                                <div className="flex gap-4 items-center">
                                                    <h1>Championship</h1>
                                                    <span className="text-[.8rem] bg-gradient-to-r from-emerald-400 to-blue-300 text-transparent bg-clip-text">
                                                        Coming soon...
                                                    </span>
                                                </div>
                                                <span className="leading-none text-[.75rem] text-zinc-400">
                                                    You have a demo account and
                                                    1 week to prove that
                                                    you&apos;re the best trader
                                                    in the competition.
                                                </span>
                                            </li>
                                            <li className="hover:bg-zinc-100 px-3 py-2 rounded-md">
                                                <div className="flex gap-4 items-center">
                                                    <h1>Articles</h1>
                                                    <span className="text-[.8rem] bg-gradient-to-r from-emerald-400 to-blue-300 text-transparent bg-clip-text">
                                                        Coming soon...
                                                    </span>
                                                </div>
                                                <span className="leading-none text-[.75rem] text-zinc-400">
                                                    Learn and share your
                                                    knowledge with others.
                                                </span>
                                            </li>
                                            {/* <li className="hover:bg-zinc-100 px-3 py-2 rounded-md">
                                                <div className="flex gap-4 items-center">
                                                    <h1>Rewords</h1>
                                                    <span className="text-[.8rem] bg-gradient-to-r from-emerald-400 to-blue-300 text-transparent bg-clip-text">
                                                        Coming soon...
                                                    </span>
                                                </div>
                                                <span className="leading-none text-[.75rem] text-zinc-400">
                                                    Become a creator to get
                                                    rewards.
                                                </span>
                                            </li> */}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        Hi,{" "}
                        {user
                            ? user.firstName ??
                              (user.username ?? "")
                                  .charAt(0)
                                  .toLocaleUpperCase() +
                                  (user.username ?? "").slice(1)
                            : ""}
                        <UserButton />
                    </div>
                </header>
                <div className="flex-1 bg-white md:rounded-b-3xl border border-zinc-200 border-t-0 overflow-scroll 2xl:overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}
