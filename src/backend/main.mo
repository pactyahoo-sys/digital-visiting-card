import AccessControl "./authorization/access-control";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";
import Storage "./blob-storage/Storage";

actor {
  // ----- Legacy types — kept for upgrade compatibility only -----
  // The previous version stored these stable variables with these exact types.
  // They must remain declared here so the upgrade does not fail with M0169.
  type LegacyCard = {
    name : Text;
    jobTitle : Text;
    company : Text;
    email : Text;
    phone : Text;
    location : Text;
    website : Text;
    linkedin : Text;
    twitter : Text;
    bio : Text;
  };

  let cards = Map.empty<Principal, LegacyCard>();
  let defaultCard : LegacyCard = {
    name = "Nagarajan";
    jobTitle = "Sales Officer";
    company = "InstaSite Kerala";
    email = "cynorlux@gmail.com";
    phone = "+91 8838510443";
    location = "TC 34/1425, Puliarakonnam-Moonnammoodu Road, Thiruvananthapuram";
    website = "https://instasite.in";
    linkedin = "";
    twitter = "";
    bio = "Build. Launch. Grow.";
  };

  // ----- Authorization mixin state -----
  let _accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  // ----- Card profile -----
  type Card = {
    name : Text;
    jobTitle : Text;
    company : Text;
    email : Text;
    phone : Text;
    location : Text;
    website : Text;
    bio : Text;
    profilePhotoUrl : Text;
  };

  var cardProfile : Card = {
    name = "Nagarajan";
    jobTitle = "Sales Officer";
    company = "InstaSite Kerala";
    email = "cynorlux@gmail.com";
    phone = "+91 8838510443";
    location = "Thiruvananthapuram, Kerala";
    website = "https://instasite.in";
    bio = "Build. Launch. Grow.";
    profilePhotoUrl = "";
  };

  // Public: anyone can read the card
  public query func getPublicCard() : async Card {
    cardProfile;
  };

  // Admin-only: update the card
  public shared ({ caller }) func updateCard(card : Card) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admin can update the card");
    };
    cardProfile := card;
  };

  // ----- Authorization mixin -----
  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("CAFFEINE_ADMIN_TOKEN environment variable is not set");
      };
      case (?adminToken) {
        AccessControl.initialize(_accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(_accessControlState, caller);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(_accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(_accessControlState, caller, user, role);
  };

  // ----- Blob storage mixin -----
  transient let _caffeineStorageState : Storage.State = Storage.new();

  type _CaffeineStorageRefillInformation = { proposed_top_up_amount : ?Nat };
  type _CaffeineStorageRefillResult = { success : ?Bool; topped_up_amount : ?Nat };
  type _CaffeineStorageCreateCertificateResult = { method : Text; blob_hash : Text };

  public shared ({ caller }) func _caffeineStorageRefillCashier(refillInformation : ?_CaffeineStorageRefillInformation) : async _CaffeineStorageRefillResult {
    let cashier = await Storage.getCashierPrincipal();
    if (cashier != caller) { Runtime.trap("Unauthorized access") };
    await Storage.refillCashier(_caffeineStorageState, cashier, refillInformation);
  };

  public shared ({ caller }) func _caffeineStorageUpdateGatewayPrincipals() : async () {
    await Storage.updateGatewayPrincipals(_caffeineStorageState);
  };

  public query ({ caller }) func _caffeineStorageBlobIsLive(hash : Blob) : async Bool {
    Prim.isStorageBlobLive(hash);
  };

  public query ({ caller }) func _caffeineStorageBlobsToDelete() : async [Blob] {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    let deadBlobs = Prim.getDeadBlobs();
    switch (deadBlobs) {
      case (null) { [] };
      case (?deadBlobs) { deadBlobs.sliceToArray(0, 10000) };
    };
  };

  public shared ({ caller }) func _caffeineStorageConfirmBlobDeletion(blobs : [Blob]) : async () {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    Prim.pruneConfirmedDeadBlobs(blobs);
    type GC = actor { __motoko_gc_trigger : () -> async () };
    let myGC = actor (debug_show (Prim.getSelfPrincipal<system>())) : GC;
    await myGC.__motoko_gc_trigger();
  };

  public shared ({ caller }) func _caffeineStorageCreateCertificate(blobHash : Text) : async _CaffeineStorageCreateCertificateResult {
    { method = "upload"; blob_hash = blobHash };
  };
};
