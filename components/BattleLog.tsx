import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { COLORS } from '@/constants/colors';
import { BattleLogEntryType } from '@/types/game';

type BattleLogProps = {
  entries: BattleLogEntryType[];
};

export default function BattleLog({ entries }: BattleLogProps) {
  const [expanded, setExpanded] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollViewRef.current && expanded) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [entries, expanded]);
  
  const getEntryColor = (entry: BattleLogEntryType) => {
    switch (entry.type) {
      case 'damage':
        return entry.source === 'player' ? COLORS.danger : COLORS.warning;
      case 'block':
        return COLORS.info;
      case 'heal':
        return COLORS.success;
      case 'effect':
        return COLORS.secondary;
      case 'card':
        return COLORS.primary;
      default:
        return COLORS.text;
    }
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Show only the last 3 entries when collapsed
  const displayedEntries = expanded ? entries : entries.slice(-3);
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={toggleExpanded}>
        <Text style={styles.title}>Battle Log</Text>
        <Text style={styles.expandText}>{expanded ? 'Collapse' : 'Expand'}</Text>
      </Pressable>
      
      <View style={[styles.logContainer, expanded && styles.expandedLog]}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {displayedEntries.map((entry) => (
            <Text 
              key={entry.id} 
              style={[styles.logEntry, { color: getEntryColor(entry) }]}
            >
              {entry.message}
            </Text>
          ))}
          
          {!expanded && entries.length > 3 && (
            <Text style={styles.moreEntriesText}>
              {entries.length - 3} more entries...
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  logContainer: {
    maxHeight: 100,
  },
  expandedLog: {
    maxHeight: 250,
  },
  scrollView: {
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 5,
  },
  logEntry: {
    fontSize: 14,
    marginBottom: 5,
  },
  moreEntriesText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
});