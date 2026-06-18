function formatNumberWithUnit(num: number): string {
    switch (true) {
        case num >= 1e9:
            return `${(num / 1e9).toFixed(1).replace(/\.0$/, '')}B`; // Billions
        case num >= 1e6:
            return `${(num / 1e6).toFixed(1).replace(/\.0$/, '')}M`; // Millions
        case num >= 1e3:
            return `${(num / 1e3).toFixed(1).replace(/\.0$/, '')}K`; // Thousands
        default:
            return num.toString(); // Less than 1000, no formatting
    }
};

export { formatNumberWithUnit };