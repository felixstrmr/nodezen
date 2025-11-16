import N8nIcon from "@/components/icons/n8n-icon";

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-3xl pt-24">
        <h1 className="max-w-xl font-semibold text-7xl leading-tight tracking-tight">
          The best way to monitor your{" "}
          <N8nIcon className="ml-2 inline-block size-14" /> n8n workflows.
        </h1>
        <p className="mt-3 max-w-lg text-lg text-muted-foreground">
          Nodezen helps you keep your n8n workflows running smoothly. Create
          alerts, backups and get detailed insights into your workflows.
        </p>
      </div>
    </div>
  );
}
