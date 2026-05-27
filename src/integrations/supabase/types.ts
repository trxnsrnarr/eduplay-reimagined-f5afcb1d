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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          created_at: string
          description: string
          icon: string
          id: string
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          icon: string
          id?: string
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          bab_index: number
          created_at: string
          id: string
          mapel_slug: string
          modul_slug: string
          slide_index: number
          user_id: string
        }
        Insert: {
          bab_index: number
          created_at?: string
          id?: string
          mapel_slug: string
          modul_slug: string
          slide_index?: number
          user_id: string
        }
        Update: {
          bab_index?: number
          created_at?: string
          id?: string
          mapel_slug?: string
          modul_slug?: string
          slide_index?: number
          user_id?: string
        }
        Relationships: []
      }
      chapter_completions: {
        Row: {
          bab_index: number
          completed_at: string
          id: string
          mapel_slug: string
          modul_slug: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          bab_index: number
          completed_at?: string
          id?: string
          mapel_slug: string
          modul_slug: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          bab_index?: number
          completed_at?: string
          id?: string
          mapel_slug?: string
          modul_slug?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      classroom_assignments: {
        Row: {
          author_id: string
          classroom_id: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          author_id: string
          classroom_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          author_id?: string
          classroom_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_assignments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_members: {
        Row: {
          classroom_id: string
          joined_at: string
          role: Database["public"]["Enums"]["classroom_role"]
          user_id: string
          xp_in_class: number
        }
        Insert: {
          classroom_id: string
          joined_at?: string
          role?: Database["public"]["Enums"]["classroom_role"]
          user_id: string
          xp_in_class?: number
        }
        Update: {
          classroom_id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["classroom_role"]
          user_id?: string
          xp_in_class?: number
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_messages: {
        Row: {
          author_id: string
          channel: string
          classroom_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          channel?: string
          classroom_id: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          channel?: string
          classroom_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_messages_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_posts: {
        Row: {
          attachment_url: string | null
          author_id: string
          body: string | null
          classroom_id: string
          created_at: string
          id: string
          kind: string
          title: string
        }
        Insert: {
          attachment_url?: string | null
          author_id: string
          body?: string | null
          classroom_id: string
          created_at?: string
          id?: string
          kind?: string
          title: string
        }
        Update: {
          attachment_url?: string | null
          author_id?: string
          body?: string | null
          classroom_id?: string
          created_at?: string
          id?: string
          kind?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_posts_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          classroom_code: string
          cover_gradient: string
          created_at: string
          description: string | null
          id: string
          is_demo: boolean
          name: string
          owner_id: string
          subject: string | null
        }
        Insert: {
          classroom_code?: string
          cover_gradient?: string
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name: string
          owner_id: string
          subject?: string | null
        }
        Update: {
          classroom_code?: string
          cover_gradient?: string
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          owner_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      creator_class_chapters: {
        Row: {
          bab_index: number
          class_id: string
          duration_min: number
          id: string
          is_free_preview: boolean
          title: string
        }
        Insert: {
          bab_index: number
          class_id: string
          duration_min?: number
          id?: string
          is_free_preview?: boolean
          title: string
        }
        Update: {
          bab_index?: number
          class_id?: string
          duration_min?: number
          id?: string
          is_free_preview?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_class_chapters_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "creator_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_class_purchases: {
        Row: {
          class_id: string
          id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          class_id: string
          id?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          class_id?: string
          id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_class_purchases_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "creator_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_classes: {
        Row: {
          cover_gradient: string
          created_at: string
          creator_id: string
          description: string
          id: string
          is_published: boolean
          jenjang: string | null
          jurusan: string | null
          mapel: string | null
          price_idr: number
          rating: number
          students_count: number
          tier: Database["public"]["Enums"]["class_tier"]
          title: string
        }
        Insert: {
          cover_gradient?: string
          created_at?: string
          creator_id: string
          description: string
          id?: string
          is_published?: boolean
          jenjang?: string | null
          jurusan?: string | null
          mapel?: string | null
          price_idr?: number
          rating?: number
          students_count?: number
          tier?: Database["public"]["Enums"]["class_tier"]
          title: string
        }
        Update: {
          cover_gradient?: string
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          is_published?: boolean
          jenjang?: string | null
          jurusan?: string | null
          mapel?: string | null
          price_idr?: number
          rating?: number
          students_count?: number
          tier?: Database["public"]["Enums"]["class_tier"]
          title?: string
        }
        Relationships: []
      }
      parent_child_links: {
        Row: {
          child_id: string
          created_at: string
          id: string
          parent_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
        }
        Relationships: []
      }
      personal_notes: {
        Row: {
          bab_index: number
          content: string
          created_at: string
          id: string
          mapel_slug: string
          modul_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bab_index: number
          content?: string
          created_at?: string
          id?: string
          mapel_slug: string
          modul_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bab_index?: number
          content?: string
          created_at?: string
          id?: string
          mapel_slug?: string
          modul_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agama: Database["public"]["Enums"]["agama_type"] | null
          bidang: string | null
          created_at: string
          display_name: string | null
          fakultas: string | null
          id: string
          institusi: string | null
          jenjang: Database["public"]["Enums"]["jenjang_level"] | null
          jenjang_anak: Database["public"]["Enums"]["jenjang_level"] | null
          jurusan: string | null
          kelas: string | null
          nama_anak: string | null
          pengalaman: string | null
          primary_role: Database["public"]["Enums"]["app_role"]
          student_invite_code: string | null
          tujuan_belajar: string | null
          updated_at: string
        }
        Insert: {
          agama?: Database["public"]["Enums"]["agama_type"] | null
          bidang?: string | null
          created_at?: string
          display_name?: string | null
          fakultas?: string | null
          id: string
          institusi?: string | null
          jenjang?: Database["public"]["Enums"]["jenjang_level"] | null
          jenjang_anak?: Database["public"]["Enums"]["jenjang_level"] | null
          jurusan?: string | null
          kelas?: string | null
          nama_anak?: string | null
          pengalaman?: string | null
          primary_role?: Database["public"]["Enums"]["app_role"]
          student_invite_code?: string | null
          tujuan_belajar?: string | null
          updated_at?: string
        }
        Update: {
          agama?: Database["public"]["Enums"]["agama_type"] | null
          bidang?: string | null
          created_at?: string
          display_name?: string | null
          fakultas?: string | null
          id?: string
          institusi?: string | null
          jenjang?: Database["public"]["Enums"]["jenjang_level"] | null
          jenjang_anak?: Database["public"]["Enums"]["jenjang_level"] | null
          jurusan?: string | null
          kelas?: string | null
          nama_anak?: string | null
          pengalaman?: string | null
          primary_role?: Database["public"]["Enums"]["app_role"]
          student_invite_code?: string | null
          tujuan_belajar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progression: {
        Row: {
          created_at: string
          last_active_at: string | null
          level: number
          rank: string
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          last_active_at?: string | null
          level?: number
          rank?: string
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          last_active_at?: string | null
          level?: number
          rank?: string
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          plan: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          current_period_end?: string | null
          plan?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          current_period_end?: string | null
          plan?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string
          gross_amount: number
          id: string
          order_id: string
          payment_type: string | null
          raw_response: Json | null
          snap_redirect_url: string | null
          snap_token: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          target_id: string | null
          target_kind: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gross_amount: number
          id?: string
          order_id: string
          payment_type?: string | null
          raw_response?: Json | null
          snap_redirect_url?: string | null
          snap_token?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          target_id?: string | null
          target_kind: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gross_amount?: number
          id?: string
          order_id?: string
          payment_type?: string | null
          raw_response?: Json | null
          snap_redirect_url?: string | null
          snap_token?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          target_id?: string | null
          target_kind?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_classroom_code: { Args: never; Returns: string }
      generate_student_invite_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_classroom_member: {
        Args: { _classroom: string; _user: string }
        Returns: boolean
      }
      is_classroom_owner: {
        Args: { _classroom: string; _user: string }
        Returns: boolean
      }
      join_classroom_by_code: { Args: { _code: string }; Returns: string }
      link_child_by_code: { Args: { _code: string }; Returns: string }
    }
    Enums: {
      agama_type:
        | "islam"
        | "kristen"
        | "katolik"
        | "hindu"
        | "buddha"
        | "konghucu"
      app_role: "siswa" | "creator" | "parent" | "guru"
      class_tier: "free" | "premium"
      classroom_role: "teacher" | "student"
      jenjang_level: "sd" | "smp" | "sma" | "smk" | "utbk"
      subscription_status: "inactive" | "active" | "expired" | "cancelled"
      transaction_status:
        | "pending"
        | "success"
        | "failed"
        | "expired"
        | "cancelled"
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
      agama_type: [
        "islam",
        "kristen",
        "katolik",
        "hindu",
        "buddha",
        "konghucu",
      ],
      app_role: ["siswa", "creator", "parent", "guru"],
      class_tier: ["free", "premium"],
      classroom_role: ["teacher", "student"],
      jenjang_level: ["sd", "smp", "sma", "smk", "utbk"],
      subscription_status: ["inactive", "active", "expired", "cancelled"],
      transaction_status: [
        "pending",
        "success",
        "failed",
        "expired",
        "cancelled",
      ],
    },
  },
} as const
