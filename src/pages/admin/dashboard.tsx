import { Card, Col, Row, Statistic, DatePicker, Button, Form } from "antd";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { callFetchDashboard } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  UserOutlined,
  BankOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchReport } from "@/redux/slice/dashboardSlide";
import { IRangeTime } from "@/types/backend";
import ChartComponent from "./ChartComponent";

const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<{ fromDate?: Date; toDate?: Date }>({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const cardStyle = {
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyle = {
    fontSize: 32,
    marginBottom: 8,
    color: "#1890ff",
  };
  const isFetching = useAppSelector((state) => state.dashBoard.isFetching);
  const data = useAppSelector((state) => state.dashBoard.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (filters.fromDate && filters.toDate) {
      const payload: IRangeTime = {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };
      dispatch(fetchReport(payload));
    }
  }, [filters]);

  const formatter = (value: number | string) => (
    <CountUp end={Number(value)} separator="," />
  );

  const handleSearch = async (values: any) => {
    if (values.dateRange) {
      const [fromDate, toDate] = values.dateRange;
      const formatted = {
        fromDate: fromDate.startOf("day").toISOString(),
        toDate: toDate.endOf("day").toISOString(),
      };
      setFilters(formatted);
      await callFetchDashboard(formatted);
      // Call API tại đây với formatted.fromDate & formatted.toDate
      console.log("Call API with:", data);
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20 }}
        initialValues={{
          dateRange: [dayjs().startOf("day"), dayjs().endOf("day")],
        }}
      >
        <Form.Item name="dateRange" label="Chọn khoảng thời gian">
          <RangePicker allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      <Row gutter={[20, 20]}>
        <Col span={24} md={6}>
          <Card
            title="Tổng số người dùng"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              padding: 16,
              textAlign: "center",
            }}
          >
            <Statistic
              title={<div style={{ textAlign: "center" }}>Active Users</div>}
              value={data?.users}
              formatter={formatter}
              valueStyle={{ textAlign: "center", fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col span={24} md={6}>
          <Card
            title="Tổng số công ty"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              padding: 16,
              textAlign: "center",
            }}
          >
            <Statistic
              title="Công ty đăng ký"
              value={data?.companies}
              formatter={formatter}
              valueStyle={{ textAlign: "center", fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col span={24} md={6}>
          <Card
            title="Tổng số tin tuyển"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              padding: 16,
              textAlign: "center",
            }}
          >
            <Statistic
              title="Tin tuyển dụng"
              value={data?.jobs}
              formatter={formatter}
              valueStyle={{ textAlign: "center", fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col span={24} md={6}>
          <Card
            title="Tổng số CV"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              padding: 16,
              textAlign: "center",
            }}
          >
            <Statistic
              title="CV đã nộp"
              value={data?.cvs}
              formatter={formatter}
              valueStyle={{ textAlign: "center", fontSize: 32 }}
            />
          </Card>
        </Col>

        <Col span={24} md={24}>
          <ChartComponent data={data} />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
