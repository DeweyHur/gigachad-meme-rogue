import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '@/constants/colors';
import { NodeType } from '@/types/game';

type MapNodeProps = {
  node: NodeType;
  onPress: (nodeId: string) => void;
  connections: string[];
};

export default function MapNode({ node, onPress, connections }: MapNodeProps) {
  const { id, type, visited, available } = node;
  
  const getNodeColor = () => {
    if (visited) return COLORS.success;
    if (!available) return COLORS.nodeDefault;
    
    switch (type) {
      case 'battle': return COLORS.nodeBattle;
      case 'shop': return COLORS.nodeShop;
      case 'event': return COLORS.nodeEvent;
      case 'camp': return COLORS.nodeCamp;
      case 'shrine': return COLORS.nodeShrine;
      case 'blacksmith': return COLORS.nodeBlacksmith;
      case 'boss': return COLORS.nodeBoss;
      case 'start': return COLORS.success;
      default: return COLORS.nodeDefault;
    }
  };
  
  const getNodeIcon = () => {
    switch (type) {
      case 'battle': return '⚔️';
      case 'shop': return '🛒';
      case 'event': return '❓';
      case 'camp': return '🏕️';
      case 'shrine': return '🔮';
      case 'blacksmith': return '⚒️';
      case 'boss': return '👑';
      case 'start': return '🏠';
      default: return '•';
    }
  };
  
  return (
    <View style={styles.nodeContainer}>
      <Pressable
        style={[
          styles.node,
          { backgroundColor: getNodeColor() },
          visited && styles.visitedNode,
          !available && styles.unavailableNode,
        ]}
        onPress={() => available && onPress(id)}
        disabled={!available}
      >
        <Text style={styles.nodeIcon}>{getNodeIcon()}</Text>
      </Pressable>
      {connections.map((targetId) => (
        <View 
          key={`${id}-${targetId}`} 
          style={[
            styles.connection,
            visited && styles.visitedConnection,
            !available && styles.unavailableConnection,
          ]} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nodeContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  node: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  nodeIcon: {
    fontSize: 18,
  },
  visitedNode: {
    borderColor: COLORS.success,
    borderWidth: 3,
  },
  unavailableNode: {
    opacity: 0.5,
  },
  connection: {
    position: 'absolute',
    width: 4,
    height: 30,
    backgroundColor: COLORS.nodeDefault,
    top: 50,
    zIndex: -1,
  },
  visitedConnection: {
    backgroundColor: COLORS.success,
  },
  unavailableConnection: {
    opacity: 0.5,
  },
});