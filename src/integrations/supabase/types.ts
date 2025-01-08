export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carros: {
        Row: {
          ano: number | null
          id: number
          marca: string | null
          modelo: string | null
          motor: string | null
          opcionais: string | null
          valor_venda: number | null
        }
        Insert: {
          ano?: number | null
          id?: number
          marca?: string | null
          modelo?: string | null
          motor?: string | null
          opcionais?: string | null
          valor_venda?: number | null
        }
        Update: {
          ano?: number | null
          id?: number
          marca?: string | null
          modelo?: string | null
          motor?: string | null
          opcionais?: string | null
          valor_venda?: number | null
        }
        Relationships: []
      }
      corretores: {
        Row: {
          criado_em: string | null
          participant: string
          pushname: string | null
          remotejid: string | null
          size: number | null
          subject: string | null
        }
        Insert: {
          criado_em?: string | null
          participant: string
          pushname?: string | null
          remotejid?: string | null
          size?: number | null
          subject?: string | null
        }
        Update: {
          criado_em?: string | null
          participant?: string
          pushname?: string | null
          remotejid?: string | null
          size?: number | null
          subject?: string | null
        }
        Relationships: []
      }
      disparos: {
        Row: {
          disparoEm: string | null
          enviado: string | null
          grupoId: string | null
          id: number
          size: number | null
          subject: string | null
          tabelaGoogle: string | null
        }
        Insert: {
          disparoEm?: string | null
          enviado?: string | null
          grupoId?: string | null
          id?: number
          size?: number | null
          subject?: string | null
          tabelaGoogle?: string | null
        }
        Update: {
          disparoEm?: string | null
          enviado?: string | null
          grupoId?: string | null
          id?: number
          size?: number | null
          subject?: string | null
          tabelaGoogle?: string | null
        }
        Relationships: []
      }
      grupos: {
        Row: {
          bairro: string | null
          celularCorretor: string | null
          dataHora: string | null
          empreendimento: string | null
          id: number
          mensagemCorretor: string | null
          messageHash: string | null
          nomeCorretor: string | null
          nomeGrupo: string | null
          status: string | null
          valorImovel: string | null
        }
        Insert: {
          bairro?: string | null
          celularCorretor?: string | null
          dataHora?: string | null
          empreendimento?: string | null
          id?: number
          mensagemCorretor?: string | null
          messageHash?: string | null
          nomeCorretor?: string | null
          nomeGrupo?: string | null
          status?: string | null
          valorImovel?: string | null
        }
        Update: {
          bairro?: string | null
          celularCorretor?: string | null
          dataHora?: string | null
          empreendimento?: string | null
          id?: number
          mensagemCorretor?: string | null
          messageHash?: string | null
          nomeCorretor?: string | null
          nomeGrupo?: string | null
          status?: string | null
          valorImovel?: string | null
        }
        Relationships: []
      }
      grupos_corretores: {
        Row: {
          criado_em: string | null
          remotejid: string
          size: number | null
          subject: string | null
        }
        Insert: {
          criado_em?: string | null
          remotejid: string
          size?: number | null
          subject?: string | null
        }
        Update: {
          criado_em?: string | null
          remotejid?: string
          size?: number | null
          subject?: string | null
        }
        Relationships: []
      }
      login_corretores: {
        Row: {
          apikey: string | null
          id: number
          instance: string | null
          senha: string | null
          usuario: string | null
        }
        Insert: {
          apikey?: string | null
          id?: number
          instance?: string | null
          senha?: string | null
          usuario?: string | null
        }
        Update: {
          apikey?: string | null
          id?: number
          instance?: string | null
          senha?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
      ofertas: {
        Row: {
          combinedText: string | null
          dataHora: string | null
          id: number
          idMessage: string | null
          mediaUrl: string | null
          messageHash: string | null
          participant: string | null
          pushName: string | null
          remoteJid: string | null
        }
        Insert: {
          combinedText?: string | null
          dataHora?: string | null
          id?: number
          idMessage?: string | null
          mediaUrl?: string | null
          messageHash?: string | null
          participant?: string | null
          pushName?: string | null
          remoteJid?: string | null
        }
        Update: {
          combinedText?: string | null
          dataHora?: string | null
          id?: number
          idMessage?: string | null
          mediaUrl?: string | null
          messageHash?: string | null
          participant?: string | null
          pushName?: string | null
          remoteJid?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string
          id: number
          status: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          status: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          status?: boolean
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          id: number
          thread_id: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          thread_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          thread_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente: string | null
          id: number
          produto: string | null
          qtd: number | null
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          cliente?: string | null
          id?: number
          produto?: string | null
          qtd?: number | null
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          cliente?: string | null
          id?: number
          produto?: string | null
          qtd?: number | null
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: []
      }
      zoeweb: {
        Row: {
          contactid: number | null
          Email: string | null
          id: number
          mobile_phone: string | null
          Nome: string | null
          number: string | null
          primeiroNome: string | null
          ticketid: number | null
          uuid: string | null
        }
        Insert: {
          contactid?: number | null
          Email?: string | null
          id?: number
          mobile_phone?: string | null
          Nome?: string | null
          number?: string | null
          primeiroNome?: string | null
          ticketid?: number | null
          uuid?: string | null
        }
        Update: {
          contactid?: number | null
          Email?: string | null
          id?: number
          mobile_phone?: string | null
          Nome?: string | null
          number?: string | null
          primeiroNome?: string | null
          ticketid?: number | null
          uuid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never