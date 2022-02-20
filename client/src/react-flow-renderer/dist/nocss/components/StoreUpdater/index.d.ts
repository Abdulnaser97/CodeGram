import { Node, Edge, OnConnectFunc, OnConnectStartFunc, OnConnectStopFunc, OnConnectEndFunc, NodeExtent, OnNodesChange, OnEdgesChange, ConnectionMode, SnapGrid, TranslateExtent } from '../../types';
interface StoreUpdaterProps {
    nodes: Node[];
    edges: Edge[];
    onConnect?: OnConnectFunc;
    onConnectStart?: OnConnectStartFunc;
    onConnectStop?: OnConnectStopFunc;
    onConnectEnd?: OnConnectEndFunc;
    nodesDraggable?: boolean;
    nodesConnectable?: boolean;
    minZoom?: number;
    maxZoom?: number;
    nodeExtent?: NodeExtent;
    onNodesChange?: OnNodesChange;
    onEdgesChange?: OnEdgesChange;
    elementsSelectable?: boolean;
    connectionMode?: ConnectionMode;
    snapToGrid?: boolean;
    snapGrid?: SnapGrid;
    translateExtent?: TranslateExtent;
}
declare const StoreUpdater: ({ nodes, edges, onConnect, onConnectStart, onConnectStop, onConnectEnd, nodesDraggable, nodesConnectable, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, }: StoreUpdaterProps) => null;
export default StoreUpdater;
