import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MapNode from './MapNode';
import { NodeType, PathType } from '@/types/game';

type GameMapProps = {
  path: PathType;
  onNodePress: (nodeId: string) => void;
};

export default function GameMap({ path, onNodePress }: GameMapProps) {
  const { nodes } = path;
  
  // Group nodes by y-coordinate (row)
  const nodesByRow: { [key: number]: NodeType[] } = {};
  nodes.forEach(node => {
    if (!nodesByRow[node.y]) {
      nodesByRow[node.y] = [];
    }
    nodesByRow[node.y].push(node);
  });
  
  // Sort rows by y-coordinate
  const sortedRows = Object.keys(nodesByRow)
    .map(Number)
    .sort((a, b) => a - b);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sortedRows.map(rowY => (
        <View key={`row-${rowY}`} style={styles.row}>
          {nodesByRow[rowY]
            .sort((a, b) => a.x - b.x)
            .map(node => {
              // Find connections from this node to nodes in the next row
              const connections = nodes
                .filter(targetNode => node.connections.includes(targetNode.id))
                .map(targetNode => targetNode.id);
              
              return (
                <MapNode
                  key={node.id}
                  node={node}
                  onPress={onNodePress}
                  connections={connections}
                />
              );
            })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});