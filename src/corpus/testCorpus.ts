import { ArtifactCategory } from '../detector/types';

export interface TestCase {
  id: string;
  text: string;
  expectedCategory: ArtifactCategory;
  isArtifact: boolean;
  notes?: string;
}

export const TEST_CORPUS: TestCase[] = [
  // ==========================================
  // 1. NORMAL PROSE (Should NOT trigger artifacts)
  // ==========================================
  {
    id: 'norm-001',
    text: 'Relational database management systems organize data into structured tables consisting of rows and columns.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Technical explanation in textbook prose',
  },
  {
    id: 'norm-002',
    text: 'The quarterly financial results exceeded expectations, driven primarily by recurring software revenue.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Business report style',
  },
  {
    id: 'norm-003',
    text: 'Photosynthesis is the biological process used by plants and other organisms to convert light energy into chemical energy.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Scientific definition',
  },
  {
    id: 'norm-004',
    text: 'The quick brown fox jumps over the lazy dog in a classic pangram test.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Standard text sample',
  },
  {
    id: 'norm-005',
    text: 'Our team evaluated three competing cloud architecture proposals and selected the serverless approach for cost efficiency.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Internal memo prose',
  },
  {
    id: 'norm-006',
    text: 'To install the package, execute the command in your root directory and restart the daemon.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Standard software documentation',
  },
  {
    id: 'norm-007',
    text: 'The protagonist stood by the edge of the cliffs, observing the stormy waves crashing beneath the lighthouse.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Creative fiction',
  },
  {
    id: 'norm-008',
    text: 'A primary key is a column or set of columns in a relational database table that uniquely identifies each row.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Database documentation',
  },
  {
    id: 'norm-009',
    text: 'Please review the attached contract and let our legal counsel know if any amendments are needed before Friday.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Legitimate business correspondence',
  },
  {
    id: 'norm-010',
    text: 'Modern cryptographic algorithms rely on computational hardness assumptions such as the discrete logarithm problem.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Academic paper excerpt',
  },
  {
    id: 'norm-011',
    text: 'The function returns a promise that resolves with the parsed payload once streaming finishes.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'API documentation',
  },
  {
    id: 'norm-012',
    text: 'In the eighteenth century, the industrial revolution transformed manufacturing processes throughout Western Europe.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'History article',
  },
  {
    id: 'norm-013',
    text: 'Heat water to ninety degrees Celsius before pouring it slowly over the freshly ground beans.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Coffee brewing guide',
  },
  {
    id: 'norm-014',
    text: 'The company announced a thirty percent dividend increase following strong annual cash flows.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Press release excerpt',
  },
  {
    id: 'norm-015',
    text: 'This policy governs employee access to confidential client datasets and specifies required authorization tiers.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Corporate policy document',
  },
  {
    id: 'norm-016',
    text: 'We found that the catalyst accelerated reaction rates by a factor of four without degrading temperature stability.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Chemistry research paper',
  },
  {
    id: 'norm-017',
    text: 'Ensure the mounting bracket is securely fastened before attaching the heavy camera gimbal.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Hardware instruction manual',
  },
  {
    id: 'norm-018',
    text: 'The symposium will feature keynote speeches by renowned researchers in cognitive neuroscience.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Event announcement',
  },
  {
    id: 'norm-019',
    text: 'Configure the firewall to reject inbound packets targeting ports other than standard HTTPS ports.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Network security guide',
  },
  {
    id: 'norm-020',
    text: 'The architecture leverages event-driven messaging to decouple microservices and improve fault isolation.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'System architecture review',
  },
  {
    id: 'norm-021',
    text: 'A good resume highlights quantifiable achievements, technical leadership, and demonstrated business outcomes.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Career advice article',
  },
  {
    id: 'norm-022',
    text: 'The recipe requires four large eggs, unsalted butter, granulated sugar, and pure vanilla extract.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Baking recipe',
  },
  {
    id: 'norm-023',
    text: 'High latency during peak hours was mitigated by deploying a caching layer in front of the primary datastore.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Postmortem report',
  },
  {
    id: 'norm-024',
    text: 'The city council voted unanimously to allocate capital funding for municipal bike lane expansion.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'News report',
  },
  {
    id: 'norm-025',
    text: 'Each module exports a set of pure functions and maintains no internal mutable state.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Software specification',
  },

  // ==========================================
  // 2. OFFER TO CONTINUE
  // ==========================================
  {
    id: 'off-001',
    text: 'If you want, I can also explain columns, primary keys, or other DBMS terms.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
    notes: 'Classic assistant prompt offering further topics',
  },
  {
    id: 'off-002',
    text: "If you'd like, I can provide a step-by-step code example in Python.",
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-003',
    text: 'Let me know if you would like me to expand on any of these points!',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-004',
    text: 'Would you like me to generate a table comparing SQL and NoSQL databases?',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-005',
    text: "I'd be happy to write a unit test for this function if you wish.",
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-006',
    text: 'If you need more examples of asynchronous JavaScript, just let me know.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-007',
    text: 'Let me know if you want me to write the introductory section or focus on results.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-008',
    text: 'I can also cover edge cases and error handling if you would like.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-009',
    text: 'Would you like me to elaborate on the difference between inner and outer joins?',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-010',
    text: 'If you want, I can tailor this specifically to a macOS or Linux environment.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-011',
    text: 'We can also explore alternate styling libraries if you prefer Tailwind.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-012',
    text: 'Let me know if you would like me to draft an email response to this client.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-013',
    text: "If you'd like, I can break down the mathematical derivation in greater detail.",
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-014',
    text: 'Would you like me to include benchmark statistics in this summary?',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-015',
    text: 'If you need additional clarification on pointers or memory management, feel free to ask.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },

  // ==========================================
  // 3. ASSISTANT FRAMING
  // ==========================================
  {
    id: 'frm-001',
    text: 'Here is a clear and simple explanation of a Column in DBMS:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-002',
    text: 'Certainly! Below is a comprehensive breakdown of the trade policy:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-003',
    text: 'To answer your question regarding memory allocation in C++:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-004',
    text: 'As requested, here is a concise summary of the key findings from the quarterly report:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-005',
    text: "Let's dive right into the core architecture of Kubernetes.",
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-006',
    text: 'Here is a quick overview of how neural network backpropagation works:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-007',
    text: 'In this response, I will explain the differences between TCP and UDP protocols.',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-008',
    text: "Now, let's take a closer look at the advantages and disadvantages of microservices:",
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-009',
    text: 'Below is a detailed guide on configuring DNS records for custom domains:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-010',
    text: 'Here are a few practical tips to improve your writing speed:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-011',
    text: 'To address your prompt regarding quantum superposition in physics:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-012',
    text: 'Here is a list of recommended reading materials for junior developers:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-013',
    text: 'As you requested, I have provided three alternative slogans for the campaign:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-014',
    text: 'Here is a breakdown of the differences between relational and non-relational databases:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-015',
    text: "Let's delve into the mechanics of consensus algorithms in distributed ledgers.",
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },

  // ==========================================
  // 4. CONVERSATIONAL ACKNOWLEDGMENT
  // ==========================================
  {
    id: 'ack-001',
    text: "Sure! I'd be happy to help you with that.",
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-002',
    text: 'Great question! To understand how closures work in JavaScript:',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-003',
    text: "Certainly! Here's what you need to know about setting up SSH keys.",
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-004',
    text: 'Understood! Let us examine how recursion behaves with large call stacks.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-005',
    text: "No problem! Here is the corrected regex for validating email addresses.",
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-006',
    text: 'Absolutely! I can walk you through the OAuth2 authorization code grant flow.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-007',
    text: 'Excellent question! The difference hinges on how memory is referenced.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-008',
    text: 'I am happy to assist you with your resume critique.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-009',
    text: "Of course! Here's a concise version of the mission statement.",
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-010',
    text: 'Sure thing! Below is the updated JSON schema.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-011',
    text: 'Gladly! I will outline the major milestones for this sprint.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },
  {
    id: 'ack-012',
    text: 'Fantastic question! There are two distinct interpretations in literature.',
    expectedCategory: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    isArtifact: true,
  },

  // ==========================================
  // 5. AI STYLE CLOSING
  // ==========================================
  {
    id: 'cls-001',
    text: 'I hope this helps!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-002',
    text: 'Hope this helps clarify the difference between synchronous and asynchronous code!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-003',
    text: 'Feel free to ask if you have any further questions!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-004',
    text: "Don't hesitate to reach out if you need more assistance with this setup.",
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-005',
    text: 'Happy coding and best of luck with your software launch!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-006',
    text: 'Best of luck with your project!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-007',
    text: 'Always happy to assist anytime!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-008',
    text: 'Happy learning and let me know if you run into any errors!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-009',
    text: 'I hope this helps out with your assignment.',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-010',
    text: 'Feel free to reach out if you have any questions along the way.',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-011',
    text: 'Happy writing!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-012',
    text: 'Good luck with your interview preparations!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },

  // ==========================================
  // 6. META COMMENTARY
  // ==========================================
  {
    id: 'met-001',
    text: 'As an AI language model, I do not possess personal opinions or feelings.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-002',
    text: 'Here is the revised version incorporating your feedback from earlier:',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-003',
    text: 'Note that in the code snippet above, the timeout parameter is defined in milliseconds.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-004',
    text: 'Please make sure to replace YOUR_API_KEY with your actual production secret.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-005',
    text: 'Here is a summary of key changes I made to the draft:',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-006',
    text: 'As an assistant, I strive to provide objective and balanced information.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-007',
    text: 'Remember to replace the placeholder email with your actual administrative contact.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-008',
    text: 'Here is the updated version with the requested tone adjustments:',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-009',
    text: 'Note that in the example provided above, CORS headers are configured for local development.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'met-010',
    text: 'Summary of changes made to the text: improved sentence variety and eliminated redundant adverbs.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },

  // ==========================================
  // 7. PREVIOUS CONVERSATION REFERENCE
  // ==========================================
  {
    id: 'prv-001',
    text: 'As we discussed earlier in our previous chat, the initial deadline was unrealistic.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-002',
    text: 'Building on what you said regarding customer retention, we should analyze churn cohorts.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-003',
    text: 'Returning to your earlier point about load balancing, nginx can distribute requests across clusters.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-004',
    text: 'As I mentioned previously, cache invalidation is one of the most notoriously tricky problems.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-005',
    text: 'Building upon our earlier conversation, let us refine the user persona profiles.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-006',
    text: 'As noted in our previous chat, the API gateway enforces rate limits per tenant.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-007',
    text: 'Returning to your initial question regarding license compliance:',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },
  {
    id: 'prv-008',
    text: 'As you mentioned earlier, security auditing must precede production deployment.',
    expectedCategory: 'PREVIOUS_CONVERSATION_REFERENCE',
    isArtifact: true,
  },

  // ==========================================
  // 8. BORDERLINE CASES & FALSE-POSITIVE PRONE
  // ==========================================
  {
    id: 'bor-001',
    text: 'Without further ado, let us review the candidate applications.',
    expectedCategory: 'BORDERLINE',
    isArtifact: true,
  },
  {
    id: 'bor-002',
    text: 'In a nutshell, the merger consolidates distribution networks across North America.',
    expectedCategory: 'BORDERLINE',
    isArtifact: true,
  },
  {
    id: 'bor-003',
    text: 'Researchers must delve into the empirical data to uncover subtle demographic correlations.',
    expectedCategory: 'BORDERLINE',
    isArtifact: true,
  },
  {
    id: 'bor-004',
    text: 'The investigation delved into the financial discrepancies uncovered by the forensic auditor.',
    expectedCategory: 'BORDERLINE',
    isArtifact: true,
  },
  {
    id: 'fp-001',
    text: 'The teacher answered: "Here is where the equation balances when x equals zero."',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Quotation containing conversational phrase in natural human story',
  },
  {
    id: 'fp-002',
    text: 'Our technical support team is happy to assist customers during regular office hours.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Company statement about customer support, not assistant speaking directly to reader',
  },
  {
    id: 'fp-003',
    text: 'If you want fresh produce, the local farmers market opens every Saturday at dawn.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Natural conditional sentence without conversational assistant offering',
  },
  {
    id: 'fp-004',
    text: 'The defense attorney raised a great question regarding witness credibility.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Description of an attorney, not conversational assistant praise',
  },
  {
    id: 'fp-005',
    text: 'We hope this grant helps fund critical wildlife conservation initiatives across the valley.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
    notes: 'Legitimate philanthropic statement',
  },
  {
    id: 'norm-026',
    text: 'The solar panels convert approximately twenty-two percent of incident sunlight into electrical power.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-027',
    text: 'Patients with hypertension should monitor their sodium intake and engage in regular aerobic exercise.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-028',
    text: 'The operating system schedules processes using a multilevel feedback queue with dynamic priority boosts.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-029',
    text: 'Archaeologists discovered fragments of Roman pottery buried beneath layers of alluvial clay.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-030',
    text: 'The algorithm achieves sub-millisecond query latency through memory-mapped inverted indices.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-031',
    text: 'Employees wishing to enroll in the retirement savings plan must submit their forms before open enrollment closes.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-032',
    text: 'The conductor raised the baton, and the orchestra launched into the opening movement of the symphony.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-033',
    text: 'The compiler optimizes recursive tail calls into efficient iterative loops to prevent stack overflow.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-034',
    text: 'Urban planners recommend creating pedestrian corridors between transit hubs and residential zones.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'norm-035',
    text: 'The telemetry stream includes GPS coordinates, engine temperature, tire pressure, and battery voltage.',
    expectedCategory: 'NORMAL_PROSE',
    isArtifact: false,
  },
  {
    id: 'off-016',
    text: 'If you want, I can also provide the equivalent code snippet written in Rust.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-017',
    text: 'Let me know if you would like me to adjust the vocabulary level for an elementary audience.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'off-018',
    text: 'I would be happy to draft an executive summary highlighting these three takeaways.',
    expectedCategory: 'OFFER_TO_CONTINUE',
    isArtifact: true,
  },
  {
    id: 'frm-016',
    text: 'Here is a clear and simple explanation of how public-key cryptography operates:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'frm-017',
    text: 'Below is a concise breakdown of the three phases of cellular respiration:',
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
  {
    id: 'cls-013',
    text: 'I hope this helps you get started on your thesis proposal!',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'cls-014',
    text: 'Feel free to ask if you need further assistance with debugging this script.',
    expectedCategory: 'AI_STYLE_CLOSING',
    isArtifact: true,
  },
  {
    id: 'met-011',
    text: 'In the revised draft below, I removed passive voice and tightened the introduction.',
    expectedCategory: 'META_COMMENTARY',
    isArtifact: true,
  },
  {
    id: 'frm-018',
    text: "Sure, let's take a closer look at this concept.",
    expectedCategory: 'ASSISTANT_FRAMING',
    isArtifact: true,
  },
];
