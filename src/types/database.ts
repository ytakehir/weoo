export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4'
  }
  public: {
    Tables: {
      area_missions: {
        Row: {
          created_at: string
          id: string
          publish_end_at: string
          publish_start_at: string
          region: Database['public']['Enums']['area_region']
          title: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          publish_end_at: string
          publish_start_at: string
          region: Database['public']['Enums']['area_region']
          title: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          publish_end_at?: string
          publish_start_at?: string
          region?: Database['public']['Enums']['area_region']
          title?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      mission_submissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          id: string
          migrated_mission_id: string | null
          notes: string | null
          status: string
          title_display: string | null
          title_raw: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          migrated_mission_id?: string | null
          notes?: string | null
          status?: string
          title_display?: string | null
          title_raw: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          migrated_mission_id?: string | null
          notes?: string | null
          status?: string
          title_display?: string | null
          title_raw?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'mission_submissions_approved_by_fkey'
            columns: ['approved_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'mission_submissions_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'mission_submissions_migrated_mission_id_fkey'
            columns: ['migrated_mission_id']
            isOneToOne: false
            referencedRelation: 'missions'
            referencedColumns: ['id']
          }
        ]
      }
      missions: {
        Row: {
          created_at: string
          id: string
          kind: Database['public']['Enums']['mission_kind']
          publish_end_at: string | null
          publish_start_at: string | null
          region: Database['public']['Enums']['region_jp'] | null
          title: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: Database['public']['Enums']['mission_kind']
          publish_end_at?: string | null
          publish_start_at?: string | null
          region?: Database['public']['Enums']['region_jp'] | null
          title: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database['public']['Enums']['mission_kind']
          publish_end_at?: string | null
          publish_start_at?: string | null
          region?: Database['public']['Enums']['region_jp'] | null
          title?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_public: boolean | null
          mission_id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_public?: boolean | null
          mission_id: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_public?: boolean | null
          mission_id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_mission_fk'
            columns: ['mission_id']
            isOneToOne: false
            referencedRelation: 'missions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'posts_profile_fk'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          free_trial_end: string | null
          id: string
          stripe_customer_id: string | null
          ticket: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          free_trial_end?: string | null
          id: string
          stripe_customer_id?: string | null
          ticket?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          free_trial_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          ticket?: number
          updated_at?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reactions_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reactions_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      seasons_missions: {
        Row: {
          created_at: string
          id: string
          publish_end_at: string
          publish_start_at: string
          title: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          publish_end_at: string
          publish_start_at: string
          title: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          publish_end_at?: string
          publish_start_at?: string
          title?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          customer_id: string
          id: string
          price_id: string
          profile_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          customer_id: string
          id: string
          price_id: string
          profile_id?: string | null
          status: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          customer_id?: string
          id?: string
          price_id?: string
          profile_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subs_profile_fk'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_paid_or_trial: {
        Args: { uid: string }
        Returns: boolean
      }
      consume_one_ticket: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_access: {
        Args: { uid: string }
        Returns: boolean
      }
      has_active_subscription: {
        Args: { uid: string }
        Returns: boolean
      }
      is_on_free_trial: {
        Args: { uid: string }
        Returns: boolean
      }
      normalize_newlines: {
        Args: { src: string }
        Returns: string
      }
      pick_mission: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          kind: Database['public']['Enums']['mission_kind']
          publish_end_at: string | null
          publish_start_at: string | null
          region: Database['public']['Enums']['region_jp'] | null
          title: string
          updated_at: string
          used_at: string | null
        }
      }
      pick_today_mission_jst: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          kind: Database['public']['Enums']['mission_kind']
          publish_end_at: string | null
          publish_start_at: string | null
          region: Database['public']['Enums']['region_jp'] | null
          title: string
          updated_at: string
          used_at: string | null
        }
      }
      posts_count_by_mission: {
        Args: { post_mission_id: string }
        Returns: number
      }
      posts_count_total: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      topup_event_tickets: {
        Args: { inc: number }
        Returns: undefined
      }
      topup_weekly_tickets: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      area_region: 'hokkaido' | 'tohoku' | 'kanto' | 'chubu' | 'kansai' | 'chugoku' | 'shikoku' | 'kyushu_okinawa'
      mission_kind: 'daily' | 'season' | 'area'
      region_jp: 'hokkaido' | 'tohoku' | 'kanto' | 'chubu' | 'kansai' | 'chugoku' | 'shikoku' | 'kyushu_okinawa'
      status: 'pending' | 'approved' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_region: ['hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai', 'chugoku', 'shikoku', 'kyushu_okinawa'],
      mission_kind: ['daily', 'season', 'area'],
      region_jp: ['hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai', 'chugoku', 'shikoku', 'kyushu_okinawa'],
      status: ['pending', 'approved', 'rejected']
    }
  }
} as const
