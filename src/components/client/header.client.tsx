import { useState, useEffect } from "react";
import {
  AmazonOutlined,
  CodeOutlined,
  ContactsOutlined,
  FireOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Drawer,
  Dropdown,
  MenuProps,
  Space,
  Tooltip,
  message,
} from "antd";
import { Menu, ConfigProvider } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";
import logo from "../../assets/images/logogif.gif";
import logo2 from "../../assets/images/logo2.gif";
import { removeAccents } from "@/config/utils";
import logoHr from "../../assets/images/icon-register-hr.png";
import RegisterHrModal from "./modal/resgisterHr.modal copy";

const Header = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [openHrRegister, setOpenHrRegister] = useState<boolean>(false);

  const [current, setCurrent] = useState("home");
  const location = useLocation();

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const items: MenuProps["items"] = [
    {
      label: <Link to={"/"}>Trang Chủ</Link>,
      key: "/",
      icon: <TwitterOutlined />,
    },
    {
      label: <Link to={"/job"}>Việc Làm IT</Link>,
      key: "/job",
      icon: <CodeOutlined />,
    },
    {
      label: <Link to={"/company"}>Top Công ty IT</Link>,
      key: "/company",
      icon: <RiseOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    ...(user.role?.name !== "USER" && user.role?.permissions?.length
      ? [
          {
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: "admin",
            icon: <FireOutlined />,
          },
        ]
      : []),

    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div className={styles["header-section"]}>
        <div className={styles["container"]}>
          {!isMobile ? (
            <div style={{ display: "flex", gap: 30, cursor: "pointer" }}>
              <div className={styles["brand-v2"]} onClick={() => navigate("/")}>
                {/* <img src={logo2} alt="itech" /> */}
                <AmazonOutlined style={{ color: "#eb2f96" }} />
                <p>ITECH</p>
              </div>
              <div className={styles["top-menu"]}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fff",
                      colorBgContainer: "none",
                      colorText: "#a7a7a7",
                    },
                  }}
                >
                  <Menu
                    // onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                  />
                </ConfigProvider>
                <div className={styles["extra"]}>
                  {isAuthenticated === false ? (
                    <Link to={"/login"}>Đăng Nhập</Link>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Dropdown
                        menu={{ items: itemsDropdown }}
                        trigger={["click"]}
                      >
                        <Space style={{ cursor: "pointer" }}>
                          <span
                            style={{
                              fontFamily: "Parisienne",
                              fontSize: "24px",
                            }}
                          >
                            Welcome {removeAccents(user?.name)}
                          </span>
                          <Avatar size="large">
                            {" "}
                            {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                          </Avatar>
                        </Space>
                      </Dropdown>
                      <Tooltip title="Đăng ký HR" color={"cyan"}>
                        <Avatar
                          src={<img src={logoHr} alt="avatar" />}
                          onClick={() => setOpenHrRegister(true)}
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["header-mobile"]}>
              <span>Your APP</span>
              <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
            </div>
          )}
        </div>
      </div>
      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
      <RegisterHrModal
        isModalOpen={openHrRegister}
        setIsModalOpen={setOpenHrRegister}
      />
    </>
  );
};

export default Header;
