import { Empty, Image, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { DownOutlined, RightOutlined, StopOutlined } from '@ant-design/icons';
import { AssertionDescription } from './AssertionDescription';
import { StyledTable } from '../../components/styled/StyledTable';
import { AssertionDetails } from './AssertionDetails';
import { Assertion, AssertionRunStatus } from '../../../../../types.generated';
import { getResultColor, getResultIcon, getResultText } from './assertionUtils';
import { capitalizeFirstLetterOnly } from '../../../../shared/textUtil';

const ResultContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
`;

const ResultTypeText = styled(Typography.Text)`
    margin-left: 8px;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`;

const PlatformContainer = styled.div`
    margin-right: 8px;
`;

type Props = {
    assertions: Array<Assertion>;
};

/**
 * A list of assertions displaying their most recent run status, their human-readable
 * description, and platform.
 *
 * Currently this component supports rendering Dataset Assertions only.
 */
export const DatasetAssertionsList = ({ assertions }: Props) => {
    const assertionsTableData = assertions.map((assertion) => ({
        urn: assertion.urn,
        type: assertion.info?.type,
        platform: assertion.platform,
        assertionInfo: assertion.info,
        lastExecTime: assertion.runEvents?.runEvents?.length && assertion.runEvents.runEvents[0].timestampMillis,
        lastExecResult:
            assertion.runEvents?.runEvents?.length &&
            assertion.runEvents.runEvents[0].status === AssertionRunStatus.Complete &&
            assertion.runEvents.runEvents[0].result?.type,
    }));

    const assertionsTableCols = [
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record: any) => {
                const executionDate = record.lastExecTime && new Date(record.lastExecTime);
                const localTime = executionDate && `${executionDate.toLocaleDateString()}`;
                const resultColor = (record.lastExecResult && getResultColor(record.lastExecResult)) || 'default';
                const resultText = (record.lastExecResult && getResultText(record.lastExecResult)) || 'No Evaluations';
                const resultIcon = (record.lastExecResult && getResultIcon(record.lastExecResult)) || <StopOutlined />;
                return (
                    <ResultContainer>
                        <div>
                            <Tooltip title={(localTime && `Last evaluated on ${localTime}`) || 'No Evaluations'}>
                                <Tag style={{ borderColor: resultColor }}>
                                    {resultIcon}
                                    <ResultTypeText style={{ color: resultColor }}>{resultText}</ResultTypeText>
                                </Tag>
                            </Tooltip>
                        </div>
                        <AssertionDescription assertionInfo={record.assertionInfo} />
                    </ResultContainer>
                );
            },
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record: any) => (
                <ActionButtonContainer>
                    <Tooltip
                        title={
                            record.platform.properties?.displayName || capitalizeFirstLetterOnly(record.platform.name)
                        }
                    >
                        <PlatformContainer>
                            {(record.platform.properties?.logoUrl && (
                                <Image
                                    preview={false}
                                    height={20}
                                    width={20}
                                    src={record.platform.properties?.logoUrl}
                                />
                            )) || (
                                <Typography.Text>
                                    {record.platform.properties?.displayName ||
                                        capitalizeFirstLetterOnly(record.platform.name)}
                                </Typography.Text>
                            )}
                        </PlatformContainer>
                    </Tooltip>
                </ActionButtonContainer>
            ),
        },
    ];

    return (
        <>
            <StyledTable
                columns={assertionsTableCols}
                dataSource={assertionsTableData}
                rowKey="urn"
                locale={{
                    emptyText: <Empty description="No Assertions Found :(" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                }}
                expandable={{
                    defaultExpandAllRows: false,
                    expandRowByClick: true,
                    expandedRowRender: (record) => {
                        return <AssertionDetails urn={record.urn} lastEvaluatedAtMillis={record.lastExecTime} />;
                    },
                    expandIcon: ({ expanded, onExpand, record }: any) =>
                        expanded ? (
                            <DownOutlined style={{ fontSize: 8 }} onClick={(e) => onExpand(record, e)} />
                        ) : (
                            <RightOutlined style={{ fontSize: 8 }} onClick={(e) => onExpand(record, e)} />
                        ),
                }}
                showHeader={false}
                pagination={false}
            />
        </>
    );
};
