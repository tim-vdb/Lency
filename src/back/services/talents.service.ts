import { TalentsAction } from "../repositories/talents.action";

export const TalentsService = {
    findAll: async () => TalentsAction.findAll(),
};
