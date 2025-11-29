create schema if not exists "pgmq";

create extension if not exists "pgmq" with schema "pgmq";

create type "public"."workspace_subscriptions" as enum ('free', 'pro', 'ultra');

create type "public"."workspace_user_roles" as enum ('owner', 'manager', 'viewer');


  create table "public"."instances" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "workspace" uuid not null,
    "name" text not null,
    "description" text,
    "n8n_url" text not null,
    "n8n_api_key" text not null,
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid
      );


alter table "public"."instances" enable row level security;


  create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    "avatar" text,
    "active_workspace" uuid
      );


alter table "public"."users" enable row level security;


  create table "public"."workflows" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "workspace" uuid not null,
    "instance" uuid not null,
    "name" text not null,
    "n8n_workflow_id" text not null,
    "n8n_version_id" uuid not null,
    "is_active" boolean not null,
    "is_monitored" boolean not null,
    "nodes" jsonb not null
      );


alter table "public"."workflows" enable row level security;


  create table "public"."workspace_users" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "workspace" uuid not null,
    "user" uuid not null,
    "role" public.workspace_user_roles not null
      );


alter table "public"."workspace_users" enable row level security;


  create table "public"."workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "settings" jsonb not null default '{}'::jsonb,
    "subscription" public.workspace_subscriptions not null default 'free'::public.workspace_subscriptions
      );


alter table "public"."workspaces" enable row level security;

CREATE UNIQUE INDEX instances_pkey ON public.instances USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX workflows_pkey ON public.workflows USING btree (id);

CREATE UNIQUE INDEX workspace_users_pkey ON public.workspace_users USING btree (id);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspaces USING btree (id);

alter table "public"."instances" add constraint "instances_pkey" PRIMARY KEY using index "instances_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."workflows" add constraint "workflows_pkey" PRIMARY KEY using index "workflows_pkey";

alter table "public"."workspace_users" add constraint "workspace_users_pkey" PRIMARY KEY using index "workspace_users_pkey";

alter table "public"."workspaces" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."instances" add constraint "instances_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."instances" validate constraint "instances_created_by_fkey";

alter table "public"."instances" add constraint "instances_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."instances" validate constraint "instances_updated_by_fkey";

alter table "public"."instances" add constraint "instances_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."instances" validate constraint "instances_workspace_fkey";

alter table "public"."users" add constraint "users_active_workspaces_fkey" FOREIGN KEY (active_workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."users" validate constraint "users_active_workspaces_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."workflows" add constraint "workflows_instance_fkey" FOREIGN KEY (instance) REFERENCES public.instances(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workflows" validate constraint "workflows_instance_fkey";

alter table "public"."workflows" add constraint "workflows_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workflows" validate constraint "workflows_workspace_fkey";

alter table "public"."workspace_users" add constraint "workspace_users_user_fkey" FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "workspace_users_user_fkey";

alter table "public"."workspace_users" add constraint "workspace_users_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "workspace_users_workspace_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.users (id, email, avatar)
  values (new.id, new.email, new.raw_user_meta_data ->> 'avatar');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_workspace_manager(workspace_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_users 
    WHERE workspace_users.workspace = workspace_id 
    AND workspace_users.user = user_id
    AND (workspace_users.role = 'owner' OR workspace_users.role = 'manager')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_workspace_user(workspace_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_users 
    WHERE workspace_users.workspace = workspace_id 
    AND workspace_users.user = user_id
  );
END;
$function$
;

grant delete on table "public"."instances" to "anon";

grant insert on table "public"."instances" to "anon";

grant references on table "public"."instances" to "anon";

grant select on table "public"."instances" to "anon";

grant trigger on table "public"."instances" to "anon";

grant truncate on table "public"."instances" to "anon";

grant update on table "public"."instances" to "anon";

grant delete on table "public"."instances" to "authenticated";

grant insert on table "public"."instances" to "authenticated";

grant references on table "public"."instances" to "authenticated";

grant select on table "public"."instances" to "authenticated";

grant trigger on table "public"."instances" to "authenticated";

grant truncate on table "public"."instances" to "authenticated";

grant update on table "public"."instances" to "authenticated";

grant delete on table "public"."instances" to "postgres";

grant insert on table "public"."instances" to "postgres";

grant references on table "public"."instances" to "postgres";

grant select on table "public"."instances" to "postgres";

grant trigger on table "public"."instances" to "postgres";

grant truncate on table "public"."instances" to "postgres";

grant update on table "public"."instances" to "postgres";

grant delete on table "public"."instances" to "service_role";

grant insert on table "public"."instances" to "service_role";

grant references on table "public"."instances" to "service_role";

grant select on table "public"."instances" to "service_role";

grant trigger on table "public"."instances" to "service_role";

grant truncate on table "public"."instances" to "service_role";

grant update on table "public"."instances" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "postgres";

grant insert on table "public"."users" to "postgres";

grant references on table "public"."users" to "postgres";

grant select on table "public"."users" to "postgres";

grant trigger on table "public"."users" to "postgres";

grant truncate on table "public"."users" to "postgres";

grant update on table "public"."users" to "postgres";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."workflows" to "anon";

grant insert on table "public"."workflows" to "anon";

grant references on table "public"."workflows" to "anon";

grant select on table "public"."workflows" to "anon";

grant trigger on table "public"."workflows" to "anon";

grant truncate on table "public"."workflows" to "anon";

grant update on table "public"."workflows" to "anon";

grant delete on table "public"."workflows" to "authenticated";

grant insert on table "public"."workflows" to "authenticated";

grant references on table "public"."workflows" to "authenticated";

grant select on table "public"."workflows" to "authenticated";

grant trigger on table "public"."workflows" to "authenticated";

grant truncate on table "public"."workflows" to "authenticated";

grant update on table "public"."workflows" to "authenticated";

grant delete on table "public"."workflows" to "postgres";

grant insert on table "public"."workflows" to "postgres";

grant references on table "public"."workflows" to "postgres";

grant select on table "public"."workflows" to "postgres";

grant trigger on table "public"."workflows" to "postgres";

grant truncate on table "public"."workflows" to "postgres";

grant update on table "public"."workflows" to "postgres";

grant delete on table "public"."workflows" to "service_role";

grant insert on table "public"."workflows" to "service_role";

grant references on table "public"."workflows" to "service_role";

grant select on table "public"."workflows" to "service_role";

grant trigger on table "public"."workflows" to "service_role";

grant truncate on table "public"."workflows" to "service_role";

grant update on table "public"."workflows" to "service_role";

grant delete on table "public"."workspace_users" to "anon";

grant insert on table "public"."workspace_users" to "anon";

grant references on table "public"."workspace_users" to "anon";

grant select on table "public"."workspace_users" to "anon";

grant trigger on table "public"."workspace_users" to "anon";

grant truncate on table "public"."workspace_users" to "anon";

grant update on table "public"."workspace_users" to "anon";

grant delete on table "public"."workspace_users" to "authenticated";

grant insert on table "public"."workspace_users" to "authenticated";

grant references on table "public"."workspace_users" to "authenticated";

grant select on table "public"."workspace_users" to "authenticated";

grant trigger on table "public"."workspace_users" to "authenticated";

grant truncate on table "public"."workspace_users" to "authenticated";

grant update on table "public"."workspace_users" to "authenticated";

grant delete on table "public"."workspace_users" to "postgres";

grant insert on table "public"."workspace_users" to "postgres";

grant references on table "public"."workspace_users" to "postgres";

grant select on table "public"."workspace_users" to "postgres";

grant trigger on table "public"."workspace_users" to "postgres";

grant truncate on table "public"."workspace_users" to "postgres";

grant update on table "public"."workspace_users" to "postgres";

grant delete on table "public"."workspace_users" to "service_role";

grant insert on table "public"."workspace_users" to "service_role";

grant references on table "public"."workspace_users" to "service_role";

grant select on table "public"."workspace_users" to "service_role";

grant trigger on table "public"."workspace_users" to "service_role";

grant truncate on table "public"."workspace_users" to "service_role";

grant update on table "public"."workspace_users" to "service_role";

grant delete on table "public"."workspaces" to "anon";

grant insert on table "public"."workspaces" to "anon";

grant references on table "public"."workspaces" to "anon";

grant select on table "public"."workspaces" to "anon";

grant trigger on table "public"."workspaces" to "anon";

grant truncate on table "public"."workspaces" to "anon";

grant update on table "public"."workspaces" to "anon";

grant delete on table "public"."workspaces" to "authenticated";

grant insert on table "public"."workspaces" to "authenticated";

grant references on table "public"."workspaces" to "authenticated";

grant select on table "public"."workspaces" to "authenticated";

grant trigger on table "public"."workspaces" to "authenticated";

grant truncate on table "public"."workspaces" to "authenticated";

grant update on table "public"."workspaces" to "authenticated";

grant delete on table "public"."workspaces" to "postgres";

grant insert on table "public"."workspaces" to "postgres";

grant references on table "public"."workspaces" to "postgres";

grant select on table "public"."workspaces" to "postgres";

grant trigger on table "public"."workspaces" to "postgres";

grant truncate on table "public"."workspaces" to "postgres";

grant update on table "public"."workspaces" to "postgres";

grant delete on table "public"."workspaces" to "service_role";

grant insert on table "public"."workspaces" to "service_role";

grant references on table "public"."workspaces" to "service_role";

grant select on table "public"."workspaces" to "service_role";

grant trigger on table "public"."workspaces" to "service_role";

grant truncate on table "public"."workspaces" to "service_role";

grant update on table "public"."workspaces" to "service_role";


  create policy "Insert -> Workspace Manager"
  on "public"."instances"
  as permissive
  for insert
  to authenticated
with check (public.is_workspace_manager(workspace, ( SELECT auth.uid() AS uid)));



  create policy "Select -> Workspace User"
  on "public"."instances"
  as permissive
  for select
  to authenticated
using (public.is_workspace_user(workspace, ( SELECT auth.uid() AS uid)));



  create policy "Select -> User"
  on "public"."users"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Select -> Workspace User"
  on "public"."workflows"
  as permissive
  for select
  to authenticated
using (public.is_workspace_user(workspace, ( SELECT auth.uid() AS uid)));



  create policy "Insert -> Authenticated"
  on "public"."workspace_users"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Select -> Workspace User"
  on "public"."workspace_users"
  as permissive
  for select
  to authenticated
using (public.is_workspace_user(workspace, ( SELECT auth.uid() AS uid)));



  create policy "Insert -> Authenticated"
  on "public"."workspaces"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Select -> Workspace User"
  on "public"."workspaces"
  as permissive
  for select
  to authenticated
using (public.is_workspace_user(id, ( SELECT auth.uid() AS uid)));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


