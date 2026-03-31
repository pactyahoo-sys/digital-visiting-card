import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserRole = { __kind__: "admin" } | { __kind__: "user" } | { __kind__: "guest" };
export interface Card {
    bio: string;
    name: string;
    email: string;
    website: string;
    company: string;
    jobTitle: string;
    phone: string;
    location: string;
    profilePhotoUrl: string;
}
export interface backendInterface {
    getPublicCard(): Promise<Card>;
    updateCard(card: Card): Promise<void>;
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
}
