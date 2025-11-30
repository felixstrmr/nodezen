import { Button } from "@/components/ui/button";
import { n8nClient } from "@/lib/clients/n8n-client";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { decrypt } from "@/utils/encryption";

export default function Page() {
  async function test() {
    "use server";

    const supabase = await supabaseClient();
    const { data: instance } = await supabase
      .from("instances")
      .select("*")
      .eq("id", "863e49a2-010c-4f62-8720-cd8370527bcd")
      .maybeSingle()
      .throwOnError();

    if (!instance) {
      throw new Error("Instance not found");
    }

    const decryptedApiKey = await decrypt(instance.n8n_api_key);
    const client = new n8nClient(instance.n8n_url, decryptedApiKey);

    const executions = await client.getExecutions({ includeData: false });

    console.log(executions.length);
  }

  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Button onClick={test}>Test</Button>
    </div>
  );
}
