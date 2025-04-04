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
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { useRef, useState } from "react";
import { callFetchCompany, callSaveHr } from "@/config/api";
import { DebounceSelect } from "@/components/admin/user/debouce.select";
import { ICompanySelect } from "@/components/admin/user/modal.user";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
}

const RegisterHrModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [isSelectCompany, setIsSelectCompany] = useState(true);
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
  async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
    const res = await callFetchCompany(`page=1&size=100&name ~ '${name}'`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: `${item.id}` as string,
        };
      });
      return temp;
    } else return [];
  }
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
                    companyId: values?.company?.value,
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
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                      labelAlign="right"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormDigit
                      label="Tuổi"
                      name="age"
                      placeholder="Nhập nhập tuổi"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || value >= 18) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Tuổi phải từ 18 trở lên!")
                            );
                          },
                        }),
                      ]}
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
                  {isSelectCompany ? (
                    <>
                      <Col span={24}>
                        <ProForm.Item
                          name="company"
                          label="Thuộc Công Ty"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn company!",
                            },
                          ]}
                        >
                          <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn công ty"
                            fetchOptions={fetchCompanyList}
                            style={{ width: "100%" }}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={24}>
                        <p className="text text-normal">
                          Chưa có thông tin công ty ?{" "}
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => setIsSelectCompany(false)}
                          >
                            Điền thông tin công ty
                          </span>
                        </p>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col span={24}>
                        <ProFormText
                          label="Tên công ty"
                          name={"companyName"}
                          labelAlign="right"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không bỏ trống",
                            },
                          ]}
                        />
                      </Col>
                      <Col span={24}>
                        <ProFormText
                          label="Địa chỉ công ty"
                          name={"companyAddress"}
                          labelAlign="right"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không bỏ trống",
                            },
                          ]}
                        />
                      </Col>
                      <Col span={24}>
                        <span
                          style={{
                            color: "blue",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => setIsSelectCompany(true)}
                        >
                          <Tooltip title="Quay lại">
                            <ArrowLeftOutlined />
                          </Tooltip>
                        </span>
                      </Col>
                    </>
                  )}
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
