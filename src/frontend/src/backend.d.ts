import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Card {
    bio: string;
    linkedin: string;
    twitter: string;
    name: string;
    email: string;
    website: string;
    company: string;
    jobTitle: string;
    phone: string;
    location: string;
}
export interface backendInterface {
    getCard(): Promise<Card>;
    updateCard(card: Card): Promise<void>;
}
