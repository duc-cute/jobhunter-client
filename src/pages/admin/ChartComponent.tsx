// ChartComponent.tsx
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ChartComponentProps {
  data: any; // hoặc bạn có thể định nghĩa rõ kiểu nếu có
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Tổng số tin tuyển dụng và CV theo công ty",
    },
    subtitle: {
      text: 'Source: <a target="_blank" href="https://www.indexmundi.com/agriculture/?commodity=corn">Thống kê tại Jobs hunter</a>',
    },
    xAxis: {
      categories: data?.listReportCompany?.map((el: any) => el?.name) || [],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số lượng thống kê",
      },
    },
    tooltip: {
      // valueSuffix: " (1000 MT)",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Tổng số Jobs",
        data: data?.listReportCompany?.map((el: any) => el?.totalJobs) || [],
      },
      {
        name: "Tổng số CV nộp",
        data: data?.listReportCompany?.map((el: any) => el?.totalResumes) || [],
      },
    ] as Highcharts.SeriesOptionsType[],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartComponent;
