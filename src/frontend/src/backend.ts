/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserRole = { __kind__: "admin" } | { __kind__: "user" } | { __kind__: "guest" };

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) { this._blob = blob; }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string { return this.directURL; }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

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

export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, private processError?: (error: unknown) => never){}

    private async call<T>(fn: () => Promise<T>): Promise<T> {
        if (this.processError) {
            try { return await fn(); } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        return fn();
    }

    async getPublicCard(): Promise<Card> { return this.call(() => this.actor.getPublicCard()); }
    async updateCard(arg0: Card): Promise<void> { return this.call(() => this.actor.updateCard(arg0)); }
    async _initializeAccessControlWithSecret(secret: string): Promise<void> { return this.call(() => this.actor._initializeAccessControlWithSecret(secret)); }
    async isCallerAdmin(): Promise<boolean> { return this.call(() => this.actor.isCallerAdmin()); }
    async getCallerUserRole(): Promise<UserRole> { return this.call(() => this.actor.getCallerUserRole()); }
    async assignCallerUserRole(user: Principal, role: UserRole): Promise<void> { return this.call(() => this.actor.assignCallerUserRole(user, role)); }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, { agent, canisterId, ...options.actorOptions });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
