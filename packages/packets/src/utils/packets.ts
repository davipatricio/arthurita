export namespace Protocol {
  export const Handshaking = {
    Serverbound: {
      Handshake: {
        Id: 0x00,
        Resource: 'intention'
      },
      LegacyServerListPing: {
        Id: 0xfe
      }
    }
  };

  export const Status = {
    Clientbound: {
      StatusResponse: {
        Id: 0x00,
        Resource: 'status_response'
      },
      PongResponse: {
        Id: 0x01,
        Resource: 'pong_response'
      }
    },
    Serverbound: {
      StatusRequest: {
        Id: 0x00,
        Resource: 'status_request'
      },
      PingRequest: {
        Id: 0x01,
        Resource: 'ping_request'
      }
    }
  };

  export const Login = {
    Clientbound: {
      Disconnect: {
        Id: 0x00,
        Resource: 'login_disconnect'
      },
      EncryptionRequest: {
        Id: 0x01,
        Resource: 'hello'
      },
      LoginSuccess: {
        Id: 0x02,
        Resource: 'game_profile'
      },
      SetCompression: {
        Id: 0x03,
        Resource: 'set_compression'
      },
      PluginRequest: {
        Id: 0x04,
        Resource: 'custom_query'
      },
      CookieRequest: {
        Id: 0x05,
        Resource: 'cookie_request'
      }
    },
    Serverbound: {
      LoginStart: {
        Id: 0x00,
        Resource: 'hello'
      },
      EncryptionResponse: {
        Id: 0x01,
        Resource: 'key'
      },
      PluginResponse: {
        Id: 0x02,
        Resource: 'custom_query_answer'
      },
      LoginAcknowledge: {
        Id: 0x03,
        Resource: 'login_acknowledged'
      },
      CookieResponse: {
        Id: 0x04,
        Resource: 'cookie_response'
      }
    }
  };

  export const Configuration = {
    Clientbound: {
      CookieRequest: {
        Id: 0x00,
        Resource: 'cookie_request'
      },
      PluginMessage: {
        Id: 0x01,
        Resource: 'custom_payload'
      },
      Disconnect: {
        Id: 0x02,
        Resource: 'disconnect'
      },
      FinishConfiguration: {
        Id: 0x03,
        Resource: 'finish_configuration'
      },
      KeepAlive: {
        Id: 0x04,
        Resource: 'keep_alive'
      },
      Ping: {
        Id: 0x05,
        Resource: 'ping'
      },
      ResetChat: {
        Id: 0x06,
        Resource: 'reset_chat'
      },
      RegistryData: {
        Id: 0x07,
        Resource: 'registry_data'
      },
      RemoveResourcePack: {
        Id: 0x08,
        Resource: 'resource_pack_pop'
      },
      AddResourcePack: {
        Id: 0x09,
        Resource: 'resource_pack_push'
      },
      StoreCookie: {
        Id: 0x0a,
        Resource: 'store_cookie'
      },
      Transfer: {
        Id: 0x0b,
        Resource: 'transfer'
      },
      FeatureFlags: {
        Id: 0x0c,
        Resource: 'feature_flags'
      },
      UpdateTags: {
        Id: 0x0d,
        Resource: 'update_tags'
      },
      KnownPacks: {
        Id: 0x0e,
        Resource: 'select_known_packs'
      },
      CustomReportDetails: {
        Id: 0x0f,
        Resource: 'custom_report_details'
      },
      ServerLinks: {
        Id: 0x10,
        Resource: 'server_links'
      }
    },
    Serverbound: {
      ClientInformation: {
        Id: 0x00,
        Resource: 'client_information'
      },
      CookieResponse: {
        Id: 0x01,
        Resource: 'cookie_response'
      },
      PluginMessage: {
        Id: 0x02,
        Resource: 'custom_payload'
      },
      AcknowledgeFinishConfiguration: {
        Id: 0x03,
        Resource: 'finish_configuration'
      },
      KeepAlive: {
        Id: 0x04,
        Resource: 'keep_alive'
      },
      Pong: {
        Id: 0x05,
        Resource: 'pong'
      },
      ResourcePackResponse: {
        Id: 0x06,
        Resource: 'resource_pack_response'
      },
      KnownPacks: {
        Id: 0x07,
        Resource: 'select_known_packs'
      }
    }
  };

  export const Play = {
    Clientbound: {
      Disconnect: {
        Id: 0x1d,
        Resource: 'disconnect'
      },
      Login: {
        Id: 0x2c,
        Resource: 'login'
      },
      SynchronizePlayerPosition: {
        Id: 0x42,
        Resource: 'player_position'
      }
    }
  };
}
