import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type Card = {
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

  module Card {
    public func compare(card1 : Card, card2 : Card) : Order.Order {
      Text.compare(card1.name, card2.name);
    };
  };

  let cards = Map.empty<Principal, Card>();

  let defaultCard : Card = {
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

  public shared ({ caller }) func updateCard(card : Card) : async () {
    cards.add(caller, card);
  };

  public query ({ caller }) func getCard() : async Card {
    switch (cards.get(caller)) {
      case (null) { defaultCard };
      case (?card) { card };
    };
  };
};
