 export interface Props {
  startMonthYear: string;
  endMonthYear: string;
  onRangeSelect: (start: string, end: string) => void;
  placeholder: string;
  locale: string;
}