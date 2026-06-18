import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { CustomBarChartProps } from 'src/common/components/CustomChart/Web/GraphUtils';
import { useAppTheme } from 'src/common/context/AppTheme';


const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  frontColor,
  roundedTop,
  valuePosition = 'inside',
  height
}) => {
  const { theme } = useAppTheme();
  const isOutside = valuePosition === 'outside';
  const front = frontColor ?? theme.colors.surfaceInverse;
  const borderColor = theme.colors.borderMedium;
  const textColor = theme.colors.textBody;

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        // easing: 'easeinout',
        speed: 1500,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
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
    plotOptions: {
      bar: {
        borderRadius: roundedTop? 10:0,
        borderRadiusApplication: 'end',
        columnWidth: '45%',
        dataLabels: {
          position: valuePosition === 'inside' ? 'center' : 'top',
        },
        
      },
    },
    colors: [front],
    grid: {
      borderColor: borderColor,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: [isOutside ? theme.colors.textBody : theme.colors.textInverse],
      },
      offsetY: isOutside ? -20 : valuePosition === 'top' ? -10 : 0,
    },
  };

  const series = [
    {
      data: data.map(item => item.value),
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type='bar'
      height={height}
    />
  );
};

export default CustomBarChart;
