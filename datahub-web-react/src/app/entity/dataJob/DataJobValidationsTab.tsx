import React from 'react';
import { useGetDataJobAssertionsQuery } from '../../../graphql/dataJob.generated';
import { ValidationsTab } from '../shared/tabs/Validations/ValidationsTab';

export const DataJobValidationsTab = () => {
    return <ValidationsTab entityName="dataJob" useEntityAssertionsQuery={useGetDataJobAssertionsQuery} />;
};
