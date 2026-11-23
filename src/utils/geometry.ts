import type { NodeData } from "../types/node";
import { NODE_WIDTH, NODE_HEIGHT } from "../constants/editor";

export const getNodeCenter = (n: NodeData) =>  ({
    x: n.PositionX + NODE_WIDTH / 2,
    y: n.PositionY + NODE_HEIGHT / 2
});