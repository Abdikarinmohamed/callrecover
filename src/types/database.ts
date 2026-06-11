export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          owner_id: string | null;
          business_name: string;
          contact_email: string | null;
          phone_number: string | null;
          timezone: string | null;
          auto_reply_message: string | null;
          booking_link: string | null;
          auto_text_enabled: boolean | null;
          twilio_connected: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          business_name: string;
          contact_email?: string | null;
          phone_number?: string | null;
          timezone?: string | null;
          auto_reply_message?: string | null;
          booking_link?: string | null;
          auto_text_enabled?: boolean | null;
          twilio_connected?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          business_name?: string;
          contact_email?: string | null;
          phone_number?: string | null;
          timezone?: string | null;
          auto_reply_message?: string | null;
          booking_link?: string | null;
          auto_text_enabled?: boolean | null;
          twilio_connected?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      twilio_settings: {
        Row: {
          id: string;
          business_id: string;
          account_sid: string;
          auth_token: string;
          phone_number: string;
          is_connected: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          account_sid: string;
          auth_token: string;
          phone_number: string;
          is_connected?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          account_sid?: string;
          auth_token?: string;
          phone_number?: string;
          is_connected?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "twilio_settings_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: true;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_messages: {
        Row: {
          id: string;
          lead_id: string;
          sender: string;
          body: string;
          twilio_message_sid: string | null;
          direction: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          lead_id: string;
          sender: string;
          body: string;
          twilio_message_sid?: string | null;
          direction?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          lead_id?: string;
          sender?: string;
          body?: string;
          twilio_message_sid?: string | null;
          direction?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_messages_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          business_id: string;
          customer_phone: string;
          customer_name: string | null;
          status: string;
          source: string;
          twilio_call_sid: string | null;
          missed_call_at: string | null;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_phone: string;
          customer_name?: string | null;
          status?: string;
          source?: string;
          twilio_call_sid?: string | null;
          missed_call_at?: string | null;
          last_message?: string | null;
          last_message_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          customer_phone?: string;
          customer_name?: string | null;
          status?: string;
          source?: string;
          twilio_call_sid?: string | null;
          missed_call_at?: string | null;
          last_message?: string | null;
          last_message_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
