import {
	KMSClient,
	DecryptCommand,
	EncryptionAlgorithmSpec,
} from '@aws-sdk/client-kms';
import { AWSServiceError } from '../http/Errors';

/**
 *
 */
export default class KMS {
	client: KMSClient;

	/**
	 *
	 */
	constructor() {
		this.client = new KMSClient({ region: process.env.REGION });
	}

	/**
	 *
	 * @param cipherTextString
	 * @param keyId
	 * @param algo
	 * @returns
	 */
	async decrypt(
		cipherTextString: string,
		keyId: string,
		algo: EncryptionAlgorithmSpec
	): Promise<string> {
		try {
			const { Plaintext } = await this.client.send(
				new DecryptCommand({
					CiphertextBlob: Buffer.from(cipherTextString, 'base64'),
					KeyId: keyId,
					EncryptionAlgorithm: algo,
				})
			);
			return Buffer.from(Plaintext).toString();
		} catch (error) {
			throw new AWSServiceError('Unable to decrypt data', error);
		}
	}
}
