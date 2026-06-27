import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { clearCookie, readEncryptedCookie, writeEncryptedCookie } from '../storage/encryptedCookie.js';
import { automaticThoughtRecord, emotionWheelGroups, emptyThoughtRecord } from './automaticThoughtRecord.js';

const cookieName = 'steadyStepsAutomaticThoughtRecord.v1';
const exampleEmotions = ['Angry', 'Sad', 'Anxious', 'Ashamed', 'Guilty', 'Lonely', 'Hurt', 'Afraid', 'Disappointed', 'Jealous', 'Frustrated', 'Overwhelmed', 'Hopeful', 'Calm', 'Proud', 'Grateful'];
const blankLine = '________________________________________________________________________________________________';

const answerText = (value, fallback = blankLine) => String(value ?? '').trim() || fallback;
const toTen = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return '';
  return String(Math.min(10, Math.max(0, Math.round(number > 10 ? number / 10 : number))));
};

export default function AutomaticThoughtRecord() {
  const [record, setRecord] = useState(emptyThoughtRecord);
  const [status, setStatus] = useState('Encrypted local draft is ready.');

  useEffect(() => {
    readEncryptedCookie(cookieName).then((saved) => {
      if (saved) {
        setRecord({ ...emptyThoughtRecord, ...saved });
        setStatus('Loaded encrypted local draft from this browser.');
      }
    });
  }, []);

  const selectedMoodNames = useMemo(() => Object.keys(record.selectedMoods).filter((mood) => record.selectedMoods[mood] > 0), [record.selectedMoods]);

  const updateField = (field, value) => setRecord((current) => ({ ...current, [field]: value }));

  const setMood = (mood, value) => {
    const intensity = Number(value);
    setRecord((current) => ({
      ...current,
      selectedMoods: {
        ...current.selectedMoods,
        [mood]: intensity,
      },
      reratedMoods: current.reratedMoods[mood] === undefined ? { ...current.reratedMoods, [mood]: intensity } : current.reratedMoods,
    }));
  };

  const toggleMood = (mood) => {
    const current = record.selectedMoods[mood] ?? 0;
    if (current > 0) {
      setRecord((existing) => {
        const selectedMoods = { ...existing.selectedMoods };
        const reratedMoods = { ...existing.reratedMoods };
        delete selectedMoods[mood];
        delete reratedMoods[mood];
        return { ...existing, selectedMoods, reratedMoods };
      });
      return;
    }

    setMood(mood, 50);
  };

  const setRerate = (mood, value) => {
    setRecord((current) => ({
      ...current,
      reratedMoods: {
        ...current.reratedMoods,
        [mood]: Number(value),
      },
    }));
  };

  const saveDraft = async () => {
    try {
      await writeEncryptedCookie(cookieName, record);
      setStatus('Saved encrypted local draft in this browser.');
    } catch (error) {
      setStatus(error.message || 'Could not save encrypted local draft.');
    }
  };

  const clearDraft = () => {
    clearCookie(cookieName);
    setRecord(emptyThoughtRecord);
    setStatus('Cleared this encrypted local draft.');
  };

  return (
    <View style={styles.stack}>
      <View className="screen-only">
        <View style={styles.flagshipPanel}>
          <Text style={styles.eyebrow}>Flagship CBT exercise</Text>
          <Text style={styles.h1}>{automaticThoughtRecord.title}</Text>
          <Text style={styles.lead}>{automaticThoughtRecord.description}</Text>
          <Text style={styles.privacy}>Your draft is encrypted and saved only on this device. Nothing is sent to a server.</Text>
        </View>

        <WorksheetSection title="1. Situation" prompt="Where were you, who was involved, and what happened?">
          <BigInput value={record.situation} onChangeText={(value) => updateField('situation', value)} placeholder="Example: I saw the text was left on read after I asked a direct question." />
        </WorksheetSection>

        <WorksheetSection title="2. Moods and emotions" prompt="Select multiple moods from the emotion wheel and rate each one from 1–100.">
          <EmotionWheel selectedMoods={record.selectedMoods} onToggle={toggleMood} onIntensity={setMood} />
        </WorksheetSection>

        <WorksheetSection title="3. Automatic thought" prompt="What went through your mind? Capture the thought, image, prediction, or meaning exactly as it showed up.">
          <BigInput value={record.automaticThought} onChangeText={(value) => updateField('automaticThought', value)} placeholder="Example: They do not care about me. I am being ignored." />
        </WorksheetSection>

        <WorksheetSection title="4. Evidence for the thought" prompt="List facts that seem to support the automatic thought. Keep this factual rather than interpretive.">
          <BigInput value={record.evidenceFor} onChangeText={(value) => updateField('evidenceFor', value)} placeholder="What facts make the thought feel true?" />
        </WorksheetSection>

        <WorksheetSection title="5. Evidence against the thought" prompt="List facts that do not fit, complicate, or soften the automatic thought.">
          <BigInput value={record.evidenceAgainst} onChangeText={(value) => updateField('evidenceAgainst', value)} placeholder="What facts point another way?" />
        </WorksheetSection>

        <WorksheetSection title="6. Balanced alternative thought" prompt="Write a thought that is accurate, compassionate, and not extreme.">
          <BigInput value={record.balancedThought} onChangeText={(value) => updateField('balancedThought', value)} placeholder="Example: I do not know why they have not replied. It hurts, but there may be other explanations, and I can decide what boundary I need." />
        </WorksheetSection>

        <WorksheetSection title="7. Re-rate mood" prompt="After writing the balanced thought, re-rate the moods you selected earlier.">
          {selectedMoodNames.length === 0 && <Text style={styles.body}>Select moods above first. They will appear here for re-rating.</Text>}
          {selectedMoodNames.map((mood) => (
            <View key={mood} style={styles.rerateRow}>
              <Text style={styles.moodName}>{mood}</Text>
              <Text style={styles.body}>Before: {record.selectedMoods[mood]}</Text>
              <TextInput
                accessibilityLabel={`Re-rate ${mood}`}
                value={String(record.reratedMoods[mood] ?? record.selectedMoods[mood] ?? 0)}
                onChangeText={(value) => setRerate(mood, value)}
                keyboardType="numeric"
                style={styles.numberInput}
              />
            </View>
          ))}
        </WorksheetSection>

        <WorksheetSection title="Optional notes" prompt="Anything you want to remember before saving or printing?">
          <BigInput value={record.notes} onChangeText={(value) => updateField('notes', value)} placeholder="Supportive next step, boundary, person to call, or reminder." />
        </WorksheetSection>

        <View style={styles.actionPanel}>
          <Text style={styles.status}>{status}</Text>
          <View style={styles.actions}>
            <Pressable onPress={saveDraft} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Save encrypted draft</Text></Pressable>
            <Pressable onPress={() => window.print()} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Print worksheet</Text></Pressable>
            <Pressable onPress={clearDraft} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Clear draft</Text></Pressable>
          </View>
        </View>
      </View>

      <PrintableWorksheet record={record} selectedMoodNames={selectedMoodNames} />
    </View>
  );
}

function PrintableWorksheet({ record, selectedMoodNames }) {
  const rows = [...selectedMoodNames, '', '', '', ''].slice(0, 4);

  return (
    <View className="printable-worksheet">
      <View className="print-header">
        <Text className="print-title">Automatic Thought Record</Text>
        <Text className="print-purpose">Purpose: slow down, name the trigger, identify emotions and thoughts, choose a skillful response, and reflect on what changed.</Text>
      </View>

      <View className="print-meta-row">
        <Text>Date: ____________________</Text>
        <Text>Time: ____________________</Text>
      </View>

      <View className="print-section print-avoid-break">
        <Text className="print-section-title">1. Situation / trigger</Text>
        <Text className="print-answer">{answerText(record.situation)}</Text>
      </View>

      <View className="print-section print-avoid-break">
        <Text className="print-section-title">2. Pick emotions</Text>
        <Text className="print-small">Examples: {exampleEmotions.join(', ')}</Text>
        <View className="print-rating-table">
          <View className="print-table-row print-table-head">
            <Text>Emotion</Text>
            <Text>Before 0–10</Text>
            <Text>After 0–10</Text>
          </View>
          {rows.map((mood, index) => (
            <View className="print-table-row" key={`${mood || 'blank'}-${index}`}>
              <Text>{mood || '________________'}</Text>
              <Text>{mood ? toTen(record.selectedMoods[mood]) : '____'}</Text>
              <Text>{mood ? toTen(record.reratedMoods[mood] ?? record.selectedMoods[mood]) : '____'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="print-grid-two">
        <PrintField title="3. Thoughts / beliefs" value={record.automaticThought} />
        <PrintField title="4. Body sensations / urges" value="" />
      </View>

      <View className="print-grid-two">
        <PrintField title="5. Evidence for" value={record.evidenceFor} />
        <PrintField title="6. Evidence against" value={record.evidenceAgainst} />
      </View>

      <View className="print-section print-avoid-break">
        <Text className="print-section-title">7. Balanced thought / skill or response chosen</Text>
        <Text className="print-answer">{answerText(record.balancedThought)}</Text>
        <Text className="print-line-label">Skill or response chosen: ______________________________________________________________________</Text>
      </View>

      <View className="print-section print-avoid-break">
        <Text className="print-section-title">8. Reflection</Text>
        <Text className="print-small">What changed? What helped? What will I try next time?</Text>
        <Text className="print-answer">{answerText(record.notes)}</Text>
      </View>
    </View>
  );
}

function PrintField({ title, value }) {
  return (
    <View className="print-section print-avoid-break">
      <Text className="print-section-title">{title}</Text>
      <Text className="print-answer">{answerText(value)}</Text>
    </View>
  );
}

function WorksheetSection({ title, prompt, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>{title}</Text>
      <Text style={styles.body}>{prompt}</Text>
      {children}
    </View>
  );
}

function BigInput({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.textArea}
    />
  );
}

function EmotionWheel({ selectedMoods, onToggle, onIntensity }) {
  return (
    <View style={styles.wheelGrid}>
      {emotionWheelGroups.map((group) => (
        <View key={group.core} style={styles.emotionGroup}>
          <Text style={styles.coreMood}>{group.core}</Text>
          <View style={styles.moodWrap}>
            {group.moods.map((mood) => {
              const selected = (selectedMoods[mood] ?? 0) > 0;
              return (
                <View key={mood} style={[styles.moodPill, selected && styles.moodPillSelected]}>
                  <Pressable onPress={() => onToggle(mood)}>
                    <Text style={[styles.moodText, selected && styles.moodTextSelected]}>{mood}</Text>
                  </Pressable>
                  {selected && (
                    <TextInput
                      accessibilityLabel={`${mood} intensity`}
                      value={String(selectedMoods[mood])}
                      onChangeText={(value) => onIntensity(mood, value)}
                      keyboardType="numeric"
                      style={styles.pillNumberInput}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
  flagshipPanel: { backgroundColor: '#ffffff', borderColor: '#2f6258', borderWidth: 2, borderRadius: 28, padding: 24, gap: 12, marginBottom: 20 },
  card: { backgroundColor: '#ffffff', borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 22, padding: 20, gap: 12, marginBottom: 20 },
  actionPanel: { backgroundColor: '#f8f5ef', borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 22, padding: 20, gap: 12 },
  eyebrow: { color: '#2f6258', fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  h1: { color: '#18211f', fontSize: 34, lineHeight: 40, fontWeight: '900' },
  h2: { color: '#18211f', fontSize: 22, fontWeight: '850' },
  lead: { color: '#5c6a66', fontSize: 18, lineHeight: 28 },
  body: { color: '#5c6a66', fontSize: 16, lineHeight: 24 },
  privacy: { color: '#2f6258', fontSize: 15, fontWeight: '800', lineHeight: 22 },
  textArea: { minHeight: 110, borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 16, padding: 12, color: '#18211f', backgroundColor: '#fff' },
  wheelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 },
  emotionGroup: { borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 18, padding: 14, gap: 10, backgroundColor: '#fbfbf8' },
  coreMood: { color: '#18211f', fontSize: 18, fontWeight: '900' },
  moodWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodPill: { borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff' },
  moodPillSelected: { borderColor: '#2f6258', backgroundColor: '#e7f0ed' },
  moodText: { color: '#5c6a66', fontWeight: '750' },
  moodTextSelected: { color: '#2f6258' },
  pillNumberInput: { minWidth: 44, borderColor: '#2f6258', borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8, color: '#18211f', backgroundColor: '#fff' },
  rerateRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, borderTopColor: '#d7ddd9', borderTopWidth: 1, paddingTop: 10 },
  moodName: { color: '#18211f', fontWeight: '900', minWidth: 120 },
  numberInput: { width: 80, borderColor: '#d7ddd9', borderWidth: 1, borderRadius: 12, padding: 10, color: '#18211f', backgroundColor: '#fff' },
  status: { color: '#2f6258', fontWeight: '800' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  primaryButton: { backgroundColor: '#2f6258', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18 },
  primaryButtonText: { color: '#fff', fontWeight: '900' },
  secondaryButton: { borderColor: '#2f6258', borderWidth: 1, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18 },
  secondaryButtonText: { color: '#2f6258', fontWeight: '900' },
});
