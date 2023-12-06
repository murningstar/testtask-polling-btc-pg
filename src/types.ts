type BtcUpdateType = {
    time: TimeInfo;
    disclaimer: string;
    chartName: string;
    bpi: Bpi;
};

type TimeInfo = {
    updated: string;
    updatedISO: string;
    updateduk: string;
};

type Bpi = {
    USD: CurrencyInfo;
    GBP: CurrencyInfo;
    EUR: CurrencyInfo;
};

type CurrencyInfo = {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
};

export type { BtcUpdateType };
