import axios, { type AxiosResponse } from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL

const postCanvas = (image: string): Promise<AxiosResponse> => {
	return axios.post(`${baseUrl}/api/v1/predict`, {
		image
	})
} 

const postFeedback = (image: string, feedback: number): Promise<AxiosResponse> => {
	return axios.post(`${baseUrl}/api/v1/record-feedback`, {
		image,
		feedback
	})
} 

export { postCanvas, postFeedback }