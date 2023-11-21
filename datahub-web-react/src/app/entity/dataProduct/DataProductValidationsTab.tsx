import React from 'react';
import { useGetDataProductAssertionsQuery } from '../../../graphql/dataProduct.generated';
import { ValidationsTab } from '../shared/tabs/Validations/ValidationsTab';

export const DataProductValidationsTab = () => {
    return <ValidationsTab entityName="dataProduct" useEntityAssertionsQuery={useGetDataProductAssertionsQuery} />;
};
