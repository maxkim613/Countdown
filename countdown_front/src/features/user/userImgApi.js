// src/features/user/userImgApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const userImgApi = createApi({
  reducerPath: 'userImgApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    // 이미지 리스트 조회 (userId로 조회)
    getUserImgs: builder.query({
      query: (userId) => ({
        url: `/Img/findByUserImg`,
        method: 'GET',
        params: { userId },
      }),
    }),

    // 이미지 업로드 (multipart/form-data)
    uploadUserImg: builder.mutation({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);

        return {
          url: '/Img/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // 이미지 수정 (multipart/form-data)
    updateUserImg: builder.mutation({
      query: ({ userImgId, userId, file }) => {
        const formData = new FormData();
        formData.append('userImgId', userImgId);
        formData.append('userId', userId);
        formData.append('file', file);

        return {
          url: '/Img/update',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // 이미지 삭제 (userImgId로 삭제)
    deleteUserImg: builder.mutation({
      query: (userImgId) => ({
        url: '/Img/delete',
        method: 'POST',
        params: { userImgId },
      }),
    }),
  }),
});

export const {
  useGetUserImgsQuery,
  useUploadUserImgMutation,
  useUpdateUserImgMutation,
  useDeleteUserImgMutation,
} = userImgApi;
