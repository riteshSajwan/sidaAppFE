interface ChartDataPoint {
  value: number;
  label: string;
}

interface CustomBarChartProps {
  data: ChartDataPoint[];
  frontColor?: string;
  width?: number;
  height?: number;
  roundedTop?: boolean;
  valuePosition?: 'inside' | 'top' | 'outside';
}
interface CustomLineChartProps {
  data: ChartDataPoint[];
  data2?: ChartDataPoint[];
  frontColor?: string;
  secondaryColor?: string;
  width?: number;
  height?: number;
  firstLabel?: string;
  secondLabel?: string;
}


export {ChartDataPoint ,CustomBarChartProps,CustomLineChartProps}