import { Actor, HttpAgent, HttpAgentOptions } from '@dfinity/agent'
import { ActorSubclass } from '@dfinity/agent'

// @ts-ignore
import { idlFactory as authIdlFactory } from './relation_auth.did.js'

type WalletType =
  | 'internet identity'
  | 'metamask'
  | 'polkadot'
  | 'plug'
  | 'wallet connect'
  | 'binance'
  | 'phantom'
  | 'tokenPocket'
  | 'okexchain'
  | 'infinityWallet'
type SignAlgorithm = 'secp256k1' | 'sr25519' | 'ed25519' | 'none'

type GetIdentityParams = {
  walletName: WalletType
  publicKey: string
  algorithm: SignAlgorithm
  signature?: string
  message?: string
  chainName?: string
}

// const sim = {
//     host: 'https://ic0.app',
//     authCanister: '2v6hu-qqaaa-aaaaj-ad2ba-cai',
// }

// const prod = {
//     host: 'https://ic0.app',
//     authCanister: 'q6imp-piaaa-aaaai-qmiwq-cai',
// }

// const { host, authCanister } = prod
const host = import.meta.env.VITE_DFX_DOMAIN
const authCanister = import.meta.env.VITE_DFX_AUTHCANISTER

export const iihost = host

export const authCanisterId = authCanister

export const authCanisterIdlFactory = authIdlFactory

export const createAuthActor = async ({
  agentOptions = {},
  actorOptions = {},
  local = false
}: {
  agentOptions?: HttpAgentOptions
  actorOptions?: any
  local?: boolean
} = {}) => {
  const agent = new HttpAgent({ host, ...agentOptions })
  if (local) {
    /*
        await agent.fetchRootKey().catch(err=>{
            console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
        });
        */
  }
  return Actor.createActor(authIdlFactory, {
    agent,
    canisterId: authCanister,
    ...actorOptions
  })
}

export const getIdentity = async (
  authAcotr: ActorSubclass | null,
  params: GetIdentityParams
) => {
  if (authAcotr) {
    const {
      walletName,
      publicKey,
      signature = '',
      message = '',
      algorithm,
      chainName
    } = params
    const tokenInput = {
      pk: publicKey,
      algorithm: { [algorithm]: null },
      message,
      wallet_name: walletName,
      decoded_signature: signature,
      chain_name: chainName
    }
    const tokenRes: any = await authAcotr.auth(tokenInput)
    const identityRes: {
      token?: string
      delegation?: any
    } = {}
    if (tokenRes && tokenRes.Ok) {
      const token = tokenRes.Ok
      identityRes.token = token
    }
    if (tokenRes && tokenRes.Err) throw new Error(tokenRes.Err)
    return identityRes
  }
  throw new Error('must create auth actor first!')
}
