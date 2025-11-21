


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgmq";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."alert_severities" AS ENUM (
    'critical',
    'warning'
);


ALTER TYPE "public"."alert_severities" OWNER TO "postgres";


CREATE TYPE "public"."alert_statuses" AS ENUM (
    'new',
    'acknowledged',
    'resolved'
);


ALTER TYPE "public"."alert_statuses" OWNER TO "postgres";


CREATE TYPE "public"."execution_modes" AS ENUM (
    'manual',
    'trigger',
    'internal',
    'error',
    'retry',
    'webhook',
    'cli'
);


ALTER TYPE "public"."execution_modes" OWNER TO "postgres";


CREATE TYPE "public"."execution_statuses" AS ENUM (
    'error',
    'success',
    'waiting',
    'running',
    'canceled'
);


ALTER TYPE "public"."execution_statuses" OWNER TO "postgres";


CREATE TYPE "public"."instance_statuses" AS ENUM (
    'connected',
    'disconnected'
);


ALTER TYPE "public"."instance_statuses" OWNER TO "postgres";


CREATE TYPE "public"."notification_channel_types" AS ENUM (
    'email'
);


ALTER TYPE "public"."notification_channel_types" OWNER TO "postgres";


CREATE TYPE "public"."workspace_subscriptions" AS ENUM (
    'free',
    'pro',
    'premium'
);


ALTER TYPE "public"."workspace_subscriptions" OWNER TO "postgres";


CREATE TYPE "public"."workspace_user_roles" AS ENUM (
    'owner',
    'admin',
    'member',
    'viewer'
);


ALTER TYPE "public"."workspace_user_roles" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."aggregate_execution_metrics_daily"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO execution_metrics_daily (
    workspace,
    instance,
    workflow,
    date,
    total_executions,
    sucessful_executions,
    failed_executions,
    avg_duration_ms,
    p50_duration_ms,
    p95_duration_ms,
    p99_duration_ms,
    total_duration_ms
  )
  SELECT
    e.workspace,
    w.instance,
    e.workflow,
    date_trunc('day', e.started_at) as date,
    COUNT(*) as total_executions,
    COUNT(*) FILTER (WHERE e.status = 'success') as sucessful_executions,
    COUNT(*) FILTER (WHERE e.status = 'error') as failed_executions,
    AVG(e.duration_ms) as avg_duration_ms,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.duration_ms) as p50_duration_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY e.duration_ms) as p95_duration_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY e.duration_ms) as p99_duration_ms,
    SUM(e.duration_ms) as total_duration_ms
  FROM executions e
  JOIN workflows w ON e.workflow = w.id
  WHERE 
    e.started_at >= date_trunc('day', NOW() - INTERVAL '1 day')
    AND e.started_at < date_trunc('day', NOW())
  GROUP BY
    e.workspace,
    w.instance,
    e.workflow,
    date_trunc('day', e.started_at)
  ON CONFLICT (workspace, instance, workflow, date) DO NOTHING;
END;
$$;


ALTER FUNCTION "public"."aggregate_execution_metrics_daily"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."aggregate_execution_metrics_hourly"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO execution_metrics_hourly (
    workspace,
    instance,
    workflow,
    hour_start,
    total_executions,
    sucessful_executions,
    failed_executions,
    avg_duration_ms,
    p50_duration_ms,
    p95_duration_ms,
    p99_duration_ms,
    total_duration_ms
  )
  SELECT
    e.workspace,
    w.instance,
    e.workflow,
    date_trunc('hour', e.started_at) as hour_start,
    COUNT(*) as total_executions,
    COUNT(*) FILTER (WHERE e.status = 'success') as sucessful_executions,
    COUNT(*) FILTER (WHERE e.status = 'error') as failed_executions,
    AVG(e.duration_ms) as avg_duration_ms,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.duration_ms) as p50_duration_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY e.duration_ms) as p95_duration_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY e.duration_ms) as p99_duration_ms,
    SUM(e.duration_ms) as total_duration_ms
  FROM executions e
  JOIN workflows w ON e.workflow = w.id
  WHERE 
    e.started_at >= date_trunc('hour', NOW() - INTERVAL '1 hour')
    AND e.started_at < date_trunc('hour', NOW())
  GROUP BY
    e.workspace,
    w.instance,
    e.workflow,
    date_trunc('hour', e.started_at)
  ON CONFLICT (workspace, instance, workflow, hour_start) DO NOTHING;
END;
$$;


ALTER FUNCTION "public"."aggregate_execution_metrics_hourly"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.users (id, email, avatar)
  values (new.id, new.email, new.raw_user_meta_data ->> 'avatar');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_workspace_user"("workspace_id" "uuid", "user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_users 
    WHERE workspace_users.workspace = workspace_id 
    AND workspace_users.user = user_id
  );
END;
$$;


ALTER FUNCTION "public"."is_workspace_user"("workspace_id" "uuid", "user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."alert_channels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "config" "jsonb" NOT NULL,
    "type" "public"."notification_channel_types" NOT NULL
);


ALTER TABLE "public"."alert_channels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alert_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "alert" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "sent_at" timestamp with time zone NOT NULL,
    "message" "text" NOT NULL
);


ALTER TABLE "public"."alert_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alert_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "conditions" "jsonb" NOT NULL
);


ALTER TABLE "public"."alert_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alerts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "rule" "uuid" NOT NULL
);


ALTER TABLE "public"."alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."backups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "workflow" "uuid" NOT NULL,
    "path" "text" NOT NULL,
    "size_bytes" numeric NOT NULL
);


ALTER TABLE "public"."backups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."execution_metrics_daily" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "instance" "uuid" NOT NULL,
    "workflow" "uuid" NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "total_executions" numeric DEFAULT '0'::numeric NOT NULL,
    "sucessful_executions" numeric DEFAULT '0'::numeric NOT NULL,
    "failed_executions" numeric NOT NULL,
    "avg_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p50_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p95_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p99_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "total_duration_ms" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE "public"."execution_metrics_daily" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."execution_metrics_hourly" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "instance" "uuid" NOT NULL,
    "workflow" "uuid" NOT NULL,
    "hour_start" timestamp with time zone NOT NULL,
    "total_executions" numeric DEFAULT '0'::numeric NOT NULL,
    "sucessful_executions" numeric DEFAULT '0'::numeric NOT NULL,
    "failed_executions" numeric NOT NULL,
    "avg_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p50_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p95_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "p99_duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "total_duration_ms" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE "public"."execution_metrics_hourly" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."executions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "workflow" "uuid" NOT NULL,
    "mode" "public"."execution_modes" NOT NULL,
    "status" "public"."execution_statuses" NOT NULL,
    "started_at" timestamp with time zone NOT NULL,
    "stopped_at" timestamp with time zone,
    "n8n_execution_id" "text" NOT NULL,
    "error_message" "text",
    "error_node" "text",
    "duration_ms" numeric DEFAULT '0'::numeric NOT NULL,
    "retry_count" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE "public"."executions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instances" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "url" "text" NOT NULL,
    "api_key" "text" NOT NULL,
    "last_synced_at" timestamp with time zone NOT NULL,
    "status" "public"."instance_statuses" NOT NULL
);


ALTER TABLE "public"."instances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "avatar" "text",
    "active_workspace" "uuid"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "instance" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "n8n_workflow_id" "text" NOT NULL,
    "is_active" boolean NOT NULL,
    "is_monitored" boolean NOT NULL
);


ALTER TABLE "public"."workflows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspace_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace" "uuid" NOT NULL,
    "user" "uuid" NOT NULL,
    "role" "public"."workspace_user_roles" NOT NULL
);


ALTER TABLE "public"."workspace_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "settings" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "slug" "text" DEFAULT ''::"text" NOT NULL,
    "subscription" "public"."workspace_subscriptions" DEFAULT 'free'::"public"."workspace_subscriptions" NOT NULL
);


ALTER TABLE "public"."workspaces" OWNER TO "postgres";


ALTER TABLE ONLY "public"."alert_notifications"
    ADD CONSTRAINT "alert_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alert_rules"
    ADD CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alerts"
    ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."backups"
    ADD CONSTRAINT "backups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."execution_metrics_daily"
    ADD CONSTRAINT "execution_metrics_daily_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."execution_metrics_daily"
    ADD CONSTRAINT "execution_metrics_daily_unique" UNIQUE ("workspace", "instance", "workflow", "date");



ALTER TABLE ONLY "public"."execution_metrics_hourly"
    ADD CONSTRAINT "execution_metrics_hourly_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."execution_metrics_hourly"
    ADD CONSTRAINT "execution_metrics_hourly_unique" UNIQUE ("workspace", "instance", "workflow", "hour_start");



ALTER TABLE ONLY "public"."executions"
    ADD CONSTRAINT "executions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alert_channels"
    ADD CONSTRAINT "notification_channels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspace_users"
    ADD CONSTRAINT "workspace_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id");




CREATE INDEX "backups_workflow_idx" ON "public"."backups" USING "btree" ("workflow");



CREATE INDEX "backups_workspace_idx" ON "public"."backups" USING "btree" ("workspace");



CREATE INDEX "executions_workflow_idx" ON "public"."executions" USING "btree" ("workflow");



CREATE UNIQUE INDEX "executions_workflow_n8n_execution_id_idx" ON "public"."executions" USING "btree" ("workflow", "n8n_execution_id");



CREATE INDEX "executions_workspace_idx" ON "public"."executions" USING "btree" ("workspace");



CREATE INDEX "instances_workspace_idx" ON "public"."instances" USING "btree" ("workspace");



CREATE INDEX "users_active_workspace_idx" ON "public"."users" USING "btree" ("active_workspace");



CREATE UNIQUE INDEX "workflows_instance_n8n_workflow_id_idx" ON "public"."workflows" USING "btree" ("instance", "n8n_workflow_id");



CREATE INDEX "workflows_workspace_idx" ON "public"."workflows" USING "btree" ("workspace");



CREATE INDEX "workspace_users_user_idx" ON "public"."workspace_users" USING "btree" ("user");



CREATE INDEX "workspace_users_workspace_idx" ON "public"."workspace_users" USING "btree" ("workspace");



ALTER TABLE ONLY "public"."alert_notifications"
    ADD CONSTRAINT "alert_notifications_alert_fkey" FOREIGN KEY ("alert") REFERENCES "public"."alerts"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."alert_notifications"
    ADD CONSTRAINT "alert_notifications_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alert_rules"
    ADD CONSTRAINT "alert_rules_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alerts"
    ADD CONSTRAINT "alerts_rule_fkey" FOREIGN KEY ("rule") REFERENCES "public"."alert_rules"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."alerts"
    ADD CONSTRAINT "alerts_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."backups"
    ADD CONSTRAINT "backups_workflow_fkey" FOREIGN KEY ("workflow") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."backups"
    ADD CONSTRAINT "backups_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_daily"
    ADD CONSTRAINT "execution_metrics_daily_instance_fkey" FOREIGN KEY ("instance") REFERENCES "public"."instances"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_daily"
    ADD CONSTRAINT "execution_metrics_daily_workflow_fkey" FOREIGN KEY ("workflow") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_daily"
    ADD CONSTRAINT "execution_metrics_daily_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_hourly"
    ADD CONSTRAINT "execution_metrics_hourly_instance_fkey" FOREIGN KEY ("instance") REFERENCES "public"."instances"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_hourly"
    ADD CONSTRAINT "execution_metrics_hourly_workflow_fkey" FOREIGN KEY ("workflow") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."execution_metrics_hourly"
    ADD CONSTRAINT "execution_metrics_hourly_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."executions"
    ADD CONSTRAINT "executions_workflow_fkey" FOREIGN KEY ("workflow") REFERENCES "public"."workflows"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."executions"
    ADD CONSTRAINT "executions_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alert_channels"
    ADD CONSTRAINT "notification_channels_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_active_workspace_fkey" FOREIGN KEY ("active_workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_instance_fkey" FOREIGN KEY ("instance") REFERENCES "public"."instances"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_users"
    ADD CONSTRAINT "workspace_users_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_users"
    ADD CONSTRAINT "workspace_users_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Insert -> Workspace User" ON "public"."instances" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> User" ON "public"."users" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Select -> Workpace User" ON "public"."alert_notifications" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."alert_channels" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."alert_rules" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."alerts" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."backups" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."execution_metrics_daily" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."execution_metrics_hourly" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."executions" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."instances" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."workflows" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."workspace_users" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("workspace", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Select -> Workspace User" ON "public"."workspaces" FOR SELECT TO "authenticated" USING ("public"."is_workspace_user"("id", ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."alert_channels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alert_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alert_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."backups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."execution_metrics_daily" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."execution_metrics_hourly" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."executions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspace_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";














































































































































































GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_daily"() TO "anon";
GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_daily"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_daily"() TO "service_role";



GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_hourly"() TO "anon";
GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_hourly"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."aggregate_execution_metrics_hourly"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_workspace_user"("workspace_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_workspace_user"("workspace_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_workspace_user"("workspace_id" "uuid", "user_id" "uuid") TO "service_role";
























GRANT ALL ON TABLE "public"."alert_channels" TO "anon";
GRANT ALL ON TABLE "public"."alert_channels" TO "authenticated";
GRANT ALL ON TABLE "public"."alert_channels" TO "service_role";



GRANT ALL ON TABLE "public"."alert_notifications" TO "anon";
GRANT ALL ON TABLE "public"."alert_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."alert_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."alert_rules" TO "anon";
GRANT ALL ON TABLE "public"."alert_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."alert_rules" TO "service_role";



GRANT ALL ON TABLE "public"."alerts" TO "anon";
GRANT ALL ON TABLE "public"."alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."alerts" TO "service_role";



GRANT ALL ON TABLE "public"."backups" TO "anon";
GRANT ALL ON TABLE "public"."backups" TO "authenticated";
GRANT ALL ON TABLE "public"."backups" TO "service_role";



GRANT ALL ON TABLE "public"."execution_metrics_daily" TO "anon";
GRANT ALL ON TABLE "public"."execution_metrics_daily" TO "authenticated";
GRANT ALL ON TABLE "public"."execution_metrics_daily" TO "service_role";



GRANT ALL ON TABLE "public"."execution_metrics_hourly" TO "anon";
GRANT ALL ON TABLE "public"."execution_metrics_hourly" TO "authenticated";
GRANT ALL ON TABLE "public"."execution_metrics_hourly" TO "service_role";



GRANT ALL ON TABLE "public"."executions" TO "anon";
GRANT ALL ON TABLE "public"."executions" TO "authenticated";
GRANT ALL ON TABLE "public"."executions" TO "service_role";



GRANT ALL ON TABLE "public"."instances" TO "anon";
GRANT ALL ON TABLE "public"."instances" TO "authenticated";
GRANT ALL ON TABLE "public"."instances" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."workflows" TO "anon";
GRANT ALL ON TABLE "public"."workflows" TO "authenticated";
GRANT ALL ON TABLE "public"."workflows" TO "service_role";



GRANT ALL ON TABLE "public"."workspace_users" TO "anon";
GRANT ALL ON TABLE "public"."workspace_users" TO "authenticated";
GRANT ALL ON TABLE "public"."workspace_users" TO "service_role";



GRANT ALL ON TABLE "public"."workspaces" TO "anon";
GRANT ALL ON TABLE "public"."workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."workspaces" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Select -> Authenticated 1taeigh_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'backups'::text));



