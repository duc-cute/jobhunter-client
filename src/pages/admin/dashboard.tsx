import { Card, Col, Row, Statistic, DatePicker, Button, Form } from "antd";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { callFetchDashboard } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { fetchReport } from "@/redux/slice/dashboardSlide";

const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<{ fromDate?: Date; toDate?: Date }>({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const isFetching = useAppSelector((state) => state.dashBoard.isFetching);
  const data = useAppSelector((state) => state.dashBoard.data);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchReport(filters));
  }, []);

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
      let { data } = await callFetchDashboard(formatted);
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
        <Col span={24} md={8}>
          <Card title="Tổng số người dùng" bordered={false}>
            <Statistic
              title="Active Users"
              value={112893}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Tổng số tin tuyển" bordered={false}>
            <Statistic
              title="Tin tuyển dụng"
              value={13245}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Tổng số CV" bordered={false}>
            <Statistic title="CV đã nộp" value={9876} formatter={formatter} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
