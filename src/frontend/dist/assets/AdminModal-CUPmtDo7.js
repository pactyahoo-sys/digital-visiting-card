import { r as reactExports, u as useActor, a as useInternetIdentity, j as jsxRuntimeExports, l as loadConfig, H as HttpAgent, S as StorageClient, b as ue } from "./index-BVA2o9hL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const DEFAULT_PROFILE_IMG = `${"/"}assets/uploads/nagarajan-profile.png`;
function AdminModal({
  card,
  onClose,
  onSaved
}) {
  const { actor } = useActor();
  const { identity, clear } = useInternetIdentity();
  const [form, setForm] = reactExports.useState({ ...card });
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handlePhotoUpload(e) {
    var _a, _b;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !identity) return;
    setUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ identity, host: config.backend_host });
      if ((_b = config.backend_host) == null ? void 0 : _b.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {
        });
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const url = await storageClient.getDirectURL(hash);
      setForm((prev) => ({ ...prev, profilePhotoUrl: url }));
      ue.success("Photo uploaded!");
    } catch (err) {
      ue.error(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`
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
      ue.success("Card updated successfully!");
      onClose();
    } catch (err) {
      ue.error(
        `Save failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSaving(false);
    }
  }
  function handleLogout() {
    clear();
    onClose();
    ue.success("Logged out");
  }
  const photoSrc = form.profilePhotoUrl || DEFAULT_PROFILE_IMG;
  const fields = [
    { key: "name", label: "Name" },
    { key: "jobTitle", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "bio", label: "Bio" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "location", label: "Location" },
    { key: "website", label: "Website", type: "url" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-overlay admin-overlay-in", "data-ocid": "admin.modal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-panel admin-panel-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-panel-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "admin-panel-title", children: "Edit Card" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            className: "admin-icon-btn",
            "data-ocid": "admin.close_button",
            title: "Logout",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "admin-icon-btn",
            "data-ocid": "admin.cancel_button",
            title: "Close",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-photo-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photoSrc, alt: "Profile", className: "admin-photo-preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/*",
          onChange: handlePhotoUpload,
          style: { display: "none" },
          "data-ocid": "admin.upload_button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          className: "admin-upload-btn",
          disabled: uploading,
          "data-ocid": "admin.upload_button",
          children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 14 }),
            uploading ? "Uploading..." : "Change Photo"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-form", children: fields.map(({ key, label, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `admin-field-${key}`, className: "admin-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: type || "text",
          value: form[key],
          onChange: (e) => set(key, e.target.value),
          id: `admin-field-${key}`,
          className: "admin-input",
          "data-ocid": `admin.${key}.input`
        }
      )
    ] }, key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "admin-btn admin-btn-cancel",
          "data-ocid": "admin.cancel_button",
          disabled: saving,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleSave,
          className: "admin-btn admin-btn-save",
          "data-ocid": "admin.save_button",
          disabled: saving || uploading,
          children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : null,
            saving ? "Saving..." : "Save Changes"
          ]
        }
      )
    ] })
  ] }) });
}
export {
  AdminModal as default
};
