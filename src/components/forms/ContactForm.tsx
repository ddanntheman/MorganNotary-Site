import { type ChangeEvent, type FormEvent, useState } from "react";
import { z } from "zod";

export type FormMode = "client" | "partner";

interface Props {
  clientFormspreeId: string;
  partnerFormspreeId: string;
  turnstileSiteKey?: string;
  initialMode?: FormMode;
}

const clientSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number.")
    .regex(/[\d\s()+-.]{10,}/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email."),
  serviceType: z.enum([
    "loan-signing",
    "estate-trust",
    "remote-online-notary",
    "apostille",
    "general-mobile-notary",
    "unsure",
  ]),
  preferredTime: z.string().min(1, "Let me know when works for you."),
  locationHint: z.string().min(2, "What city or zip are we meeting in?"),
  details: z.string().max(2000).optional(),
  peoplesRate: z.boolean().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm before submitting." }),
  }),
  botField: z.string().optional(),
});

const partnerSchema = z.object({
  firmName: z.string().min(2, "Firm or company name required."),
  contactName: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  role: z.enum(["title", "lender", "attorney", "real-estate", "other"]),
  volumeEstimate: z.string().optional(),
  details: z.string().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm before submitting." }),
  }),
  botField: z.string().optional(),
});

type ClientInput = z.infer<typeof clientSchema>;
type PartnerInput = z.infer<typeof partnerSchema>;

const INITIAL_CLIENT: Partial<ClientInput> = {
  name: "",
  phone: "",
  email: "",
  preferredTime: "",
  locationHint: "",
  details: "",
  peoplesRate: false,
  botField: "",
};

const INITIAL_PARTNER: Partial<PartnerInput> = {
  firmName: "",
  contactName: "",
  email: "",
  phone: "",
  details: "",
  botField: "",
};

const SERVICE_LABELS: Record<string, string> = {
  "loan-signing": "Loan signing",
  "estate-trust": "Estate / trust signing",
  "remote-online-notary": "Remote online (RON)",
  apostille: "Apostille",
  "general-mobile-notary": "General mobile notary",
  unsure: "Not sure yet",
};

const ROLE_LABELS: Record<string, string> = {
  title: "Title company",
  lender: "Lender / loan officer",
  attorney: "Attorney / law firm",
  "real-estate": "Real estate / property manager",
  other: "Other",
};

export default function ContactForm({
  clientFormspreeId,
  partnerFormspreeId,
  initialMode = "client",
}: Props) {
  const [mode, setMode] = useState<FormMode>(initialMode);
  const [client, setClient] = useState<Partial<ClientInput>>(INITIAL_CLIENT);
  const [partner, setPartner] = useState<Partial<PartnerInput>>(INITIAL_PARTNER);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const formspreeId = mode === "client" ? clientFormspreeId : partnerFormspreeId;

  function handleClientChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setClient((prev) => ({ ...prev, [name]: val }));
  }

  function handlePartnerChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setPartner((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setStatus("submitting");

    const schema = mode === "client" ? clientSchema : partnerSchema;
    const payload = mode === "client" ? client : partner;

    const result = schema.safeParse(payload);
    if (!result.success) {
      const flat: Record<string, string> = {};
      for (const issue of result.error.issues) {
        flat[issue.path.join(".")] = issue.message;
      }
      setErrors(flat);
      setStatus("idle");
      return;
    }

    if (result.data.botField && result.data.botField.length > 0) {
      // honeypot, silently "succeed"
      setStatus("success");
      return;
    }

    if (!formspreeId) {
      // Dev fallback, fake success so the form is usable before integration.
      setTimeout(() => setStatus("success"), 400);
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card card-dark">
        <h3 className="font-display text-2xl text-white mb-2">
          Got it, I'll be in touch within the hour.
        </h3>
        <p className="text-white/80">
          If it's urgent, you can also call or text{" "}
          <a href="tel:+18042156674" className="text-[color:var(--color-neon)]">
            (804) 215-6674
          </a>
          . Talk soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Contact form mode"
        className="inline-flex rounded-lg bg-[color:var(--color-warm-gray)] p-1 text-sm"
      >
        {(["client", "partner"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === m
                ? "bg-white text-[color:var(--color-plum)] shadow-sm font-medium"
                : "text-[color:var(--color-text-secondary)]"
            }`}
          >
            {m === "client" ? "Client booking" : "Title co. / Attorney"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-live="polite">
        {/* Honeypot */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="botField">Leave this blank</label>
          <input
            id="botField"
            name="botField"
            tabIndex={-1}
            autoComplete="off"
            value={(mode === "client" ? client.botField : partner.botField) ?? ""}
            onChange={mode === "client" ? handleClientChange : handlePartnerChange}
          />
        </div>

        {mode === "client" ? (
          <>
            <Field
              id="name"
              label="Your name"
              error={errors.name}
              required
              value={client.name ?? ""}
              onChange={handleClientChange}
              autoComplete="name"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                id="phone"
                type="tel"
                label="Phone"
                error={errors.phone}
                required
                value={client.phone ?? ""}
                onChange={handleClientChange}
                autoComplete="tel"
              />
              <Field
                id="email"
                type="email"
                label="Email"
                error={errors.email}
                required
                value={client.email ?? ""}
                onChange={handleClientChange}
                autoComplete="email"
              />
            </div>
            <Select
              id="serviceType"
              label="What do you need?"
              required
              error={errors.serviceType}
              value={client.serviceType ?? ""}
              onChange={handleClientChange}
              options={Object.entries(SERVICE_LABELS)}
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                id="preferredTime"
                label="When works for you?"
                placeholder="e.g., Tuesday evening, ASAP"
                required
                error={errors.preferredTime}
                value={client.preferredTime ?? ""}
                onChange={handleClientChange}
              />
              <Field
                id="locationHint"
                label="City or zip"
                placeholder="e.g., Midlothian, 23113"
                required
                error={errors.locationHint}
                value={client.locationHint ?? ""}
                onChange={handleClientChange}
              />
            </div>
            <TextArea
              id="details"
              label="Anything else I should know? (optional)"
              value={client.details ?? ""}
              onChange={handleClientChange}
              rows={4}
              error={errors.details}
            />
            <Checkbox
              id="peoplesRate"
              label="I'd like to use The People's Rate (community discount)."
              checked={Boolean(client.peoplesRate)}
              onChange={handleClientChange}
            />
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                id="firmName"
                label="Firm / company"
                required
                error={errors.firmName}
                value={partner.firmName ?? ""}
                onChange={handlePartnerChange}
                autoComplete="organization"
              />
              <Field
                id="contactName"
                label="Your name"
                required
                error={errors.contactName}
                value={partner.contactName ?? ""}
                onChange={handlePartnerChange}
                autoComplete="name"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                id="email"
                type="email"
                label="Work email"
                required
                error={errors.email}
                value={partner.email ?? ""}
                onChange={handlePartnerChange}
                autoComplete="email"
              />
              <Field
                id="phone"
                type="tel"
                label="Phone"
                required
                error={errors.phone}
                value={partner.phone ?? ""}
                onChange={handlePartnerChange}
                autoComplete="tel"
              />
            </div>
            <Select
              id="role"
              label="Your role"
              required
              error={errors.role}
              value={partner.role ?? ""}
              onChange={handlePartnerChange}
              options={Object.entries(ROLE_LABELS)}
            />
            <Field
              id="volumeEstimate"
              label="Estimated monthly signings (optional)"
              value={partner.volumeEstimate ?? ""}
              onChange={handlePartnerChange}
              placeholder="e.g., 3–5 per month"
            />
            <TextArea
              id="details"
              label="Tell me about your rotation or current need (optional)"
              rows={4}
              value={partner.details ?? ""}
              onChange={handlePartnerChange}
            />
          </>
        )}

        <Checkbox
          id="consent"
          label="I understand this form sends a message to Morgan and that replies will come from morgan@morgannotary.com."
          checked={mode === "client" ? Boolean(client.consent) : Boolean(partner.consent)}
          onChange={(e) => {
            const checked = (e.target as HTMLInputElement).checked;
            if (mode === "client")
              setClient((p) => ({ ...p, consent: checked as unknown as true }));
            else setPartner((p) => ({ ...p, consent: checked as unknown as true }));
          }}
          error={errors.consent}
        />

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        {status === "error" && (
          <p className="text-sm text-[color:var(--color-red)]">
            Something went wrong sending that. Please call or text me directly: (804) 215-6674.
          </p>
        )}
      </form>
    </div>
  );
}

/* ---------------- field primitives ---------------- */

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  error,
  autoComplete,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[color:var(--color-text-primary)]"
      >
        {label} {required && <span className="text-[color:var(--color-plum)]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-[15px] focus:outline-none focus:border-[color:var(--color-plum)] focus:ring-2 focus:ring-[color:var(--color-plum-light)]"
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[color:var(--color-red)]">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends Omit<FieldProps, "type" | "placeholder"> {
  options: [string, string][];
}
function Select({ id, label, required, value, onChange, options, error }: SelectProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[color:var(--color-text-primary)]"
      >
        {label} {required && <span className="text-[color:var(--color-plum)]">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-[15px] focus:outline-none focus:border-[color:var(--color-plum)] focus:ring-2 focus:ring-[color:var(--color-plum-light)]"
      >
        <option value="">Select one…</option>
        {options.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-xs text-[color:var(--color-red)]">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps extends Omit<FieldProps, "type"> {
  rows?: number;
}
function TextArea({ id, label, value, onChange, rows = 4, error, placeholder }: TextAreaProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[color:var(--color-text-primary)]"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-[15px] focus:outline-none focus:border-[color:var(--color-plum)] focus:ring-2 focus:ring-[color:var(--color-plum-light)]"
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[color:var(--color-red)]">
          {error}
        </p>
      )}
    </div>
  );
}

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
}
function Checkbox({ id, label, checked, onChange, error }: CheckboxProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex items-start gap-3 text-sm text-[color:var(--color-text-primary)] cursor-pointer"
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          className="mt-1 size-4 rounded border-[color:var(--color-border)] text-[color:var(--color-plum)] focus:ring-[color:var(--color-plum-light)]"
        />
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-[color:var(--color-red)] ml-7">{error}</p>}
    </div>
  );
}
