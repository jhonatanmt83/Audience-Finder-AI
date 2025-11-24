
export interface StateInfo {
  name: string;
  abbreviation: string;
}

export interface ShowLocation {
  latitude: number;
  longitude: number;
}

export interface AudienceResponse {
  primaryState: StateInfo;
  nearbyStates: StateInfo[];
  showLocation: ShowLocation;
}
