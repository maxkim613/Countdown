import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const codeApi = createApi({
    reducerPath: 'codeApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        getCodes: builder.query({
            query: (groupCode) => `/codes/${groupCode}`,
            transformResponse: (response) => response.data.map(code => ({
                label: code.codeName
            })),
        }),
    }),
}); 

export const { useGetCodesQuery } = codeApi;