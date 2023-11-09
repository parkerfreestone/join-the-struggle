export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_status: {
        Row: {
          id: string;
          stillgoing: boolean | null;
        };
        Insert: {
          id: string;
          stillgoing?: boolean | null;
        };
        Update: {
          id?: string;
          stillgoing?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_status_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
