import axios, { type AxiosResponse } from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL

const postCanvas = (image: any): Promise<AxiosResponse> => {
	return axios.post(`${baseUrl}/api/v1/predict`, {
		image
	})
} 

export { postCanvas }