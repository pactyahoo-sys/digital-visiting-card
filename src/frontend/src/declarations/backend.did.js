// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({ 'admin': IDL.Null, 'user': IDL.Null, 'guest': IDL.Null });
  const Card = IDL.Record({
    'bio': IDL.Text,
    'name': IDL.Text,
    'email': IDL.Text,
    'website': IDL.Text,
    'company': IDL.Text,
    'jobTitle': IDL.Text,
    'phone': IDL.Text,
    'location': IDL.Text,
    'profilePhotoUrl': IDL.Text,
  });
  const CertResult = IDL.Record({ 'method': IDL.Text, 'blob_hash': IDL.Text });
  const RefillInfo = IDL.Record({ 'proposed_top_up_amount': IDL.Opt(IDL.Nat) });
  const RefillResult = IDL.Record({ 'success': IDL.Opt(IDL.Bool), 'topped_up_amount': IDL.Opt(IDL.Nat) });
  return IDL.Service({
    'getPublicCard': IDL.Func([], [Card], ['query']),
    'updateCard': IDL.Func([Card], [], []),
    '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
    '_caffeineStorageCreateCertificate': IDL.Func([IDL.Text], [CertResult], []),
    '_caffeineStorageBlobIsLive': IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], ['query']),
    '_caffeineStorageBlobsToDelete': IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
    '_caffeineStorageConfirmBlobDeletion': IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
    '_caffeineStorageRefillCashier': IDL.Func([IDL.Opt(RefillInfo)], [RefillResult], []),
    '_caffeineStorageUpdateGatewayPrincipals': IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
