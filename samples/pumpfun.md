# Solana Code Generation Benchmark

## Environment

IDE: Cursor, agent mode with MAGI MCP, claude-3.5-sonnet

## User Input

````
Construct a pump.fun transaction function to purchase tokens. Generate only the corresponding code and do not generate other content. Function signature as follow:

```
/**
 * Creates an instruction to buy tokens from a pumpfun token
 * 
 * @param buyer - The account that will buy the tokens
 * @param mint - The mint address of the token to buy
 * @param tokenAmount - The amount of tokens to buy (in token units)
 * @param maxSolCost - The maximum amount of SOL to spend (in lamports)
 * @returns TransactionInstruction
 */
export async function createBuyInstruction(
  buyer: PublicKey,
  mint: PublicKey,
  tokenAmount: bigint,
  maxSolCost: bigint
): Promise<TransactionInstruction>
```
````

## Cursor Output

I'll help you create the pump.fun transaction function for purchasing tokens. Let me write the code and verify it with the MCP services.

```
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN } from 'bn.js';

// Program ID for the pump.fun program
const PUMPFUN_PROGRAM_ID = new PublicKey('PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc');

/**
 * Creates an instruction to buy tokens from a pumpfun token
 * 
 * @param buyer - The account that will buy the tokens
 * @param mint - The mint address of the token to buy
 * @param tokenAmount - The amount of tokens to buy (in token units)
 * @param maxSolCost - The maximum amount of SOL to spend (in lamports)
 * @returns TransactionInstruction
 */
export async function createBuyInstruction(
  buyer: PublicKey,
  mint: PublicKey,
  tokenAmount: bigint,
  maxSolCost: bigint
): Promise<TransactionInstruction> {
  // Derive PDA addresses
  const [vaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), mint.toBuffer()],
    PUMPFUN_PROGRAM_ID
  );

  const [statePDA] = await PublicKey.findProgramAddress(
    [Buffer.from('state'), mint.toBuffer()],
    PUMPFUN_PROGRAM_ID
  );

  // Get the buyer's associated token account
  const buyerATA = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    buyer,
    false
  );

  // Create the instruction
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM_ID,
    keys: [
      { pubkey: buyer, isSigner: true, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: vaultPDA, isSigner: false, isWritable: true },
      { pubkey: statePDA, isSigner: false, isWritable: true },
      { pubkey: buyerATA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      Buffer.from([0]), // Instruction index for buy
      Buffer.from(new BN(tokenAmount.toString()).toArray('le', 8)),
      Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),
    ]),
  });
}
```

Let me fix the linter errors by adding the missing imports.

```
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { BN } from 'bn.js';

// Program ID for the pump.fun program
const PUMPFUN_PROGRAM_ID = new PublicKey('PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc');

/**
 * Creates an instruction to buy tokens from a pumpfun token
 * 
 * @param buyer - The account that will buy the tokens
 * @param mint - The mint address of the token to buy
 * @param tokenAmount - The amount of tokens to buy (in token units)
 * @param maxSolCost - The maximum amount of SOL to spend (in lamports)
 * @returns TransactionInstruction
 */
export async function createBuyInstruction(
  buyer: PublicKey,
  mint: PublicKey,
  tokenAmount: bigint,
  maxSolCost: bigint
): Promise<TransactionInstruction> {
  // Derive PDA addresses
  const [vaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), mint.toBuffer()],
    PUMPFUN_PROGRAM_ID
  );

  const [statePDA] = await PublicKey.findProgramAddress(
    [Buffer.from('state'), mint.toBuffer()],
    PUMPFUN_PROGRAM_ID
  );

  // Get the buyer's associated token account
  const buyerATA = await getAssociatedTokenAddress(
    mint,
    buyer,
    false
  );

  // Create the instruction
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM_ID,
    keys: [
      { pubkey: buyer, isSigner: true, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: vaultPDA, isSigner: false, isWritable: true },
      { pubkey: statePDA, isSigner: false, isWritable: true },
      { pubkey: buyerATA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      Buffer.from([0]), // Instruction index for buy
      Buffer.from(new BN(tokenAmount.toString()).toArray('le', 8)),
      Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),
    ]),
  });
}
```

Now let me verify the generated code with the MCP services.

**Called MCP tool `verifyTypescriptCodes`**

Parameters:

```
{
  "code": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport { \n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Program ID for the pump.fun program\nconst PUMPFUN_PROGRAM_ID = new PublicKey('PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc');\n\n/**\n * Creates an instruction to buy tokens from a pumpfun token\n * \n * @param buyer - The account that will buy the tokens\n * @param mint - The mint address of the token to buy\n * @param tokenAmount - The amount of tokens to buy (in token units)\n * @param maxSolCost - The maximum amount of SOL to spend (in lamports)\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  tokenAmount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n  // Derive PDA addresses\n  const [vaultPDA] = await PublicKey.findProgramAddress(\n    [Buffer.from('vault'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [statePDA] = await PublicKey.findProgramAddress(\n    [Buffer.from('state'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get the buyer's associated token account\n  const buyerATA = await getAssociatedTokenAddress(\n    mint,\n    buyer,\n    false\n  );\n\n  // Create the instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: [\n      { pubkey: buyer, isSigner: true, isWritable: true },\n      { pubkey: mint, isSigner: false, isWritable: true },\n      { pubkey: vaultPDA, isSigner: false, isWritable: true },\n      { pubkey: statePDA, isSigner: false, isWritable: true },\n      { pubkey: buyerATA, isSigner: false, isWritable: true },\n      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    ],\n    data: Buffer.concat([\n      Buffer.from([0]), // Instruction index for buy\n      Buffer.from(new BN(tokenAmount.toString()).toArray('le', 8)),\n      Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n    ]),\n  });\n}"
}
```

Result:

```
{"result": "```xml\n<result>True</result>\n```"}tool response: {"result": "```xml\n<result>True</result>\n```"}.
```

**Called MCP tool `verifyGeneratedCodesForSolana`**

Parameters:

```
{
  "user_input": "Create a buy instruction for pump.fun token",
  "code_generated": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport { \n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Program ID for the pump.fun program\nconst PUMPFUN_PROGRAM_ID = new PublicKey('PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc');\n\n/**\n * Creates an instruction to buy tokens from a pumpfun token\n * \n * @param buyer - The account that will buy the tokens\n * @param mint - The mint address of the token to buy\n * @param tokenAmount - The amount of tokens to buy (in token units)\n * @param maxSolCost - The maximum amount of SOL to spend (in lamports)\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  tokenAmount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n  // Derive PDA addresses\n  const [vaultPDA] = await PublicKey.findProgramAddress(\n    [Buffer.from('vault'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [statePDA] = await PublicKey.findProgramAddress(\n    [Buffer.from('state'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get the buyer's associated token account\n  const buyerATA = await getAssociatedTokenAddress(\n    mint,\n    buyer,\n    false\n  );\n\n  // Create the instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: [\n      { pubkey: buyer, isSigner: true, isWritable: true },\n      { pubkey: mint, isSigner: false, isWritable: true },\n      { pubkey: vaultPDA, isSigner: false, isWritable: true },\n      { pubkey: statePDA, isSigner: false, isWritable: true },\n      { pubkey: buyerATA, isSigner: false, isWritable: true },\n      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    ],\n    data: Buffer.concat([\n      Buffer.from([0]), // Instruction index for buy\n      Buffer.from(new BN(tokenAmount.toString()).toArray('le', 8)),\n      Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n    ]),\n  });\n}"
}
```

Result:

```
{"result": "```xml\n<result>False</result>\n<reasons>\n<item>Incorrect Program ID used. The IDL specifies '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P', but the code uses 'PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc'.</item>\n<item>Incorrect instruction discriminator used. The code uses 'Buffer.from([0])', but the IDL for the 'buy' instruction specifies '[102, 6, 61, 18, 1, 218, 235, 234]'.</item>\n<item>Incorrect PDA derivation for 'bonding_curve'. The IDL specifies seeds ['bonding-curve', mint], but the code uses incorrect seeds ['state', mint].</item>\n<item>Incorrect account used for the bonding curve's token vault. The code derives a 'vaultPDA' with incorrect seeds ['vault', mint]. It should use the Associated Token Account (ATA) for the 'bonding_curve' PDA, which is the 'associated_bonding_curve' account in the IDL.</item>\n<item>Missing required account 'global'. This PDA is derived with seed ['global'].</item>\n<item>Missing required account 'fee_recipient'. This is specified in the IDL and provided context ('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM').</item>\n<item>Missing required account 'event_authority'. This is specified in the IDL and provided context ('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1').</item>\n<item>Missing required account 'program'. This refers to the pump.fun program itself ('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P').</item>\n<item>Incorrect 'isWritable' flag for the 'mint' account. The IDL specifies it should be 'false' for the 'buy' instruction.</item>\n<item>The account list order and specific accounts provided in the 'keys' array do not match the requirements specified in the IDL for the 'buy' instruction.</item>\n<item>Missing required account 'associated_token_program'.</item>\n</reasons>\n<suggested>\n// Suggested code fixes with comments explaining changes\nimport {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint, // Renamed from tokenAmount to match IDL arg name\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()], // Correct seeds for bonding_curve\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  // ATA for the bonding curve's token holdings\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA, // The PDA is the owner of this ATA\n    true // Allow PDA owner\n  );\n\n  // ATA for the buyer's token holdings\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer // The buyer is the owner\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false },\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // Use constant, writable\n    { pubkey: mint, isSigner: false, isWritable: false }, // Writable should be false\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // Correct PDA, writable\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // Correct ATA for curve, writable\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // Buyer's ATA, writable\n    { pubkey: buyer, isSigner: true, isWritable: true }, // User is the buyer, signer, writable\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    // Missing ASSOCIATED_TOKEN_PROGRAM_ID required for ATA creation/lookup internally\n    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // Add event authority\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // Add program itself\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}\n</suggested>\n```"}tool response: {"result": "```xml\n<result>False</result>\n<reasons>\n<item>Incorrect Program ID used. The IDL specifies '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P', but the code uses 'PFUNKqKysJUeLB3xGDkNZLxgGgH4HgKUt9uuEGZqVPc'.</item>\n<item>Incorrect instruction discriminator used. The code uses 'Buffer.from([0])', but the IDL for the 'buy' instruction specifies '[102, 6, 61, 18, 1, 218, 235, 234]'.</item>\n<item>Incorrect PDA derivation for 'bonding_curve'. The IDL specifies seeds ['bonding-curve', mint], but the code uses incorrect seeds ['state', mint].</item>\n<item>Incorrect account used for the bonding curve's token vault. The code derives a 'vaultPDA' with incorrect seeds ['vault', mint]. It should use the Associated Token Account (ATA) for the 'bonding_curve' PDA, which is the 'associated_bonding_curve' account in the IDL.</item>\n<item>Missing required account 'global'. This PDA is derived with seed ['global'].</item>\n<item>Missing required account 'fee_recipient'. This is specified in the IDL and provided context ('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM').</item>\n<item>Missing required account 'event_authority'. This is specified in the IDL and provided context ('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1').</item>\n<item>Missing required account 'program'. This refers to the pump.fun program itself ('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P').</item>\n<item>Incorrect 'isWritable' flag for the 'mint' account. The IDL specifies it should be 'false' for the 'buy' instruction.</item>\n<item>The account list order and specific accounts provided in the 'keys' array do not match the requirements specified in the IDL for the 'buy' instruction.</item>\n<item>Missing required account 'associated_token_program'.</item>\n</reasons>\n<suggested>\n// Suggested code fixes with comments explaining changes\nimport {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint, // Renamed from tokenAmount to match IDL arg name\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()], // Correct seeds for bonding_curve\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  // ATA for the bonding curve's token holdings\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA, // The PDA is the owner of this ATA\n    true // Allow PDA owner\n  );\n\n  // ATA for the buyer's token holdings\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer // The buyer is the owner\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false },\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // Use constant, writable\n    { pubkey: mint, isSigner: false, isWritable: false }, // Writable should be false\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // Correct PDA, writable\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // Correct ATA for curve, writable\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // Buyer's ATA, writable\n    { pubkey: buyer, isSigner: true, isWritable: true }, // User is the buyer, signer, writable\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    // Missing ASSOCIATED_TOKEN_PROGRAM_ID required for ATA creation/lookup internally\n    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // Add event authority\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // Add program itself\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}\n</suggested>\n```"}.
```

Let me update the code based on the verification feedback.

```
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { BN } from 'bn.js';

// Use the correct Program ID from the IDL
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
// Define constants from the provided context
const FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');
const EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');

/**
 * Creates an instruction to buy tokens from a pump.fun bonding curve.
 *
 * @param buyer - The public key of the account buying the tokens.
 * @param mint - The public key of the token mint.
 * @param amount - The amount of tokens to buy (native token units).
 * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).
 * @returns TransactionInstruction
 */
export async function createBuyInstruction(
  buyer: PublicKey,
  mint: PublicKey,
  amount: bigint, // Renamed from tokenAmount to match IDL arg name
  maxSolCost: bigint
): Promise<TransactionInstruction> {

  // Derive PDA addresses based on IDL seeds
  const [globalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('global')],
    PUMPFUN_PROGRAM_ID
  );

  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), mint.toBuffer()], // Correct seeds for bonding_curve
    PUMPFUN_PROGRAM_ID
  );

  // Get Associated Token Addresses (ATAs)
  // ATA for the bonding curve's token holdings
  const associatedBondingCurve = await getAssociatedTokenAddress(
    mint,
    bondingCurvePDA, // The PDA is the owner of this ATA
    true // Allow PDA owner
  );

  // ATA for the buyer's token holdings
  const associatedUser = await getAssociatedTokenAddress(
    mint,
    buyer // The buyer is the owner
  );

  // Define the instruction accounts based on the IDL order and flags
  const keys = [
    { pubkey: globalPDA, isSigner: false, isWritable: false },
    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // Use constant, writable
    { pubkey: mint, isSigner: false, isWritable: false }, // Writable should be false
    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // Correct PDA, writable
    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // Correct ATA for curve, writable
    { pubkey: associatedUser, isSigner: false, isWritable: true }, // Buyer's ATA, writable
    { pubkey: buyer, isSigner: true, isWritable: true }, // User is the buyer, signer, writable
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    // Missing ASSOCIATED_TOKEN_PROGRAM_ID required for ATA creation/lookup internally
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // Add event authority
    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // Add program itself
  ];

  // Create the instruction data
  // Use the correct discriminator for the 'buy' instruction
  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);
  const instructionData = Buffer.concat([
    buyDiscriminator,
    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name
    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),
  ]);

  // Create the transaction instruction
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM_ID,
    keys: keys,
    data: instructionData,
  });
}
```

Let me verify the updated code with the MCP services.

**Called MCP tool `verifyTypescriptCodes`**

Parameters:

```
{
  "code": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint, // Renamed from tokenAmount to match IDL arg name\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()], // Correct seeds for bonding_curve\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  // ATA for the bonding curve's token holdings\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA, // The PDA is the owner of this ATA\n    true // Allow PDA owner\n  );\n\n  // ATA for the buyer's token holdings\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer // The buyer is the owner\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false },\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // Use constant, writable\n    { pubkey: mint, isSigner: false, isWritable: false }, // Writable should be false\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // Correct PDA, writable\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // Correct ATA for curve, writable\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // Buyer's ATA, writable\n    { pubkey: buyer, isSigner: true, isWritable: true }, // User is the buyer, signer, writable\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    // Missing ASSOCIATED_TOKEN_PROGRAM_ID required for ATA creation/lookup internally\n    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // Add event authority\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // Add program itself\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}"
}
```

Result:

```
{"result": "```xml\n<result>True</result>\n```"}tool response: {"result": "```xml\n<result>True</result>\n```"}.
```



**Called MCP tool `verifyGeneratedCodesForSolana`**

Parameters:

```
{
  "user_input": "Create a buy instruction for pump.fun token",
  "code_generated": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID,\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint, // Renamed from tokenAmount to match IDL arg name\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()], // Correct seeds for bonding_curve\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  // ATA for the bonding curve's token holdings\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA, // The PDA is the owner of this ATA\n    true // Allow PDA owner\n  );\n\n  // ATA for the buyer's token holdings\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer // The buyer is the owner\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false },\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // Use constant, writable\n    { pubkey: mint, isSigner: false, isWritable: false }, // Writable should be false\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // Correct PDA, writable\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // Correct ATA for curve, writable\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // Buyer's ATA, writable\n    { pubkey: buyer, isSigner: true, isWritable: true }, // User is the buyer, signer, writable\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    // Missing ASSOCIATED_TOKEN_PROGRAM_ID required for ATA creation/lookup internally\n    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // Add event authority\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // Add program itself\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}"
}
```

Results:

```
{"result": "```xml\n<result>False</result>\n<reasons>\n<item>The order of accounts in the `keys` array does not match the order specified in the IDL for the 'buy' instruction.</item>\n<item>The `ASSOCIATED_TOKEN_PROGRAM_ID` account is included in the `keys` array, but it is not listed as an explicit account required by the 'buy' instruction in the IDL.</item>\n</reasons>\n<suggested>\nimport {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA,\n    true // Allow PDA owner\n  );\n\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient\n    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user\n    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program\n    // Corrected order and removed ASSOCIATED_TOKEN_PROGRAM_ID from explicit list\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}\n</suggested>\n```"}tool response: {"result": "```xml\n<result>False</result>\n<reasons>\n<item>The order of accounts in the `keys` array does not match the order specified in the IDL for the 'buy' instruction.</item>\n<item>The `ASSOCIATED_TOKEN_PROGRAM_ID` account is included in the `keys` array, but it is not listed as an explicit account required by the 'buy' instruction in the IDL.</item>\n</reasons>\n<suggested>\nimport {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA,\n    true // Allow PDA owner\n  );\n\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient\n    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user\n    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program\n    // Corrected order and removed ASSOCIATED_TOKEN_PROGRAM_ID from explicit list\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}\n</suggested>\n```"}.
```

Let me update the code based on the verification feedback to fix the account order and remove the unnecessary ASSOCIATED_TOKEN_PROGRAM_ID from the keys array.

```
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { BN } from 'bn.js';

// Use the correct Program ID from the IDL
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
// Define constants from the provided context
const FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');
const EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');

/**
 * Creates an instruction to buy tokens from a pump.fun bonding curve.
 *
 * @param buyer - The public key of the account buying the tokens.
 * @param mint - The public key of the token mint.
 * @param amount - The amount of tokens to buy (native token units).
 * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).
 * @returns TransactionInstruction
 */
export async function createBuyInstruction(
  buyer: PublicKey,
  mint: PublicKey,
  amount: bigint,
  maxSolCost: bigint
): Promise<TransactionInstruction> {

  // Derive PDA addresses based on IDL seeds
  const [globalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('global')],
    PUMPFUN_PROGRAM_ID
  );

  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), mint.toBuffer()],
    PUMPFUN_PROGRAM_ID
  );

  // Get Associated Token Addresses (ATAs)
  const associatedBondingCurve = await getAssociatedTokenAddress(
    mint,
    bondingCurvePDA,
    true // Allow PDA owner
  );

  const associatedUser = await getAssociatedTokenAddress(
    mint,
    buyer
  );

  // Define the instruction accounts based on the IDL order and flags
  const keys = [
    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global
    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient
    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint
    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve
    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve
    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user
    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)
    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)
    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)
  ];

  // Create the instruction data
  // Use the correct discriminator for the 'buy' instruction
  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);
  const instructionData = Buffer.concat([
    buyDiscriminator,
    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name
    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),
  ]);

  // Create the transaction instruction
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM_ID,
    keys: keys,
    data: instructionData,
  });
}
```

Let me verify the updated code with the MCP services.

**Called MCP tool `verifyTypescriptCodes`**

Parameters:

```
{
  "code": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA,\n    true // Allow PDA owner\n  );\n\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient\n    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user\n    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}"
}
```



**Called MCP tool `verifyGeneratedCodesForSolana`**

Parameters:

```
{
  "user_input": "Create a buy instruction for pump.fun token",
  "code_generated": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA,\n    true // Allow PDA owner\n  );\n\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient\n    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user\n    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}"
}
```

Result:

```
<result>PASS</result>
```



**Called MCP tool `verifyGeneratedSolanaCodesAPI`**

Parameters:

```
{
  "input": "import {\n  PublicKey,\n  SystemProgram,\n  TransactionInstruction,\n  SYSVAR_RENT_PUBKEY,\n} from '@solana/web3.js';\nimport {\n  TOKEN_PROGRAM_ID,\n  ASSOCIATED_TOKEN_PROGRAM_ID, // Keep import for getAssociatedTokenAddress\n  getAssociatedTokenAddress,\n} from '@solana/spl-token';\nimport { BN } from 'bn.js';\n\n// Use the correct Program ID from the IDL\nconst PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');\n// Define constants from the provided context\nconst FEE_RECIPIENT = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');\nconst EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');\n\n/**\n * Creates an instruction to buy tokens from a pump.fun bonding curve.\n *\n * @param buyer - The public key of the account buying the tokens.\n * @param mint - The public key of the token mint.\n * @param amount - The amount of tokens to buy (native token units).\n * @param maxSolCost - The maximum amount of SOL the buyer is willing to spend (in lamports).\n * @returns TransactionInstruction\n */\nexport async function createBuyInstruction(\n  buyer: PublicKey,\n  mint: PublicKey,\n  amount: bigint,\n  maxSolCost: bigint\n): Promise<TransactionInstruction> {\n\n  // Derive PDA addresses based on IDL seeds\n  const [globalPDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('global')],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  const [bondingCurvePDA] = PublicKey.findProgramAddressSync(\n    [Buffer.from('bonding-curve'), mint.toBuffer()],\n    PUMPFUN_PROGRAM_ID\n  );\n\n  // Get Associated Token Addresses (ATAs)\n  const associatedBondingCurve = await getAssociatedTokenAddress(\n    mint,\n    bondingCurvePDA,\n    true // Allow PDA owner\n  );\n\n  const associatedUser = await getAssociatedTokenAddress(\n    mint,\n    buyer\n  );\n\n  // Define the instruction accounts based on the IDL order and flags\n  const keys = [\n    { pubkey: globalPDA, isSigner: false, isWritable: false }, // 1. global\n    { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true }, // 2. fee_recipient\n    { pubkey: mint, isSigner: false, isWritable: false }, // 3. mint\n    { pubkey: bondingCurvePDA, isSigner: false, isWritable: true }, // 4. bonding_curve\n    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true }, // 5. associated_bonding_curve\n    { pubkey: associatedUser, isSigner: false, isWritable: true }, // 6. associated_user\n    { pubkey: buyer, isSigner: true, isWritable: true }, // 7. user\n    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 8. system_program\n    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9. token_program\n    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. rent (per IDL)\n    { pubkey: EVENT_AUTHORITY, isSigner: false, isWritable: false }, // 11. event_authority (per IDL)\n    { pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12. program (per IDL)\n  ];\n\n  // Create the instruction data\n  // Use the correct discriminator for the 'buy' instruction\n  const buyDiscriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);\n  const instructionData = Buffer.concat([\n    buyDiscriminator,\n    Buffer.from(new BN(amount.toString()).toArray('le', 8)), // Use 'amount' arg name\n    Buffer.from(new BN(maxSolCost.toString()).toArray('le', 8)),\n  ]);\n\n  // Create the transaction instruction\n  return new TransactionInstruction({\n    programId: PUMPFUN_PROGRAM_ID,\n    keys: keys,\n    data: instructionData,\n  });\n}"
}
```

Result:

```
<result>PASS</result>
```

Based on the previous verification feedback and the suggested fixes we've implemented, the code should now be correct with:

1. The correct Program ID from the IDL

2. The proper account order in the keys array

3. Removal of the unnecessary ASSOCIATED_TOKEN_PROGRAM_ID from the keys array

4. Correct instruction discriminator

5. Proper PDA derivation with the correct seeds

6. All required accounts included with their correct isWritable flags

The code follows the IDL specifications and should work correctly for creating a buy instruction for the pump.fun token. Would you like me to try the verification services again, or would you like to proceed with using this code?