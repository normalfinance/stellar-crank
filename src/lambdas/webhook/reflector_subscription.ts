// Modules
import { AWSLambda } from '@sentry/serverless';
import {
	EventParser,
	EventSuccess,
	EventClientErr,
	EventServerErr,
} from '@/shared/classes/http';
import {
	Horizon,
	Networks,
	Keypair,
	Operation,
	TransactionBuilder,
} from '@stellar/stellar-sdk';

// Utils
import { initializeSentry } from '@/shared/utils/banana';

// Types
import { EventErrorMessage } from '@/shared/types/error';

initializeSentry();

// Types
export type Request = {
	investmentId: string;
};

export type Response = {
	success: boolean;
};

export const handler = AWSLambda.wrapHandler(async (event: any) => {
	try {
		const eventParser = new EventParser(event);
		// const { userId } = eventParser.getUser();
		const { investmentId }: Request = eventParser.getBody();

		if (!investmentId) {
			return new EventClientErr(
				400,
				EventErrorMessage.INVALID_PARAMETERS
			).build();
		}

		// ...

		// The source account is the account we will be signing and sending from.
		const sourceSecretKey =
			'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4';

		// Derive Keypair object and public key (that starts with a G) from the secret
		const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
		const sourcePublicKey = sourceKeypair.publicKey();

		// Configure the server to the Horizon instance hosted by Stellar.org
		// To use the live network, set the hostname to 'horizon.stellar.org'
		const server = new Horizon.Server(
			'https://horizon-testnet.stellar.org'
		);

		// Transactions require a valid sequence number that is specific to this account.
		// We can fetch the current sequence number for the source account from Horizon.
		const account = await server.loadAccount(sourcePublicKey);

		// Right now, there's one function that fetches the base fee.
		const fee = await server.fetchBaseFee();

		const transaction = new TransactionBuilder(account, {
			fee,
			// Uncomment the following line to build transactions for the live network. Be
			// sure to also change the horizon hostname.
			// networkPassphrase: StellarSdk.Networks.PUBLIC,
			networkPassphrase: Networks.TESTNET,
		})
			// Add a payment operation to the transaction
			.addOperation(
				Operation.invokeContractFunction({
					contract: '...',
					function: 'set_price',
					args: [],
				})
			)
			// Make this transaction valid for the next 30 seconds only
			.setTimeout(30)
			.build();

		// Sign this transaction with the secret key
		// NOTE: signing is transaction is network specific. Test network transactions
		// won't work in the public network. To switch networks, use the Network object
		// as explained above (look for StellarSdk.Network).
		transaction.sign(sourceKeypair);

		// Let's see the XDR (encoded in base64) of the transaction we just built
		console.log(transaction.toEnvelope().toXDR('base64'));

		// Submit the transaction to the Horizon server. The Horizon server will then
		// submit the transaction into the network for us.
		try {
			const transactionResult = await server.submitTransaction(
				transaction
			);
			console.log(JSON.stringify(transactionResult, null, 2));
			console.log('\nSuccess! View the transaction at: ');
			console.log(transactionResult._links.transaction.href);
		} catch (e) {
			console.log('An error has occurred:');
			console.log(e);
		}

		return new EventSuccess(
			{
				success: true,
			},
			202
		).build();
	} catch (error) {
		return new EventServerErr(error.message, error).build();
	}
});
