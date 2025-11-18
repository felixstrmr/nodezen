export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alert_channels: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["notification_channel_types"]
          workspace: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["notification_channel_types"]
          workspace: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["notification_channel_types"]
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_channels_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_notifications: {
        Row: {
          alert: string
          created_at: string
          id: string
          message: string
          sent_at: string
          status: string
          workspace: string
        }
        Insert: {
          alert: string
          created_at?: string
          id?: string
          message: string
          sent_at: string
          status: string
          workspace: string
        }
        Update: {
          alert?: string
          created_at?: string
          id?: string
          message?: string
          sent_at?: string
          status?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_notifications_alert_fkey"
            columns: ["alert"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_notifications_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_rules: {
        Row: {
          conditions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          workspace: string
        }
        Insert: {
          conditions: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          workspace: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_rules_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          rule: string
          workspace: string
        }
        Insert: {
          created_at?: string
          id?: string
          rule: string
          workspace: string
        }
        Update: {
          created_at?: string
          id?: string
          rule?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_rule_fkey"
            columns: ["rule"]
            isOneToOne: false
            referencedRelation: "alert_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      backups: {
        Row: {
          created_at: string
          id: string
          path: string
          size_bytes: number
          workflow: string
          workspace: string
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          size_bytes: number
          workflow: string
          workspace: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          size_bytes?: number
          workflow?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "backups_workflow_fkey"
            columns: ["workflow"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backups_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      executions: {
        Row: {
          created_at: string
          duration_ms: number
          error_message: string | null
          error_node: string | null
          id: string
          mode: Database["public"]["Enums"]["execution_modes"]
          n8n_execution_id: string
          retry_count: number
          started_at: string
          status: Database["public"]["Enums"]["execution_statuses"]
          stopped_at: string | null
          workflow: string
          workspace: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          error_message?: string | null
          error_node?: string | null
          id?: string
          mode: Database["public"]["Enums"]["execution_modes"]
          n8n_execution_id: string
          retry_count?: number
          started_at: string
          status: Database["public"]["Enums"]["execution_statuses"]
          stopped_at?: string | null
          workflow: string
          workspace: string
        }
        Update: {
          created_at?: string
          duration_ms?: number
          error_message?: string | null
          error_node?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["execution_modes"]
          n8n_execution_id?: string
          retry_count?: number
          started_at?: string
          status?: Database["public"]["Enums"]["execution_statuses"]
          stopped_at?: string | null
          workflow?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "executions_workflow_fkey"
            columns: ["workflow"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executions_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      instances: {
        Row: {
          api_key: string
          created_at: string
          description: string | null
          id: string
          last_synced_at: string
          name: string
          status: Database["public"]["Enums"]["instance_statuses"]
          url: string
          workspace: string
        }
        Insert: {
          api_key: string
          created_at?: string
          description?: string | null
          id?: string
          last_synced_at: string
          name: string
          status: Database["public"]["Enums"]["instance_statuses"]
          url: string
          workspace: string
        }
        Update: {
          api_key?: string
          created_at?: string
          description?: string | null
          id?: string
          last_synced_at?: string
          name?: string
          status?: Database["public"]["Enums"]["instance_statuses"]
          url?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "instances_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active_workspace: string | null
          avatar: string | null
          created_at: string
          email: string
          id: string
        }
        Insert: {
          active_workspace?: string | null
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          active_workspace?: string | null
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_active_workspace_fkey"
            columns: ["active_workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          id: string
          instance: string
          is_active: boolean
          is_monitored: boolean
          n8n_workflow_id: string
          name: string
          workspace: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance: string
          is_active: boolean
          is_monitored: boolean
          n8n_workflow_id: string
          name: string
          workspace: string
        }
        Update: {
          created_at?: string
          id?: string
          instance?: string
          is_active?: boolean
          is_monitored?: boolean
          n8n_workflow_id?: string
          name?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_instance_fkey"
            columns: ["instance"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["workspace_user_roles"]
          user: string
          workspace: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["workspace_user_roles"]
          user: string
          workspace: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["workspace_user_roles"]
          user?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_users_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_users_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json
          slug: string
          subscription: Database["public"]["Enums"]["workspace_subscriptions"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json
          slug?: string
          subscription?: Database["public"]["Enums"]["workspace_subscriptions"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json
          slug?: string
          subscription?: Database["public"]["Enums"]["workspace_subscriptions"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_workspace_user: {
        Args: { user_id: string; workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severities: "critical" | "warning"
      alert_statuses: "new" | "acknowledged" | "resolved"
      execution_modes:
        | "manual"
        | "trigger"
        | "internal"
        | "error"
        | "retry"
        | "webhook"
        | "cli"
      execution_statuses:
        | "error"
        | "success"
        | "waiting"
        | "running"
        | "canceled"
      instance_statuses: "connected" | "disconnected"
      notification_channel_types: "email"
      workspace_subscriptions: "free" | "pro" | "premium"
      workspace_user_roles: "owner" | "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severities: ["critical", "warning"],
      alert_statuses: ["new", "acknowledged", "resolved"],
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
      notification_channel_types: ["email"],
      workspace_subscriptions: ["free", "pro", "premium"],
      workspace_user_roles: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
