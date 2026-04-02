import { HttpAgent } from "@icp-sdk/core/agent";
import { Loader2, LogOut, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Card } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { StorageClient } from "../utils/StorageClient";

const DEFAULT_PROFILE_IMG = `${import.meta.env.BASE_URL}assets/uploads/nagarajan-profile.png`;

export interface AdminModalProps {
  card: Card;
  onClose: () => void;
  onSaved: (card: Card) => void;
}

export default function AdminModal({
  card,
  onClose,
  onSaved,
}: AdminModalProps) {
  const { actor } = useActor();
  const { identity, clear } = useInternetIdentity();
  const [form, setForm] = useState<Card>({ ...card });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof Card, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    setUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ identity, host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const url = await storageClient.getDirectURL(hash);
      setForm((prev) => ({ ...prev, profilePhotoUrl: url }));
      toast.success("Photo uploaded!");
    } catch (err) {
      toast.error(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.updateCard(form);
      onSaved(form);
      toast.success("Card updated successfully!");
      onClose();
    } catch (err) {
      toast.error(
        `Save failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clear();
    onClose();
    toast.success("Logged out");
  }

  const photoSrc = form.profilePhotoUrl || DEFAULT_PROFILE_IMG;

  const fields: { key: keyof Card; label: string; type?: string }[] = [
    { key: "name", label: "Name" },
    { key: "jobTitle", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "bio", label: "Bio" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "location", label: "Location" },
    { key: "website", label: "Website", type: "url" },
  ];

  return (
    <div className="admin-overlay admin-overlay-in" data-ocid="admin.modal">
      <div className="admin-panel admin-panel-in">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Edit Card</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-icon-btn"
              data-ocid="admin.close_button"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="admin-icon-btn"
              data-ocid="admin.cancel_button"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Photo upload */}
        <div className="admin-photo-section">
          <img src={photoSrc} alt="Profile" className="admin-photo-preview" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
            data-ocid="admin.upload_button"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="admin-upload-btn"
            disabled={uploading}
            data-ocid="admin.upload_button"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        {/* Form fields */}
        <div className="admin-form">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="admin-field">
              <label htmlFor={`admin-field-${key}`} className="admin-label">
                {label}
              </label>
              <input
                type={type || "text"}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                id={`admin-field-${key}`}
                className="admin-input"
                data-ocid={`admin.${key}.input`}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="admin-actions">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-cancel"
            data-ocid="admin.cancel_button"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="admin-btn admin-btn-save"
            data-ocid="admin.save_button"
            disabled={saving || uploading}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
