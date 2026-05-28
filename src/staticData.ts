import { ActivityChange, APIDocEndpoint, ContributorRanking, Project, SystemAlert } from './types';

const now = () => new Date().toISOString();

let projects: Project[] = [
  {
    id: 'ym-hot-1',
    projectId: 'HOT #14320',
    title: 'YouthMappers - Rwanda Rural Roads Mapping for Healthcare Access',
    description: 'Collaborative effort by CGIS-NUR YouthMappers chapter to map secondary roads and footpaths in western Rwanda to improve ambulance response times.',
    source: 'HOT',
    status: 'Needs Validation',
    percentMapped: 94.2,
    percentValidated: 48.5,
    totalTasks: 350,
    mappedTasks: 330,
    validatedTasks: 170,
    campaign: 'YouthMappers Regional Road Rally',
    url: 'https://tasks.hotosm.org/projects/14320',
    lastUpdated: now(),
    difficulty: 'Medium',
    country: 'Rwanda',
  },
  {
    id: 'ym-hot-2',
    projectId: 'HOT #13890',
    title: 'YouthMappers - Sierra Leone Flood Resilience Mapping',
    description: 'Fourah Bay College YouthMappers are digitizing buildings and waterways in Freetown suburbs highly susceptible to seasonal landslide hazards.',
    source: 'HOT',
    status: 'Active',
    percentMapped: 67.5,
    percentValidated: 22.1,
    totalTasks: 480,
    mappedTasks: 324,
    validatedTasks: 106,
    campaign: 'Disaster Resilience 2026',
    url: 'https://tasks.hotosm.org/projects/13890',
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    difficulty: 'Easy',
    country: 'Sierra Leone',
  },
  {
    id: 'ym-teach-1',
    projectId: 'TeachOSM #1052',
    title: 'YouthMappers - West Africa Coastal Erosion Digitization Project',
    description: 'TeachOSM campaign supporting university chapters in Togo and Benin to map coastline structures and monitor environmental degradation.',
    source: 'TeachOSM',
    status: 'Almost Completed',
    percentMapped: 99.1,
    percentValidated: 88.4,
    totalTasks: 210,
    mappedTasks: 208,
    validatedTasks: 185,
    campaign: 'Climate Change Monitoring',
    url: 'https://tasks.teachosm.org/project/1052',
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    difficulty: 'Hard',
    country: 'Togo',
  },
  {
    id: 'ym-hot-3',
    projectId: 'HOT #14612',
    title: 'YouthMappers - Nepal Earthquake Recovery Mapping Phase II',
    description: 'Geospatial mapping support coordinated with Tribhuvan University YouthMappers to map remote settlements in Gorkha district.',
    source: 'HOT',
    status: 'Active',
    percentMapped: 41.2,
    percentValidated: 8.5,
    totalTasks: 600,
    mappedTasks: 247,
    validatedTasks: 51,
    campaign: 'Earthquake Preparedness',
    url: 'https://tasks.hotosm.org/projects/14612',
    lastUpdated: new Date(Date.now() - 14400000).toISOString(),
    difficulty: 'Hard',
    country: 'Nepal',
  },
  {
    id: 'ym-teach-2',
    projectId: 'TeachOSM #1085',
    title: 'YouthMappers - Colombia Sustainable Farm Infrastructure Census',
    description: 'Mappers from SAGRE YouthMappers at UPTC mapping rural greenhouses and access points for smallholder coffee and cacao cooperatives.',
    source: 'TeachOSM',
    status: 'Fully Validated',
    percentMapped: 100,
    percentValidated: 100,
    totalTasks: 180,
    mappedTasks: 180,
    validatedTasks: 180,
    campaign: 'Agricultural Sustainability',
    url: 'https://tasks.teachosm.org/project/1085',
    lastUpdated: new Date(Date.now() - 43200000).toISOString(),
    difficulty: 'Medium',
    country: 'Colombia',
  },
  {
    id: 'ym-hot-4',
    projectId: 'HOT #15201',
    title: 'YouthMappers - Kenya Malaria Prevention Vector Control Mapping',
    description: 'Clearing residential areas in Western Kenya for bed net distribution plans in partnership with USAID and local YouthMappers chapters.',
    source: 'HOT',
    status: 'Needs Validation',
    percentMapped: 85,
    percentValidated: 60,
    totalTasks: 400,
    mappedTasks: 340,
    validatedTasks: 240,
    campaign: 'YouthMappers Malaria Fight',
    url: 'https://tasks.hotosm.org/projects/15201',
    lastUpdated: new Date(Date.now() - 17200000).toISOString(),
    difficulty: 'Easy',
    country: 'Kenya',
  },
];

let contributors: ContributorRanking[] = [
  { rank: 1, name: 'Regina Mwangi', chapter: 'Nairobi Uni YouthMappers', mappedCount: 840, validatedCount: 520, score: 2400, badges: ['Elite Validator', 'Kenya Champion', 'HOT Scholar'] },
  { rank: 2, name: 'Jean-Luc Habimana', chapter: 'CGIS-NUR Rwanda', mappedCount: 910, validatedCount: 310, score: 1840, badges: ['Power Mapper', 'Rwanda Pioneer'] },
  { rank: 3, name: 'Suman Shrestha', chapter: 'Tribhuvan YouthMappers', mappedCount: 620, validatedCount: 400, score: 1820, badges: ['Validation Lead', 'Himalayan Cartographer'] },
  { rank: 4, name: 'Mateo Velasquez', chapter: 'UPTC Colombia', mappedCount: 750, validatedCount: 290, score: 1630, badges: ['Coffee Region Mapper', 'Cacao Scout'] },
  { rank: 5, name: 'Abigail Koroma', chapter: 'FBC Sierra Leone', mappedCount: 880, validatedCount: 120, score: 1240, badges: ['Building Digitizer', 'Coast Guard'] },
  { rank: 6, name: 'Kofi Mensah', chapter: 'UCC YouthMappers Ghana', mappedCount: 410, validatedCount: 220, score: 1070, badges: ['Validation Scout'] },
];

let activities: ActivityChange[] = [
  { id: 'act-1', projectId: 'ym-hot-1', projectTitle: 'CGIS-NUR Rwanda Roads Mapping', user: 'Regina Mwangi', action: 'Validated', count: 12, timestamp: new Date(Date.now() - 600000).toISOString(), source: 'HOT' },
  { id: 'act-2', projectId: 'ym-hot-2', projectTitle: 'Sierra Leone Flood Resilience', user: 'Jean-Luc Habimana', action: 'Mapped', count: 25, timestamp: new Date(Date.now() - 1500000).toISOString(), source: 'HOT' },
  { id: 'act-3', projectId: 'ym-teach-1', projectTitle: 'West Africa Coastal Erosion', user: 'Suman Shrestha', action: 'Validated', count: 8, timestamp: new Date(Date.now() - 3200000).toISOString(), source: 'TeachOSM' },
  { id: 'act-4', projectId: 'ym-hot-3', projectTitle: 'Nepal Earthquake Recovery', user: 'Mateo Velasquez', action: 'Mapped', count: 18, timestamp: new Date(Date.now() - 7200000).toISOString(), source: 'HOT' },
];

let alerts: SystemAlert[] = [
  { id: 'al-1', title: 'Target Mapped Reached', message: 'Sierra Leone Flood Resilience project has reached 65% mapped tiles. Excellent speed!', timestamp: now(), severity: 'success', unread: true },
  { id: 'al-2', title: 'Urgent Validation Required', message: 'Nepal Earthquake Recovery Phase II requires immediate validation of building polygons.', timestamp: new Date(Date.now() - 10800000).toISOString(), severity: 'warning', unread: true },
  { id: 'al-3', title: 'Chapter Joined Network', message: 'Welcome Uni of Goma YouthMappers (DRC) to the official validation workforce!', timestamp: new Date(Date.now() - 86400000).toISOString(), severity: 'info', unread: false },
];

let encryptionLogs = [
  {
    timestamp: new Date(Date.now() - 500000).toISOString(),
    endpoint: '/api/auth/register',
    originalPayloadSize: 114,
    cipherTextPreview: 'U2FsdGVkX1+z+8vM78O/7a6q/uU8cM5qf2W6+Rz9PzUfS+8P/d1...',
    decryptedPlaintext: '{"email":"validator.lead@youthmappers.org","password":"[DECRYPTED_SHA256_HASH]","role":"Validator","chapter":"CGIS-NUR"}',
  },
];

const apiEndpoints: APIDocEndpoint[] = [
  {
    method: 'POST',
    path: '/api/projects/sync',
    description: 'Trigger real-time live synchronization using server-side Tasking Manager API calls when an Express backend is available. Static GitHub Pages builds use bundled dashboard data.',
    responseBody: JSON.stringify({ success: true, message: 'Static Pages mode loaded bundled YouthMappers projects.', count: projects.length }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/projects',
    description: 'Fetch filtered and monitored YouthMappers validation projects currently running on HOT or TeachOSM TM.',
    responseBody: JSON.stringify({ success: true, projects: [{ id: 'ym-hot-1', projectId: 'HOT #14320', title: 'YouthMappers...', source: 'HOT', status: 'Needs Validation', percentMapped: 94.2 }] }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/projects/:id/validate',
    description: 'Submit validated tiles. In static mode this updates local in-browser state for demonstration.',
    headers: { 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({ encryptedPayload: 'eyJjb3VudCI6MTAsInZhbGlkYXRvck5hbWUiOiJKb2huIERvZSJ9', validatorEmail: 'validator@youthmappers.org' }, null, 2),
    responseBody: JSON.stringify({ success: true, project: { id: 'ym-hot-1', projectId: 'HOT #14320', validatedTasks: 180, percentValidated: 51.4 } }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/projects/create',
    description: 'Initiate monitoring of a new YouthMappers project campaign. Static mode stores it in the current browser session.',
    headers: { 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({ title: 'Nairobi Flood Resiliency Mapping', projectId: 'HOT #15250', source: 'HOT', totalTasks: 300, campaign: '2026 Resiliency Rally', country: 'Kenya' }, null, 2),
    responseBody: JSON.stringify({ success: true, project: { id: 'ym-hot-15250', title: 'YouthMappers - Nairobi Flood...', status: 'Active' } }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/leaderboard',
    description: 'Fetch global rankings, task scores, mapping/validation summaries, and custom earned badges of regional YouthMappers.',
    responseBody: JSON.stringify({ success: true, contributors: [{ rank: 1, name: 'Regina Mwangi', chapter: 'Nairobi Uni YouthMappers', score: 2400 }] }, null, 2),
  },
];

export function getStaticDashboardData() {
  return {
    projects: [...projects],
    contributors: [...contributors],
    alerts: [...alerts],
    activities: [...activities],
    encryptionLogs: [...encryptionLogs],
    apiEndpoints,
  };
}

export function syncStaticProjects() {
  alerts.unshift({
    id: `al-sync-${Date.now()}`,
    title: 'Static Dashboard Ready',
    message: 'GitHub Pages mode is using bundled YouthMappers sample data because no Express API is attached.',
    timestamp: now(),
    severity: 'success',
    unread: true,
  });

  return {
    success: true,
    message: 'Static GitHub Pages dashboard refreshed successfully.',
    projects: [...projects],
  };
}

export function validateStaticProject(projectId: string, count: number, encryptedPayload: string, validatorEmail: string) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return { success: false, message: 'Project not found' };

  const toAdd = Math.min(count || 5, Math.max(0, project.mappedTasks - project.validatedTasks));
  project.validatedTasks += toAdd;
  project.percentValidated = Math.round((project.validatedTasks / project.totalTasks) * 1000) / 10;
  project.lastUpdated = now();
  if (project.validatedTasks >= project.totalTasks) project.status = 'Fully Validated';

  activities.unshift({ id: `act-${Date.now()}`, projectId, projectTitle: project.title.split(' - ')[1] || project.title, user: validatorEmail, action: 'Validated', count: toAdd, timestamp: now(), source: project.source });
  encryptionLogs.unshift({ timestamp: now(), endpoint: `/api/projects/${projectId}/validate`, originalPayloadSize: encryptedPayload.length, cipherTextPreview: `${encryptedPayload.slice(0, 48)}...`, decryptedPlaintext: 'Static Pages mode stores this validation only in browser memory.' });
  alerts.unshift({ id: `al-${Date.now()}`, title: 'Batch Tiles Validated', message: `${validatorEmail} validated ${toAdd} tiles on project ${project.projectId}.`, timestamp: now(), severity: 'success', unread: true });

  return { success: true, project };
}

export function mapStaticProject(projectId: string, count: number, mapperName: string) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return { success: false, message: 'Project not found' };

  const toAdd = Math.min(count || 5, Math.max(0, project.totalTasks - project.mappedTasks));
  project.mappedTasks += toAdd;
  project.percentMapped = Math.round((project.mappedTasks / project.totalTasks) * 1000) / 10;
  project.lastUpdated = now();
  if (project.status === 'Active' && project.percentMapped >= 95) project.status = 'Needs Validation';

  activities.unshift({ id: `act-${Date.now()}`, projectId, projectTitle: project.title.split(' - ')[1] || project.title, user: mapperName, action: 'Mapped', count: toAdd, timestamp: now(), source: project.source });
  alerts.unshift({ id: `al-${Date.now()}`, title: 'Task Mapping Activity', message: `${mapperName} submitted ${toAdd} newly mapped tiles.`, timestamp: now(), severity: 'info', unread: true });

  return { success: true, project };
}

export function createStaticProject(input: {
  title: string;
  projectId: string;
  source: 'HOT' | 'TeachOSM';
  totalTasks: number;
  campaign: string;
  country: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}) {
  if (!input.title || !input.projectId || !input.source || !input.totalTasks) {
    return { success: false, message: 'Missing required fields' };
  }

  const project: Project = {
    id: `ym-${input.source.toLowerCase()}-${Date.now()}`,
    projectId: input.projectId,
    title: input.title.startsWith('YouthMappers') ? input.title : `YouthMappers - ${input.title}`,
    description: input.description || 'Digitizing infrastructure and boundaries to empower community resilience programs.',
    source: input.source,
    status: 'Active',
    percentMapped: 0,
    percentValidated: 0,
    totalTasks: Number(input.totalTasks),
    mappedTasks: 0,
    validatedTasks: 0,
    campaign: input.campaign || 'Focused Capacity Building',
    url: input.source === 'TeachOSM' ? `https://tasks.teachosm.org/project/${input.projectId.replace(/\D/g, '')}` : `https://tasks.hotosm.org/projects/${input.projectId.replace(/\D/g, '')}`,
    lastUpdated: now(),
    difficulty: input.difficulty || 'Medium',
    country: input.country || 'Global Focus',
  };

  projects.unshift(project);
  alerts.unshift({ id: `al-${Date.now()}`, title: 'New YouthMappers Campaign', message: `Campaign ${project.projectId} was added to tracking list: ${project.title}.`, timestamp: now(), severity: 'success', unread: true });

  return { success: true, project };
}

export function markStaticAlertsRead() {
  alerts = alerts.map((alert) => ({ ...alert, unread: false }));
}

export function buildStaticCSV(selectedSource: string) {
  const targetProjects = selectedSource && selectedSource !== 'All'
    ? projects.filter((project) => project.source === selectedSource)
    : projects;
  const header = 'ID,Project ID,Title,Source,Status,Total Tiles,Mapped Tiles,Validated Tiles,% Mapped,% Validated,Campaign,Difficulty,Country\n';
  const rows = targetProjects.map((project) => (
    `"${project.id}","${project.projectId}","${project.title.replace(/"/g, '""')}","${project.source}","${project.status}",${project.totalTasks},${project.mappedTasks},${project.validatedTasks},${project.percentMapped},${project.percentValidated},"${project.campaign.replace(/"/g, '""')}","${project.difficulty}","${project.country}"`
  ));

  return `${header}${rows.join('\n')}\n`;
}
