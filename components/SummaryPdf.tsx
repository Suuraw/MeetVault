// components/SummaryPDF.tsx
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 48,
    paddingBottom: 70,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 6,
  },
  date: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  h1: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  h2: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginTop: 18,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  h3: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 6,
  },
  h4: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#374151',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 8,
  },
  subListItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 28,
  },
  bullet: {
    width: 16,
    fontSize: 11,
    color: '#6366f1',
    fontFamily: 'Helvetica-Bold',
  },
  subBullet: {
    width: 16,
    fontSize: 11,
    color: '#9ca3af',
  },
  listText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  subListText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.6,
    color: '#4b5563',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
  },
})

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .trim()
}

function parseMarkdown(markdown: string): React.ReactNode[] {
  const lines = markdown.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // blank
    if (trimmed === '') {
      nodes.push(<View key={key++} style={{ marginBottom: 4 }} />)
      continue
    }

    // horizontal rule: line is ONLY dashes/equals (e.g. ---, ---, ===)
    if (/^[-=]{2,}$/.test(trimmed)) {
      nodes.push(<View key={key++} style={styles.hr} />)
      continue
    }

    // h4: ####
    if (trimmed.startsWith('#### ')) {
      nodes.push(
        <Text key={key++} style={styles.h4}>
          {stripInline(trimmed.slice(5))}
        </Text>
      )
      continue
    }

    // h3: ###
    if (trimmed.startsWith('### ')) {
      nodes.push(
        <Text key={key++} style={styles.h3}>
          {stripInline(trimmed.slice(4))}
        </Text>
      )
      continue
    }

    // h2: ##
    if (trimmed.startsWith('## ')) {
      nodes.push(
        <Text key={key++} style={styles.h2}>
          {stripInline(trimmed.slice(3))}
        </Text>
      )
      continue
    }

    // h1: #
    if (trimmed.startsWith('# ')) {
      nodes.push(
        <Text key={key++} style={styles.h1}>
          {stripInline(trimmed.slice(2))}
        </Text>
      )
      continue
    }

    // Gemini sub-bullet: "    *   text" — 4 spaces indent before *
    // raw line starts with 4+ spaces then * or -
    if (/^\s{4,}[*-]\s+/.test(raw)) {
      const text = raw.replace(/^\s+[*-]\s+/, '')
      nodes.push(
        <View key={key++} style={styles.subListItem}>
          <Text style={styles.subBullet}>◦</Text>
          <Text style={styles.subListText}>{stripInline(text)}</Text>
        </View>
      )
      continue
    }

    // Gemini top bullet: "*   text" or "-   text" (trimmed starts with * or -)
    if (/^[*-]\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[*-]\s+/, '')
      nodes.push(
        <View key={key++} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>{stripInline(text)}</Text>
        </View>
      )
      continue
    }

    // numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
    if (numMatch) {
      nodes.push(
        <View key={key++} style={styles.listItem}>
          <Text style={styles.bullet}>{numMatch[1]}.</Text>
          <Text style={styles.listText}>{stripInline(numMatch[2])}</Text>
        </View>
      )
      continue
    }

    // paragraph
    nodes.push(
      <Text key={key++} style={styles.paragraph}>
        {stripInline(trimmed)}
      </Text>
    )
  }

  return nodes
}

export const SummaryPDF = ({
  title,
  date,
  content,
}: {
  title: string
  date: string
  content: string
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={styles.sectionLabel}>Meeting Summary</Text>

      {parseMarkdown(content)}

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>MeetVault</Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
)