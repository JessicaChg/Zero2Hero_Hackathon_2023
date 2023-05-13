import { ethers } from "ethers"
import { recoverPublicKey } from "@ethersproject/signing-key"
import { arrayify } from "@ethersproject/bytes"
import { Bytes, SignatureLike } from "@ethersproject/bytes"
import { hashMessage } from "ethers/lib/utils"

export const parsePersonalSign = ({
    message,
    signature,
}: {
    message: string;
    signature: string;
}) => {
    const digest = hashMessage(message)
    const publicKey = recoverPublicKey(arrayify(digest), signature)
    return {
        publicKey: publicKey.slice(2),   // 去掉字符串首的0x
        message,
        signature: signature.slice(2),
    };
}

export const verifyPersonalSignMessage = (message: Bytes | string, signature: SignatureLike) => {
    return ethers.utils.verifyMessage(message, signature)
}