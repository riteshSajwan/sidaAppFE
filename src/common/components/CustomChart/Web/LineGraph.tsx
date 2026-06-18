import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Text, View } from 'react-native';
import { CustomLineChartProps } from 'src/common/components/CustomChart/Web/GraphUtils';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useReportStyle } from 'src/components/ReportsPage/ReportsDetailsStyle';


const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  data2,
  frontColor,
  secondaryColor,
  firstLabel,
  secondLabel,
  height
}) => {
  const { theme } = useAppTheme();
  const front = frontColor ?? theme.colors.surfaceLinkInverse;
  const secondary = secondaryColor ?? theme.colors.surfaceSuccessInverse;
  const textColor = theme.colors.textBody;
  const borderColor = theme.colors.borderMedium;
  const strokeColor = theme.colors.borderInverse;
  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 2500,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: data.map(item => item.label),
      labels: {
        style: {
          fontSize: '12px',
          colors: textColor,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: textColor,
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: data2 ? [front, secondary] : [front],
    grid: {
      borderColor: borderColor,
    },
    tooltip: {
      enabled: true,
      shared: data2 ? true : false,
      intersect: false,
      followCursor: true,
      theme: 'light',
      style: {
        fontSize: '12px',
      },
    },
    markers: {
      size: 0,
      colors: data2 ? [front, secondary] : [front],
      strokeColors: strokeColor,
      strokeWidth: 2,
      hover: {
        size: 6,
      }
    },
    dataLabels: {
      enabled: false,
    },
    
    fill: {
      type: data2 ? 'gradient' : 'solid',
      opacity: data2 ? 0.3 : 1,
      gradient: data2
        ? {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [frontColor + '40', secondaryColor + '40'],
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 100],
          }
        : undefined,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: firstLabel || 'Series 1',
      data: data.map(item => item.value),
    },
    ...(data2
      ? [
          {
            name: secondLabel || 'Series 2',
            data: data2.map(item => item.value),
          },
        ]
      : []),
  ];
  const ReportStyle = useReportStyle();
  return (
    <View>
      <ReactApexChart
        options={options}
        series={series}
        type={data2 ? 'area' : 'line'}
        height={height}
      />

      {firstLabel ? (
        <View style={[ReportStyle.profitTitleBar, { marginTop: theme.spacing.lg }]}>
          <View style={[ReportStyle.profitTitleBar, { gap: theme.spacing.xs }]}>
            <View style={[ReportStyle.dataIndicator, { backgroundColor: front }]} />
            <Text style={ReportStyle.dataIndicatorTitle}>{firstLabel}</Text>
          </View>
          {secondLabel && data2 && (
            <View style={[ReportStyle.profitTitleBar, { gap: theme.spacing.xs }]}>
              <View style={[ReportStyle.dataIndicator, { backgroundColor: secondary }]} />
              <Text style={ReportStyle.dataIndicatorTitle}>{secondLabel}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default CustomLineChart;