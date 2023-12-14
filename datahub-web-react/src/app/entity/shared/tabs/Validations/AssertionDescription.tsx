import { Popover, Typography } from 'antd';
import React from 'react';
import { AssertionInfo } from '../../../../../types.generated';

type Props = {
    assertionInfo: AssertionInfo;
};

const TOOLTIP_MAX_WIDTH = 440;

/**
 * A human-readable description of an Assertion.
 *
 * For example, Column 'X' values are in [1, 2, 3]
 */
export const AssertionDescription = ({ assertionInfo }: Props) => {
    const { description } = assertionInfo;

    return (
        <Popover
            overlayStyle={{ maxWidth: TOOLTIP_MAX_WIDTH }}
            title={<Typography.Text strong>Details</Typography.Text>}
            content={
                <>
                    <Typography.Text strong>entityUrn</Typography.Text>
                </>
            }
        >
            <Typography.Text>{description}</Typography.Text>
        </Popover>
    );
};
