export function validateDecisionGraph(graph) {
  if (!graph?.id || !graph?.start || !Array.isArray(graph.nodes) || !Array.isArray(graph.resultIds)) {
    throw new TypeError("Decision graph is missing its id, start node, nodes or result ids");
  }

  const nodes = new Map();
  for (const node of graph.nodes) {
    if (!node.id || nodes.has(node.id)) throw new Error(`Duplicate or missing node id in ${graph.id}`);
    if (!Array.isArray(node.options) || node.options.length === 0) {
      throw new Error(`Node ${node.id} has no options`);
    }
    const optionIds = new Set();
    for (const option of node.options) {
      if (!option.id || optionIds.has(option.id)) {
        throw new Error(`Node ${node.id} has a duplicate or missing option id`);
      }
      if (!option.next) throw new Error(`Option ${node.id}.${option.id} has no next destination`);
      optionIds.add(option.id);
    }
    nodes.set(node.id, node);
  }

  if (!nodes.has(graph.start)) throw new Error(`Start node ${graph.start} does not exist`);
  const results = new Set(graph.resultIds);
  for (const node of graph.nodes) {
    for (const option of node.options) {
      if (!nodes.has(option.next) && !results.has(option.next)) {
        throw new Error(`Option ${node.id}.${option.id} points to missing destination ${option.next}`);
      }
    }
  }

  const visited = new Set();
  const active = new Set();
  function visit(id) {
    if (results.has(id)) return;
    if (active.has(id)) throw new Error(`Loop detected at ${id}`);
    if (visited.has(id)) return;
    active.add(id);
    for (const option of nodes.get(id).options) visit(option.next);
    active.delete(id);
    visited.add(id);
  }
  visit(graph.start);

  const unreachable = graph.nodes.filter((node) => !visited.has(node.id));
  if (unreachable.length > 0) {
    throw new Error(`Unreachable nodes: ${unreachable.map((node) => node.id).join(", ")}`);
  }
  return true;
}
