import React from 'react';
import { useGetContainerAssertionsQuery } from '../../../graphql/container.generated';
import { ValidationsTab } from '../shared/tabs/Validations/ValidationsTab';

export const ContainerValidationsTab = () => {
    return <ValidationsTab entityName="container" useEntityAssertionsQuery={useGetContainerAssertionsQuery} />;
};
