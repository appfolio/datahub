import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { FileDoneOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useEntityData } from '../../EntityContext';
import { Assertions } from './Assertions';
import TabToolbar from '../../components/styled/TabToolbar';
import { useGetValidationsTab } from './useGetValidationsTab';
import { ANTD_GRAY } from '../../constants';

const TabTitle = styled.span`
    margin-left: 4px;
`;

const TabButton = styled(Button)<{ selected: boolean }>`
    background-color: ${(props) => (props.selected && ANTD_GRAY[3]) || 'none'};
    margin-left: 4px;
`;

enum TabPaths {
    ASSERTIONS = 'Assertions',
    TESTS = 'Tests',
}

const DEFAULT_TAB = TabPaths.ASSERTIONS;

type Props = {
    entityName: string;
    useEntityAssertionsQuery: any;
};

/**
 * Component used for rendering the Entity Validations Tab.
 */
export const ValidationsTab = ({ entityName, useEntityAssertionsQuery }: Props): JSX.Element => {
    const { entityData } = useEntityData();
    const history = useHistory();
    const { pathname } = useLocation();

    const totalAssertions = (entityData as any)?.assertions?.total;

    const { selectedTab, basePath } = useGetValidationsTab(pathname, Object.values(TabPaths));

    // If no tab was selected, select a default tab.
    useEffect(() => {
        if (!selectedTab) {
            // Route to the default tab.
            history.replace(`${basePath}/${DEFAULT_TAB}`);
        }
    }, [selectedTab, basePath, history]);

    /**
     * The top-level Toolbar tabs to display.
     */
    const tabs = [
        {
            title: (
                <>
                    <FileProtectOutlined />
                    <TabTitle>Assertions ({totalAssertions})</TabTitle>
                </>
            ),
            path: TabPaths.ASSERTIONS,
            disabled: totalAssertions === 0,
            content: <Assertions entityName={entityName} useEntityAssertionsQuery={useEntityAssertionsQuery} />,
        },
        {
            title: (
                <>
                    <FileDoneOutlined />
                    <TabTitle>Tests</TabTitle>
                </>
            ),
            path: TabPaths.TESTS,
            disabled: true,
            content: <div>Disabled</div>,
        },
    ];

    return (
        <>
            <TabToolbar>
                <div>
                    {tabs.map((tab) => (
                        <TabButton
                            type="text"
                            disabled={tab.disabled}
                            selected={selectedTab === tab.path}
                            onClick={() => history.replace(`${basePath}/${tab.path}`)}
                        >
                            {tab.title}
                        </TabButton>
                    ))}
                </div>
            </TabToolbar>
            {tabs.filter((tab) => tab.path === selectedTab).map((tab) => tab.content)}
        </>
    );
};
