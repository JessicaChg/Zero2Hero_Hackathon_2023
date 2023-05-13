import { ethers } from "ethers"
import { getIdentity, createAuthActor } from '../../api/dfx'
import { parsePersonalSign } from './signature'

const isProd = import.meta.env.MODE === 'production'

const checkOkExist = () => {
    if (typeof window.okexchain !== 'undefined') {
        console.log('Okexchain is installed!')
        return
    }
    throw new Error('Okexchain is not installed!')
}

export const okAuth = async ({
    showLoading
}: {
    showLoading?: Function;
}) => {
    checkOkExist()
    const provider = new ethers.providers.Web3Provider(window.okexchain)
    const accounts = await provider.send("eth_requestAccounts", [])
    if (!accounts || !accounts[0]) throw new Error('There is no account')
    const signer = provider.getSigner()
    if (!signer) throw new Error('getSigner error')
    const message = `${new Date().getTime()}`
    const signature = await signer.signMessage(message)
    const formatted = parsePersonalSign({
        message,
        signature,
    })
    if (showLoading) showLoading()
    const authAcotr = await createAuthActor({ local: !isProd })
    const identity = await getIdentity(authAcotr, {
        walletName: 'okexchain',
        message: formatted.message,
        signature: formatted.signature,
        algorithm: 'secp256k1',
        publicKey: formatted.publicKey,
        chainName: 'eth',
    })
    return {
        signature,
        address: accounts[0],
        message,
        identity,
    }
}