import i18next from 'i18next';
 
const useCurrencyFormatter = () => {
 
    return (amount: number , currency:string) => {
        if (!currency) return amount.toString();
        const language = i18next.language;
 
        try {
            return new Intl.NumberFormat(language, {
                style: 'currency',
                currency: currency,
            }).format(amount);
        } catch (error) {
            console.error('Invalid currency code:', currency);
            return amount.toString();
        }
    };
};
 
export default useCurrencyFormatter;
 