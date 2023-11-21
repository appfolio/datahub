import React from 'react';
import { useGetDataFlowAssertionsQuery } from '../../../graphql/dataFlow.generated';
import { ValidationsTab } from '../shared/tabs/Validations/ValidationsTab';

export const DataFlowValidationsTab = () => {
    return <ValidationsTab entityName="dataFlow" useEntityAssertionsQuery={useGetDataFlowAssertionsQuery} />;
};
