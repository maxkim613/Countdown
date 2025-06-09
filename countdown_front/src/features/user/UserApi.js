// src/features/auth/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery:  baseQueryWithAuthHandler,
  endpoints: (builder) => ({

      sendCertiNum: builder.mutation({
         query: ({ username, email }) => ({
        url: '/user/sendCertiNum',
        method: 'POST',
        body: { username, email }
      }),
    }),

     verifyCertiNum: builder.mutation({
      query: ({ email, certiNum }) => ({
        url: '/user/verifyCertiNum',
        method: 'POST',
        body: { email, certiNum }
      }),
    }),
   
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login.do',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/user/join.do',
        method: 'POST',
        body: credentials
      })
    }),
    userUpdate: builder.mutation({
        query: (credentials) => ({
          url: '/user/update.do',
          method: 'POST',
          body: credentials
        })
    }),
    userDelete: builder.mutation({
        query: (credentials) => ({
          url: '/user/delete.do',
          method: 'POST',
          body: credentials
        })
    }),
    logout: builder.mutation({
        query: (credentials) => ({
          url: '/user/logout.do',
          method: 'POST',
          body: credentials
        })
    }),
    view: builder.query({
        query: (credentials) => ({
            url: '/user/view.do',
            method: 'POST',
            body: credentials
        }),
        keepUnusedDataFor: 0, // = cacheTime: 0
        refetchOnMountOrArgChange: true,
        staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    list: builder.query({
      query: (credentials) => ({
        url: '/user/list.do',
        method: 'POST',
        body: credentials
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),  
    userM: builder.mutation({
      query: (credentials) => ({
        url: '/user/userM.do',
        method: 'POST',
        body: credentials
      })
  }),
    checkUserId: builder.mutation({
      query: (credentials) => ({
        url: '/user/checkUserId.do',
        method: 'POST',
        body: credentials
      })
  }),    
    checkNickname: builder.mutation({
      query: (credentials) => ({
         url: '/user/checkNickname.do',
        method: 'POST',
        body: credentials
      })
  }),    
    checkEmail: builder.mutation({
      query: (credentials) => ({
        url: '/user/checkEmail.do',
        method: 'POST',
        body: credentials
      })
    }),
    resetPassword: builder.mutation({
      query: ({ userId, password }) => ({
        url: `/user/resetPassword`,
        method: 'POST',
        body: { userId, password },
      }),
    }),

  })
});

export const {
  useResetPasswordMutation,
  useSendCertiNumMutation,
  useVerifyCertiNumMutation,
  useCheckNicknameMutation,
  useCheckEmailMutation,
  useCheckUserIdMutation,
  useUserMMutation,
  useListQuery,
  useLoginMutation,
  useRegisterMutation,
  useUserUpdateMutation,
  useUserDeleteMutation,
  useLogoutMutation,
  useViewQuery
} = userApi;
