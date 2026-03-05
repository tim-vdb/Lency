import { MapLocationsAction } from "../repositories/mapLocations.action";

export const MapLocationsService = {
  findByIdMapLocation: async (id: string) => {
    return MapLocationsAction.findById(id);
  },

  findAllMapLocations: async () => {
    return MapLocationsAction.findAll();
  },

  createMapLocation: async (data: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
  }) => {
    return MapLocationsAction.create(data);
  },

  updateMapLocation: async (
    id: string,
    data: {
      name?: string;
      latitude?: number;
      longitude?: number;
      description?: string | null;
    }
  ) => {
    return MapLocationsAction.update(id, data);
  },

  deleteMapLocation: async (id: string) => {
    return MapLocationsAction.delete(id);
  },
};