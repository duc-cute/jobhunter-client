import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Col,
  ConfigProvider,
  Divider,
  message,
  Modal,
  notification,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { useRef, useState } from "react";
import { callSaveHr } from "@/config/api";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
}

const RegisterHrModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen } = props;
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const formRef = useRef<ProFormInstance>();

  const navigate = useNavigate();

  const handleOkButton = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(false);
      navigate(`/login?callback=${window.location.href}`);
    } else {
      if (formRef.current) {
        formRef.current.submit();
      }
    }
  };

  return (
    <>
      <Modal
        title="Đăng ký HR"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        okText={isAuthenticated ? "Đăng ký" : "Đăng Nhập"}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose={true}
        width={800}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={enUS}>
              <ProForm
                formRef={formRef}
                onFinish={async (values) => {
                  console.log("valus", values);
                  const {
                    age,
                    companyAddress,
                    companyName,
                    emailRegister,
                    fullName,
                    gender,
                    permanentAddress,
                    position,
                  } = values;
                  const hr = {
                    age,
                    companyAddress,
                    companyName,
                    emailRegister,
                    fullName,
                    gender,
                    permanentAddress,
                    position,
                  };
                  const res = await callSaveHr(hr);
                  if (res.data) {
                    message.success(
                      "Bạn đã đăng kí Hr thành công,xin hãy đợi được duyệt!"
                    );
                    setIsModalOpen(false);
                  } else {
                    notification.error({
                      message: "Có lỗi xảy ra",
                      description: res.message,
                    });
                  }
                }}
                submitter={{
                  render: () => <></>,
                }}
              >
                <Row gutter={[10, 0]}>
                  <Col span={24}>
                    <div>
                      <h3>Thông tin cá nhân</h3>
                    </div>
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      label="Họ tên"
                      name={"fullName"}
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                      labelAlign="right"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      label="Chức vụ"
                      name={"position"}
                      labelAlign="right"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      fieldProps={{
                        type: "email",
                      }}
                      label="Email"
                      name={"emailRegister"}
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                      labelAlign="right"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormDigit
                      label="Tuổi"
                      name="age"
                      placeholder="Nhập nhập tuổi"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormSelect
                      name="gender"
                      label="Giới Tính"
                      valueEnum={{
                        MALE: "Nam",
                        FEMALE: "Nữ",
                        OTHER: "Khác",
                      }}
                      placeholder="Chọn giới tính"
                    />
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      label="Địa chỉ thường chú"
                      name={"permanentAddress"}
                      labelAlign="right"
                    />
                  </Col>
                  <Col span={24}>
                    <div>
                      <h3>Thông tin công ty</h3>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      label="Tên công ty"
                      name={"companyName"}
                      labelAlign="right"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                    />
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      label="Địa chỉ công ty"
                      name={"companyAddress"}
                      labelAlign="right"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                    />
                  </Col>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>
            Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Đăng ký
            HR" bạn nhé -.-
          </div>
        )}
        <Divider />
      </Modal>
    </>
  );
};
export default RegisterHrModal;
