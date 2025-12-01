export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      executions: {
        Row: {
          created_at: string;
          duration_ms: number | null;
          error_message: string | null;
          error_node: string | null;
          id: string;
          mode: Database["public"]["Enums"]["execution_modes"];
          n8n_execution_id: string;
          retry_of: string | null;
          started_at: string;
          status: Database["public"]["Enums"]["execution_statuses"];
          stopped_at: string | null;
          workflow: string;
          workspace: string;
        };
        Insert: {
          created_at?: string;
          duration_ms?: number | null;
          error_message?: string | null;
          error_node?: string | null;
          id?: string;
          mode: Database["public"]["Enums"]["execution_modes"];
          n8n_execution_id: string;
          retry_of?: string | null;
          started_at: string;
          status: Database["public"]["Enums"]["execution_statuses"];
          stopped_at?: string | null;
          workflow: string;
          workspace: string;
        };
        Update: {
          created_at?: string;
          duration_ms?: number | null;
          error_message?: string | null;
          error_node?: string | null;
          id?: string;
          mode?: Database["public"]["Enums"]["execution_modes"];
          n8n_execution_id?: string;
          retry_of?: string | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["execution_statuses"];
          stopped_at?: string | null;
          workflow?: string;
          workspace?: string;
        };
        Relationships: [
          {
            foreignKeyName: "executions_retry_of_fkey";
            columns: ["retry_of"];
            isOneToOne: false;
            referencedRelation: "executions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "executions_workflow_fkey";
            columns: ["workflow"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "executions_workspace_fkey";
            columns: ["workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      instances: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          last_execution_sync_at: string | null;
          last_status_check_at: string;
          last_workflow_sync_at: string | null;
          n8n_api_key: string;
          n8n_url: string;
          name: string;
          status: Database["public"]["Enums"]["instance_statuses"];
          updated_at: string | null;
          updated_by: string | null;
          workspace: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          last_execution_sync_at?: string | null;
          last_status_check_at: string;
          last_workflow_sync_at?: string | null;
          n8n_api_key: string;
          n8n_url: string;
          name: string;
          status: Database["public"]["Enums"]["instance_statuses"];
          updated_at?: string | null;
          updated_by?: string | null;
          workspace: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          last_execution_sync_at?: string | null;
          last_status_check_at?: string;
          last_workflow_sync_at?: string | null;
          n8n_api_key?: string;
          n8n_url?: string;
          name?: string;
          status?: Database["public"]["Enums"]["instance_statuses"];
          updated_at?: string | null;
          updated_by?: string | null;
          workspace?: string;
        };
        Relationships: [
          {
            foreignKeyName: "instances_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instances_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instances_workspace_fkey";
            columns: ["workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      metrics: {
        Row: {
          avg_duration_ms: number;
          canceled_executions: number;
          created_at: string;
          executions_per_hour: number;
          failed_executions: number;
          failure_rate: number;
          granularity: string;
          id: string;
          instance: string | null;
          manual_executions: number;
          max_duration_ms: number;
          median_duration_ms: number;
          min_duration_ms: number;
          p95_duration_ms: number;
          p99_duration_ms: number;
          period_end: string;
          period_start: string;
          retry_executions: number;
          running_executions: number;
          success_rate: number;
          successful_executions: number;
          total_duration_ms: number;
          total_executions: number;
          trigger_executions: number;
          waiting_executions: number;
          webhook_executions: number;
          workflow: string | null;
          workspace: string;
        };
        Insert: {
          avg_duration_ms?: number;
          canceled_executions?: number;
          created_at?: string;
          executions_per_hour?: number;
          failed_executions?: number;
          failure_rate?: number;
          granularity: string;
          id?: string;
          instance?: string | null;
          manual_executions?: number;
          max_duration_ms?: number;
          median_duration_ms?: number;
          min_duration_ms?: number;
          p95_duration_ms?: number;
          p99_duration_ms?: number;
          period_end: string;
          period_start: string;
          retry_executions?: number;
          running_executions?: number;
          success_rate?: number;
          successful_executions?: number;
          total_duration_ms?: number;
          total_executions?: number;
          trigger_executions?: number;
          waiting_executions?: number;
          webhook_executions?: number;
          workflow?: string | null;
          workspace: string;
        };
        Update: {
          avg_duration_ms?: number;
          canceled_executions?: number;
          created_at?: string;
          executions_per_hour?: number;
          failed_executions?: number;
          failure_rate?: number;
          granularity?: string;
          id?: string;
          instance?: string | null;
          manual_executions?: number;
          max_duration_ms?: number;
          median_duration_ms?: number;
          min_duration_ms?: number;
          p95_duration_ms?: number;
          p99_duration_ms?: number;
          period_end?: string;
          period_start?: string;
          retry_executions?: number;
          running_executions?: number;
          success_rate?: number;
          successful_executions?: number;
          total_duration_ms?: number;
          total_executions?: number;
          trigger_executions?: number;
          waiting_executions?: number;
          webhook_executions?: number;
          workflow?: string | null;
          workspace?: string;
        };
        Relationships: [
          {
            foreignKeyName: "metrics_instance_fkey";
            columns: ["instance"];
            isOneToOne: false;
            referencedRelation: "instances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "metrics_workflow_fkey";
            columns: ["workflow"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "metrics_workspace_fkey";
            columns: ["workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          active_workspace: string | null;
          avatar: string | null;
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          active_workspace?: string | null;
          avatar?: string | null;
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          active_workspace?: string | null;
          avatar?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_active_workspaces_fkey";
            columns: ["active_workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workflows: {
        Row: {
          created_at: string;
          id: string;
          instance: string;
          is_active: boolean;
          is_monitored: boolean;
          n8n_version_id: string;
          n8n_workflow_id: string;
          name: string;
          nodes: Json;
          updated_at: string | null;
          workspace: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          instance: string;
          is_active: boolean;
          is_monitored?: boolean;
          n8n_version_id: string;
          n8n_workflow_id: string;
          name: string;
          nodes: Json;
          updated_at?: string | null;
          workspace: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          instance?: string;
          is_active?: boolean;
          is_monitored?: boolean;
          n8n_version_id?: string;
          n8n_workflow_id?: string;
          name?: string;
          nodes?: Json;
          updated_at?: string | null;
          workspace?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workflows_instance_fkey";
            columns: ["instance"];
            isOneToOne: false;
            referencedRelation: "instances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workflows_workspace_fkey";
            columns: ["workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_users: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["workspace_user_roles"];
          user: string;
          workspace: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["workspace_user_roles"];
          user: string;
          workspace: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["workspace_user_roles"];
          user?: string;
          workspace?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_users_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workspace_users_workspace_fkey";
            columns: ["workspace"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          settings: Json;
          subscription: Database["public"]["Enums"]["workspace_subscriptions"];
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          settings?: Json;
          subscription?: Database["public"]["Enums"]["workspace_subscriptions"];
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          settings?: Json;
          subscription?: Database["public"]["Enums"]["workspace_subscriptions"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_workspace_manager: {
        Args: { user_id: string; workspace_id: string };
        Returns: boolean;
      };
      is_workspace_user: {
        Args: { user_id: string; workspace_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      execution_modes:
        | "manual"
        | "trigger"
        | "internal"
        | "error"
        | "retry"
        | "webhook"
        | "cli";
      execution_statuses:
        | "error"
        | "success"
        | "waiting"
        | "running"
        | "canceled";
      instance_statuses: "connected" | "disconnected";
      workspace_subscriptions: "free" | "pro" | "ultra";
      workspace_user_roles: "owner" | "manager" | "viewer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      execution_modes: [
        "manual",
        "trigger",
        "internal",
        "error",
        "retry",
        "webhook",
        "cli",
      ],
      execution_statuses: [
        "error",
        "success",
        "waiting",
        "running",
        "canceled",
      ],
      instance_statuses: ["connected", "disconnected"],
      workspace_subscriptions: ["free", "pro", "ultra"],
      workspace_user_roles: ["owner", "manager", "viewer"],
    },
  },
} as const;
