/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type UserRole = { 'admin': null } | { 'user': null } | { 'guest': null };

export interface Card {
  'bio': string;
  'name': string;
  'email': string;
  'website': string;
  'company': string;
  'jobTitle': string;
  'phone': string;
  'location': string;
  'profilePhotoUrl': string;
}
export interface _SERVICE {
  'getPublicCard': ActorMethod<[], Card>;
  'updateCard': ActorMethod<[Card], undefined>;
  '_initializeAccessControlWithSecret': ActorMethod<[string], undefined>;
  'isCallerAdmin': ActorMethod<[], boolean>;
  'getCallerUserRole': ActorMethod<[], UserRole>;
  'assignCallerUserRole': ActorMethod<[Principal, UserRole], undefined>;
  '_caffeineStorageCreateCertificate': ActorMethod<[string], { method: string; blob_hash: string }>;
  '_caffeineStorageBlobIsLive': ActorMethod<[Uint8Array], boolean>;
  '_caffeineStorageBlobsToDelete': ActorMethod<[], Uint8Array[]>;
  '_caffeineStorageConfirmBlobDeletion': ActorMethod<[Uint8Array[]], undefined>;
  '_caffeineStorageRefillCashier': ActorMethod<[[] | [{ proposed_top_up_amount: [] | [bigint] }]], { success: [] | [boolean]; topped_up_amount: [] | [bigint] }>;
  '_caffeineStorageUpdateGatewayPrincipals': ActorMethod<[], undefined>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
