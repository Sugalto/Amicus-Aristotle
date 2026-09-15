import { misconceptionGraph, getNodeById } from './misconceptionGraph.js';

const VALID_STATES = [
  'dormant',
  'activated',
  'pressured',
  'inhibited',
];

export function createConversationState() {
  const nodeStates = {};

  for (const node of misconceptionGraph.nodes) {
    nodeStates[node.id] = {
      state: 'dormant',
      visitCount: 0,
      evidenceCount: 0,
      beliefProbability: 0.5,
    };
  }

  return {
    activeNode: 'M1.00',
    nodeStates,
    turnCount: 0,
    activeCluster: 'M1',
    clusterStreak: 0,
  };
}

export function activateNode(conversationState, nodeId) {
  const node = getNodeById(nodeId);

  if (!node) {
    throw new Error(`Unknown misconception node: ${nodeId}`);
  }

  const nodeState = conversationState.nodeStates[nodeId];

  if (nodeState.state === 'dormant') {
    nodeState.state = 'activated';
  }

  nodeState.visitCount += 1;

  if (conversationState.activeCluster === node.cluster) {
    conversationState.clusterStreak += 1;
  } else {
    conversationState.activeCluster = node.cluster;
    conversationState.clusterStreak = 1;
  }

  conversationState.activeNode = nodeId;

  return conversationState;
}

export function setNodeState(conversationState, nodeId, newState) {
  if (!VALID_STATES.includes(newState)) {
    throw new Error(`Invalid misconception state: ${newState}`);
  }

  if (!conversationState.nodeStates[nodeId]) {
    throw new Error(`Unknown misconception node: ${nodeId}`);
  }

  conversationState.nodeStates[nodeId].state = newState;

  return conversationState;
}

export function addEvidence(conversationState, nodeId) {
  if (!conversationState.nodeStates[nodeId]) {
    throw new Error(`Unknown misconception node: ${nodeId}`);
  }

  conversationState.nodeStates[nodeId].evidenceCount += 1;

  return conversationState;
}

export function advanceTurn(conversationState) {
  conversationState.turnCount += 1;
  return conversationState;
}

export function getNodeState(conversationState, nodeId) {
  return conversationState.nodeStates[nodeId];
}

export function getIntegrationCoverage(
  conversationState
) {
  const requiredNodes = [
    'I.00',
    'I.01',
    'I.02',
  ];

  const coveredNodes =
    requiredNodes.filter(nodeId => {
      const nodeState =
        conversationState.nodeStates[nodeId];

      return (
        nodeState &&
        (
          nodeState.visitCount > 0 ||
          nodeState.evidenceCount > 0
        )
      );
    });

  return {
    requiredNodes,
    coveredNodes,
    remainingNodes:
      requiredNodes.filter(
        nodeId =>
          !coveredNodes.includes(nodeId)
      ),
    complete:
      coveredNodes.length ===
      requiredNodes.length,
  };
}

export function canEndConversation(
  conversationState
) {
  return getIntegrationCoverage(
    conversationState
  ).complete;
}