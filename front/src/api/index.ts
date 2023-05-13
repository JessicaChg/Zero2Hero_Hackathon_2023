import { http } from './http'

export const host = {
  // ...prod
  imServer: import.meta.env.VITE_API_IM_SERVER,
  graphServer: import.meta.env.VITE_API_GRAPH_SERVER,
  ucServer: import.meta.env.VITE_API_UC_SERVER,
  dbHttp: import.meta.env.VITE_API_DB_HTTP,
  imgServer: import.meta.env.VITE_API_IMG_SERVER,
  sbtServer: import.meta.env.VITE_API_SBT_SERVER
}

const mode = import.meta.env.MODE

export const getProfile = async (config: any) => {
  return http.post(`${host.ucServer}/profile/createProfile`, {}, { ...config })
}

export const getUserInfo = async () => {
  return http.post(`${host.ucServer}/user/getUserInfo`)
}

export const getNamePhase = async () => {
  return http.get(`${host.ucServer}/name/phase`)
}
export const setNamePhase = async (phase: string) => {
  return http.post(`${host.ucServer}/name/phase?phase=${phase}`)
}

export const getNameContractAddr = async () => {
  return http.get(`${host.ucServer}/name/contractAddress`)
}

export const getNameStatus = async (name: string, walletAddress: string) => {
  return http.get(`${host.ucServer}/name/search`, { name, walletAddress })
}

export const getNamePrice = async (name: string, walletAddress: string) => {
  return http.get(`${host.ucServer}/name/price`, { name, walletAddress })
}

export const getNameList = async (address: string) => {
  return http.get(`${host.ucServer}/name/list`, { address })
}

export const genNameSignData = async (data: {
  name: string
  walletAddress: string
  price: any
  referrerAddress?: string
}) => {
  return http.post(`${host.ucServer}/name/sign/generate`, data)
}

export const getWhitelistMintedNum = async () =>
  http.get(`${host.sbtServer}/api/v1/statistic/wl/progress`)

export const getPreMintedNum = async () =>
  http.get(`${host.ucServer}/name/progress`)

export const getMintedList = async () =>
  http.get(`${host.ucServer}/name/?limit=100`)

export const getReferralRewards = async (address: string) =>
  http.get(`${host.ucServer}/name/referralRewards?walletAddress=${address}`)
