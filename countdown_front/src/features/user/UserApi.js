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
      query: (formData) => ({
        url: '/user/update.do',
        method: 'POST',
        body: formData
       }),
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
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
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

    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/user/update-status.do`,
        method: 'POST',
        body: { userId, status },
      }),
       invalidatesTags: ['User'],
    }),


     // 프로필 이미지 조회
    getUserImg: builder.query({
      query: (userId) => `/user/userImg/${userId}`,
      providesTags: ['UserImg'],
    }),

    // 프로필 이미지 업로드 (multipart/form-data)
    uploadUserImg: builder.mutation({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);
        return {
          url: '/user/userImg/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['UserImg'],
    }),

    // 프로필 이미지 수정
    updateUserImg: builder.mutation({
      query: ({ userImgId, file }) => {
        const formData = new FormData();
        formData.append('userImgId', userImgId);
        formData.append('file', file);
        return {
          url: '/user/userImg/update',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['UserImg'],
    }),

    // 프로필 이미지 삭제
    deleteUserImg: builder.mutation({
      query: (userImgId) => ({
        url: `/user/userImg/${userImgId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserImg'],
    }),




  })
});

export const {
  useUpdateUserStatusMutation,
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
  useViewQuery,
  useGetUserImgQuery,
  useUploadUserImgMutation,
  useUpdateUserImgMutation,
  useDeleteUserImgMutation,
} = userApi;
