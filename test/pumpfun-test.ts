import { describe, expect, test } from '@jest/globals';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Connection,
} from '@solana/web3.js';
import {
  createBuyInstruction,
} from '../src/pumpfun';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

describe('Pumpfun Transaction Instructions', () => {
  // Test accounts
  const payer = new PublicKey('FXkGydbnG4jHVYqbBWWG4kkkwCpz6YEeVtM1vA6kZLaS');
  const mint = new PublicKey('61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump');

  describe('createBuyInstructionSync', () => {
    test('should create a valid buy instruction', async () => {
      const amount = BigInt(500000000); // 0.5 SOL in lamports
      const maxSolCost = BigInt(600000000); // 0.6 SOL in lamports
      const instruction = await createBuyInstruction(
        payer,
        mint,
        amount,
        maxSolCost
      );

      // Verify program ID
      expect(instruction.programId).toEqual(PUMPFUN_PROGRAM_ID);

      // Verify keys (we have 12 keys now)
      console.log(instruction.keys)
      expect(instruction.keys).toHaveLength(12);

      // Verify Global Account
      expect(instruction.keys[0].pubkey.toString()).toEqual('4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf'); // Global

      // Verify Fee Recipient
      expect(instruction.keys[1].pubkey.toString()).toEqual('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');

      expect(instruction.keys[2]).toEqual({ pubkey: mint, isSigner: false, isWritable: false }); // Mint
      expect(instruction.keys[6]).toEqual({ pubkey: payer, isSigner: true, isWritable: true }); // User (buyer)
      expect(instruction.keys[11]).toEqual({ pubkey: PUMPFUN_PROGRAM_ID, isSigner: false, isWritable: false }); // Program ID

      // Verify System Program and Token Program
      expect(instruction.keys[7]).toEqual({ pubkey: SystemProgram.programId, isSigner: false, isWritable: false });
      expect(instruction.keys[8]).toEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });
  });

  // Additional test to verify data serialization
  describe('Instruction Data Serialization', () => {
    test('should correctly serialize instruction data with different amounts', async () => {
      const testCases = [
        {
          params: {
            amount: BigInt(18934343364869),
            maxSolCost: BigInt(1386000000),
          },
          expectedHex: '66063d1201daebea0571cf7e3811000080ae9c5200000000',
        }
      ];

      for (const { params, expectedHex } of testCases) {
        const maxSolCost = params.maxSolCost
        const amount = params.amount
        const instruction = await createBuyInstruction(payer, mint, amount, maxSolCost);

        console.log(instruction.data.toString('hex'))
        expect(expectedHex).toEqual(instruction.data.toString('hex'));
      }
    });
  });
});
