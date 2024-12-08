import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import UserPage from '../user';
import HrPage from './hr';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';

const UserTabs = () => {
    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Users',
            children: <UserPage />,
        },
        {
            key: '2',
            label: 'Manage Hr Resgister',
            children: <HrPage />,
        },

    ];
    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                />
            </Access>
        </div>
    );
}

export default UserTabs;