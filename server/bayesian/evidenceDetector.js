import { misconceptionGraph } from './misconceptionGraph.js';

const VALID_EVIDENCE_TYPES = [
  'supports',
  'challenges',
  'strong_support',
  'strong_challenge',
  'uncertain',
];

export function getEvidenceDetectionContext() {
  return misconceptionGraph.nodes
    .filter(node => node.cluster !== 'I')
    .map(node => ({
      id: node.id,
      cluster: node.cluster,
      label: node.label,
      description: node.description,
    }));
}

export function validateEvidenceResult(result) {
  if (!result || typeof result !== 'object') {
    return false;
  }

  const nodeExists =
  result.evidenceType === 'uncertain'
    ? result.nodeId === null
    : misconceptionGraph.nodes.some(
        node => node.id === result.nodeId
      );

  const evidenceTypeValid =
    VALID_EVIDENCE_TYPES.includes(
      result.evidenceType
    );

  const confidenceValid =
    typeof result.confidence === 'number' &&
    result.confidence >= 0 &&
    result.confidence <= 1;

  return (
    nodeExists &&
    evidenceTypeValid &&
    confidenceValid
  );
}

export function createNoEvidenceResult() {
  return {
    nodeId: null,
    evidenceType: 'uncertain',
    confidence: 0,
  };
}