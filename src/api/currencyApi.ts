import { axiosClient } from "./axiosClient";

export const currencyApi = {
  async getRate(base:string){
    
    const response = await axiosClient.get(`/currency/rates?base=${base}`);

    return response
  },
};
