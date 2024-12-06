// src/api.ts

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // 替换为你的后端地址
    headers: {
        'Content-Type': 'application/json',
    },
});

// 创建留言
export const createMessage = async (username: string, content: string) => {
    const response = await apiClient.post('/messages', { username, content });
    return response.data;
};

// 获取所有留言
export const getAllMessages = async () => {
    const response = await apiClient.get('/messages');
    return response.data;
};

// 创建评论
export const createComment = async (messageId: number, username: string, content: string) => {
    const response = await apiClient.post('/comments', { message_id: messageId, username, content });
    return response.data;
};

// 获取某个留言及其评论
export const getMessageWithComments = async (id: number) => {
    const response = await apiClient.get(`/messages/${id}`);
    return response.data;
};

// 通过关键字查找留言
export const searchMessages = async (keyword: string, limit: number = 10) => {
    const response = await apiClient.get('/messages/search', { params: { keyword, limit } });
    return response.data;
};

// 随机抽取留言
export const getRandomMessages = async (limit: number = 5) => {
    const response = await apiClient.get('/messages/random', { params: { limit } });
    return response.data;
};

// 获取最新留言
export const getLatestMessages = async (limit: number = 5, offset: number = 0) => {
    const response = await apiClient.get('/messages/latest', { params: { limit, offset } });
    return response.data;
};

// 获取留言下的部分评论
export const getCommentsForMessage = async (id: number, limit: number = 5) => {
    const response = await apiClient.get(`/messages/${id}/comments`, { params: { limit } });
    return response.data;
};