// Modules
import jwt from 'jsonwebtoken';

const apiPermissions = [
	{
		arn: `arn:aws:execute-api:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.API_ID}`,
		resource: '*',
		stage: process.env.STAGE,
		httpVerb: '*',
		scope: 'email',
	},
];

const defaultDenyAllPolicy = {
	principalId: 'user',
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: 'Deny',
				Resource: '*',
			},
		],
	},
};

function generatePolicyStatement(
	apiName,
	apiStage,
	apiVerb,
	apiResource,
	action
) {
	const statement: Record<string, unknown> = {};
	statement.Action = 'execute-api:Invoke';
	statement.Effect = action;
	const methodArn =
		apiName + '/' + apiStage + '/' + apiVerb + '/' + apiResource;
	statement.Resource = methodArn;
	return statement;
}

function generatePolicy(principalId, policyStatements, data) {
	const authResponse: Record<string, unknown> = {};
	authResponse.principalId = principalId;
	authResponse.context = {
		userId: data.sub,
		email: data.email,
	};

	const policyDocument: Record<string, unknown> = {};
	policyDocument.Version = '2012-10-17';
	policyDocument.Statement = policyStatements;

	authResponse.policyDocument = policyDocument;

	return authResponse;
}

async function verifyToken(token, callback) {
	try {
		// Verify the JWT
		const payload = await jwt.verify(
			token,
			process.env.SUPABASE_AUTH_SECRET
		);
		return payload;
	} catch (error) {
		console.error(error.toString());
		console.error(error);
		callback('Unauthorized');
	}
}

function generateIAMPolicy(scopeClaims, data) {
	// Declare empty policy statements array
	const policyStatements: any = [];
	// Iterate over API Permissions
	for (let i = 0; i < apiPermissions.length; i++) {
		// Check if token scopes exist in API Permission
		if (scopeClaims.indexOf(apiPermissions[i].scope) > -1) {
			// User token has appropriate scope, add API permission to policy statements
			policyStatements.push(
				generatePolicyStatement(
					apiPermissions[i].arn,
					apiPermissions[i].stage,
					apiPermissions[i].httpVerb,
					apiPermissions[i].resource,
					'Allow'
				)
			);
		}
	}
	// Check if no policy statements are generated, if so, create default deny all policy statement
	if (policyStatements.length === 0) {
		return defaultDenyAllPolicy;
	} else {
		return generatePolicy('user', policyStatements, data);
	}
}

exports.handler = async (event, context, callback) => {
	console.info('EVENT\n' + JSON.stringify(event, null, 2));

	let iamPolicy: any = null;

	const token = event.authorizationToken.replace('Bearer ', '');

	// Validate token
	await verifyToken(token, callback)
		.then((data: any) => {
			console.log('Decoded and Verified JWT Token', JSON.stringify(data));
			const scopeClaims = ['email'];
			iamPolicy = generateIAMPolicy(scopeClaims, data);
		})
		.catch((err) => {
			console.log(err);
			iamPolicy = defaultDenyAllPolicy;
		});

	console.log('IAM Policy', JSON.stringify(iamPolicy));
	callback(null, iamPolicy);
};
