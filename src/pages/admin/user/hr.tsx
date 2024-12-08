
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IHrRegister, ISkill } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callActiveHr, callDeleteHr, callDeleteSkill } from "@/config/api";
import queryString from 'query-string';
import { sfLike } from "spring-filter-query-builder";
import { fetchSkill } from "@/redux/slice/skillSlide";
import ModalSkill from "@/components/admin/skill/modal.skill";
import { fetchHr } from "@/redux/slice/hrSlide";

const SkillPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IHrRegister | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.hr.isFetching);
    const meta = useAppSelector(state => state.hr.meta);
    const hrRegister = useAppSelector(state => state.hr.result);
    const dispatch = useAppDispatch();

    const handleDeleteHrRegister = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteHr(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa Hr thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    
    const handleActiveHrRegister = async (dto:IHrRegister) => {
            const res = await callActiveHr(dto);
            if (res && +res.statusCode === 200) {
                message.success('Cấp quyền thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IHrRegister>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Tên công ty',
            dataIndex: 'companyName',
            hideInSearch: true,
        },

        {
            title: 'Địa chỉ công ty',
            dataIndex: 'companyAddress',
            hideInSearch: true,
        },

        {
            title: 'Email đăng ký',
            dataIndex: 'emailRegister',
            hideInSearch: true,
        },
        {
            title: 'Vị trí',
            dataIndex: 'position',
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
      
        {

            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>

                  

                        <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa skill"}
                        description={"Bạn có muốn cấp quyền cho Hr này ?"}
                        onConfirm={() => handleActiveHrRegister(entity)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <EditOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ffa500',
                                }}
                            />
                        </span>
                    </Popconfirm> 

                     <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa skill"}
                        description={"Bạn có chắc chắn muốn xóa skill này ?"}
                        onConfirm={() => handleDeleteHrRegister(entity.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm> 
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <DataTable<IHrRegister>
                actionRef={tableRef}
                headerTitle="Danh sách Skill"
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={hrRegister}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchHr({ query }))
                }}
                scroll={{ x: true }}
                pagination={
                    {
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                rowSelection={false}
                // toolBarRender={(_action, _rows): any => {
                //     return (
                //         <Button
                //             icon={<PlusOutlined />}
                //             type="primary"
                //             onClick={() => setOpenModal(true)}
                //         >
                //             Thêm mới
                //         </Button>
                //     );
                // }}
            />
            {/* <ModalSkill
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            /> */}
        </div>
    )
}

export default SkillPage;