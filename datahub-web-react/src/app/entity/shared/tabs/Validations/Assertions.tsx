import React from 'react';
import { QueryHookOptions, QueryResult } from '@apollo/client/react/types/types';
import { Assertion, AssertionResultType, Exact } from '../../../../../types.generated';
import { useEntityData } from '../../EntityContext';
import { DatasetAssertionsList } from './AssertionsList';
import { DatasetAssertionsSummary } from './AssertionsSummary';
import { sortAssertions } from './assertionUtils';
import { combineEntityDataWithSiblings, useIsSeparateSiblingsMode } from '../../siblingUtils';

type Props<T> = {
    entityName: string;
    useEntityAssertionsQuery: (
        baseOptions: QueryHookOptions<
            T,
            Exact<{
                urn: string;
            }>
        >,
    ) => QueryResult<
        T,
        Exact<{
            urn: string;
        }>
    >;
};

/**
 * Returns a status summary for the assertions associated with a Dataset.
 */
const getAssertionsStatusSummary = (assertions: Array<Assertion>) => {
    const summary = {
        failedRuns: 0,
        succeededRuns: 0,
        totalRuns: 0,
        totalAssertions: assertions.length,
    };
    assertions.forEach((assertion) => {
        if ((assertion.runEvents?.runEvents?.length || 0) > 0) {
            const mostRecentRun = assertion.runEvents?.runEvents?.[0];
            const resultType = mostRecentRun?.result?.type;
            if (AssertionResultType.Success === resultType) {
                summary.succeededRuns++;
            }
            if (AssertionResultType.Failure === resultType) {
                summary.failedRuns++;
            }
            summary.totalRuns++; // only count assertions for which there is one completed run event!
        }
    });
    return summary;
};

/**
 * Component used for rendering the Validations Tab on the Dataset Page.
 */
export const Assertions = <T,>({ entityName, useEntityAssertionsQuery }: Props<T>): JSX.Element => {
    const { urn, entityData } = useEntityData();
    const { data } = useEntityAssertionsQuery({ variables: { urn }, fetchPolicy: 'cache-first' });
    const isHideSiblingMode = useIsSeparateSiblingsMode();

    const combinedData = isHideSiblingMode ? data : combineEntityDataWithSiblings(data);

    const assertions =
        (combinedData && combinedData[entityName].assertions?.assertions?.map((assertion) => assertion as Assertion)) ||
        [];

    // Pre-sort the list of assertions based on which has been most recently executed.
    assertions.sort(sortAssertions);

    return (
        <>
            <DatasetAssertionsSummary summary={getAssertionsStatusSummary(assertions)} />
            {entityData && <DatasetAssertionsList assertions={assertions} />}
        </>
    );
};
