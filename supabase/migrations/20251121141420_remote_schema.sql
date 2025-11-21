create type "public"."alert_channel_types" as enum ('email');

create type "public"."alert_notification_statuses" as enum ('sent', 'pending', 'failed', 'retrying');

alter table "public"."workspaces" drop constraint if exists "workspaces_slug_key";

drop index if exists "public"."workspaces_slug_key";

alter table "public"."workspaces" alter column "subscription" drop default;

alter type "public"."alert_severities" rename to "alert_severities__old_version_to_be_dropped";

create type "public"."alert_severities" as enum ('critical', 'warning', 'info');

alter type "public"."workspace_subscriptions" rename to "workspace_subscriptions__old_version_to_be_dropped";

create type "public"."workspace_subscriptions" as enum ('free', 'pro', 'ultra');


  create table "public"."alert_rule_channels" (
    "rule" uuid not null,
    "channel" uuid not null
      );


alter table "public"."alert_rule_channels" enable row level security;


  create table "public"."alert_rule_conditions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "rule" uuid not null,
    "metric" text not null,
    "operator" text not null,
    "threshold" numeric not null,
    "time_window" text not null,
    "workflow" uuid,
    "instance" uuid,
    "condition_group" numeric not null default '0'::numeric,
    "workspace" uuid not null
      );


alter table "public"."alert_rule_conditions" enable row level security;

alter table "public"."workspaces" alter column subscription type "public"."workspace_subscriptions" using subscription::text::"public"."workspace_subscriptions";

alter table "public"."workspaces" alter column "subscription" set default 'free'::public.workspace_subscriptions;

drop type "public"."alert_severities__old_version_to_be_dropped";

drop type "public"."workspace_subscriptions__old_version_to_be_dropped";

alter table "public"."alert_channels" add column "channel" uuid;

alter table "public"."alert_channels" alter column "type" set data type public.alert_channel_types using "type"::text::public.alert_channel_types;

alter table "public"."alert_notifications" add column "channel" uuid not null;

alter table "public"."alert_notifications" alter column "status" set data type public.alert_notification_statuses using "status"::public.alert_notification_statuses;

alter table "public"."alert_rules" add column "cooldown_period" numeric not null;

alter table "public"."alert_rules" add column "last_triggered_at" timestamp with time zone;

alter table "public"."alert_rules" add column "trigger_count" numeric;

alter table "public"."alerts" add column "acknowledged_at" timestamp with time zone;

alter table "public"."alerts" add column "acknowledged_by" uuid;

alter table "public"."alerts" add column "execution" uuid;

alter table "public"."alerts" add column "instance" uuid;

alter table "public"."alerts" add column "metric_values" jsonb not null default '{}'::jsonb;

alter table "public"."alerts" add column "resolved_at" timestamp with time zone;

alter table "public"."alerts" add column "resolved_by" uuid;

alter table "public"."alerts" add column "severity" public.alert_severities not null;

alter table "public"."alerts" add column "status" public.alert_statuses not null;

alter table "public"."alerts" add column "workflow" uuid;

alter table "public"."workspaces" drop column "slug";

drop type "public"."notification_channel_types";

CREATE UNIQUE INDEX alert_rule_channels_pkey ON public.alert_rule_channels USING btree (rule, channel);

CREATE UNIQUE INDEX alert_rule_conditions_pkey ON public.alert_rule_conditions USING btree (id);

CREATE INDEX alerts_rule_idx ON public.alerts USING btree (rule);

CREATE INDEX alerts_workspace_idx ON public.alerts USING btree (workspace);

CREATE INDEX execution_metrics_daily_instance_idx ON public.execution_metrics_daily USING btree (instance);

CREATE INDEX execution_metrics_daily_workflow_idx ON public.execution_metrics_daily USING btree (workflow);

CREATE INDEX execution_metrics_daily_workspace_idx ON public.execution_metrics_daily USING btree (workspace);

CREATE INDEX execution_metrics_hourly_instance_idx ON public.execution_metrics_hourly USING btree (instance);

CREATE INDEX execution_metrics_hourly_workflow_idx ON public.execution_metrics_hourly USING btree (workflow);

CREATE INDEX execution_metrics_hourly_workspace_idx ON public.execution_metrics_hourly USING btree (workspace);

alter table "public"."alert_rule_channels" add constraint "alert_rule_channels_pkey" PRIMARY KEY using index "alert_rule_channels_pkey";

alter table "public"."alert_rule_conditions" add constraint "alert_rule_conditions_pkey" PRIMARY KEY using index "alert_rule_conditions_pkey";

alter table "public"."alert_channels" add constraint "alert_channels_channel_fkey" FOREIGN KEY (channel) REFERENCES public.alert_channels(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."alert_channels" validate constraint "alert_channels_channel_fkey";

alter table "public"."alert_notifications" add constraint "alert_notifications_channel_fkey" FOREIGN KEY (channel) REFERENCES public.alert_channels(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."alert_notifications" validate constraint "alert_notifications_channel_fkey";

alter table "public"."alert_rule_channels" add constraint "alert_rule_channels_channel_fkey" FOREIGN KEY (channel) REFERENCES public.alert_channels(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."alert_rule_channels" validate constraint "alert_rule_channels_channel_fkey";

alter table "public"."alert_rule_channels" add constraint "alert_rule_channels_rule_fkey" FOREIGN KEY (rule) REFERENCES public.alert_rules(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alert_rule_channels" validate constraint "alert_rule_channels_rule_fkey";

alter table "public"."alert_rule_conditions" add constraint "alert_rule_conditions_instance_fkey" FOREIGN KEY (instance) REFERENCES public.instances(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."alert_rule_conditions" validate constraint "alert_rule_conditions_instance_fkey";

alter table "public"."alert_rule_conditions" add constraint "alert_rule_conditions_rule_fkey" FOREIGN KEY (rule) REFERENCES public.alert_rules(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alert_rule_conditions" validate constraint "alert_rule_conditions_rule_fkey";

alter table "public"."alert_rule_conditions" add constraint "alert_rule_conditions_workflow_fkey" FOREIGN KEY (workflow) REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."alert_rule_conditions" validate constraint "alert_rule_conditions_workflow_fkey";

alter table "public"."alert_rule_conditions" add constraint "alert_rule_conditions_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alert_rule_conditions" validate constraint "alert_rule_conditions_workspace_fkey";

alter table "public"."alerts" add constraint "alerts_acknowledged_by_fkey" FOREIGN KEY (acknowledged_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."alerts" validate constraint "alerts_acknowledged_by_fkey";

alter table "public"."alerts" add constraint "alerts_execution_fkey" FOREIGN KEY (execution) REFERENCES public.executions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alerts" validate constraint "alerts_execution_fkey";

alter table "public"."alerts" add constraint "alerts_instance_fkey" FOREIGN KEY (instance) REFERENCES public.instances(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alerts" validate constraint "alerts_instance_fkey";

alter table "public"."alerts" add constraint "alerts_resolved_by_fkey" FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."alerts" validate constraint "alerts_resolved_by_fkey";

alter table "public"."alerts" add constraint "alerts_workflow_fkey" FOREIGN KEY (workflow) REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."alerts" validate constraint "alerts_workflow_fkey";

grant delete on table "public"."alert_rule_channels" to "anon";

grant insert on table "public"."alert_rule_channels" to "anon";

grant references on table "public"."alert_rule_channels" to "anon";

grant select on table "public"."alert_rule_channels" to "anon";

grant trigger on table "public"."alert_rule_channels" to "anon";

grant truncate on table "public"."alert_rule_channels" to "anon";

grant update on table "public"."alert_rule_channels" to "anon";

grant delete on table "public"."alert_rule_channels" to "authenticated";

grant insert on table "public"."alert_rule_channels" to "authenticated";

grant references on table "public"."alert_rule_channels" to "authenticated";

grant select on table "public"."alert_rule_channels" to "authenticated";

grant trigger on table "public"."alert_rule_channels" to "authenticated";

grant truncate on table "public"."alert_rule_channels" to "authenticated";

grant update on table "public"."alert_rule_channels" to "authenticated";

grant delete on table "public"."alert_rule_channels" to "service_role";

grant insert on table "public"."alert_rule_channels" to "service_role";

grant references on table "public"."alert_rule_channels" to "service_role";

grant select on table "public"."alert_rule_channels" to "service_role";

grant trigger on table "public"."alert_rule_channels" to "service_role";

grant truncate on table "public"."alert_rule_channels" to "service_role";

grant update on table "public"."alert_rule_channels" to "service_role";

grant delete on table "public"."alert_rule_conditions" to "anon";

grant insert on table "public"."alert_rule_conditions" to "anon";

grant references on table "public"."alert_rule_conditions" to "anon";

grant select on table "public"."alert_rule_conditions" to "anon";

grant trigger on table "public"."alert_rule_conditions" to "anon";

grant truncate on table "public"."alert_rule_conditions" to "anon";

grant update on table "public"."alert_rule_conditions" to "anon";

grant delete on table "public"."alert_rule_conditions" to "authenticated";

grant insert on table "public"."alert_rule_conditions" to "authenticated";

grant references on table "public"."alert_rule_conditions" to "authenticated";

grant select on table "public"."alert_rule_conditions" to "authenticated";

grant trigger on table "public"."alert_rule_conditions" to "authenticated";

grant truncate on table "public"."alert_rule_conditions" to "authenticated";

grant update on table "public"."alert_rule_conditions" to "authenticated";

grant delete on table "public"."alert_rule_conditions" to "service_role";

grant insert on table "public"."alert_rule_conditions" to "service_role";

grant references on table "public"."alert_rule_conditions" to "service_role";

grant select on table "public"."alert_rule_conditions" to "service_role";

grant trigger on table "public"."alert_rule_conditions" to "service_role";

grant truncate on table "public"."alert_rule_conditions" to "service_role";

grant update on table "public"."alert_rule_conditions" to "service_role";


  create policy "Insert -> Workspace User"
  on "public"."alert_channels"
  as permissive
  for insert
  to authenticated
with check (public.is_workspace_user(workspace, ( SELECT auth.uid() AS uid)));



  create policy "Insert -> Workspace User"
  on "public"."alert_rules"
  as permissive
  for insert
  to authenticated
with check (public.is_workspace_user(workspace, ( SELECT auth.uid() AS uid)));



